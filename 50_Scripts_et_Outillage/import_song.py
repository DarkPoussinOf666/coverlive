#!/usr/bin/env python3
"""
CLI d'importation unitaire et batch pour Ultimate Guitar
Projet : Your Reign Is Over - Live Prompt & Tabs Manager
"""

import sys
import os
import json
import re
import urllib.request
import argparse

# Forcer l'encodage UTF-8 sous Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
CATALOG_PATH = os.path.join(PROJECT_ROOT, '90_Code_Source', 'app', 'src', 'data', 'importedCatalog.json')
CACHE_PATH = os.path.join(SCRIPT_DIR, 'ug_tabs_cache.json')

# Import du module de nettoyage existant
sys.path.insert(0, SCRIPT_DIR)
from ug_cleaner import clean_ug_content

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def suggest_gear(artist: str):
    """Attribue intelligemment la guitare et le preset Kemper selon l'artiste."""
    a = (artist or '').lower()
    
    if any(k in a for k in ['cash', 'obel', 'dylan', 'folk', 'acoustic', 'brassens', 'lennon', 'simon', 'garfunkel', 'stevens']):
        return 'Lag Primavera', 'Acoustic Preamp Clean', 'Ditto X2 + Eventide H9 Space'
    elif any(k in a for k in ['nirvana', 'pixies', 'white stripes', 'cage', 'smashing', 'placebo', 'radiohead']):
        return 'Fender Jaguar', 'Vox AC30 Top Boost', 'Boss OD-200 Crunch + Eventide Delay'
    elif any(k in a for k in ['incubus', 'coldplay', 'verve', 'john mayer', 'blue stones', 'larkin poe']):
        return 'Duesenberg Paloma', 'Dumble Clean & Crunch', 'Soul Food Klon + Synth9 Ambient'
    elif any(k in a for k in ['foo fighters', 'green day', 'audioslave', 'cult', 'red hot', 'rhcp', 'chili peppers']):
        return 'Fender Telecaster Baja', 'Deluxe Reverb Tweed', 'ZVex Fuzz Factory Solo'
    else:
        return 'Lag Roxanne', 'Marshall JCM800 Rock', 'Eventide H9 Shimmer + Memory Man'

def fetch_ug_song(url: str):
    """Télécharge la page Ultimate Guitar et extrait la grille propre et les métadonnées."""
    if 'ultimate-guitar.com' not in url:
        raise ValueError("L'URL doit provenir du domaine tabs.ultimate-guitar.com")

    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')

    match = re.search(r'<div class="js-store" data-content="([^"]+)"', html)
    if not match:
        raise ValueError("Impossible de localiser le conteneur js-store sur cette page.")

    raw_json = match.group(1).replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&#039;', "'").replace('&#39;', "'")
    store = json.loads(raw_json)

    page_data = store.get('store', {}).get('page', {}).get('data', {})
    tab_data = page_data.get('tab', {})
    tab_view = page_data.get('tab_view', {})
    wiki_tab = tab_view.get('wiki_tab', {})

    raw_content = wiki_tab.get('content', '')
    if not raw_content:
        raise ValueError("La page ne contient pas de tablature texte exploitable (wiki_tab).")

    title = clean_ug_content(tab_data.get('song_name', 'Sans titre'))
    artist = clean_ug_content(tab_data.get('artist_name', 'Artiste inconnu'))
    meta_obj = tab_view.get('meta')
    meta = meta_obj if isinstance(meta_obj, dict) else {}

    key = tab_data.get('tonality_name', '') or meta.get('tonality', 'Standard')
    capo_raw = tab_data.get('capo', 0) or meta.get('capo', 0)
    try:
        capo = int(capo_raw)
    except (ValueError, TypeError):
        capo = 0

    tuning_obj = tab_data.get('tuning')
    if isinstance(tuning_obj, dict):
        tuning = tuning_obj.get('value', 'Standard')
    elif isinstance(tuning_obj, list) and tuning_obj:
        tuning = str(tuning_obj[0])
    elif isinstance(tuning_obj, str):
        tuning = tuning_obj
    else:
        tuning = 'Standard'

    content = clean_ug_content(raw_content)

    guitar, kemper, pedal = suggest_gear(artist)

    return {
        'title': title,
        'artist': artist,
        'key': key or 'Standard',
        'originalKey': key or 'Standard',
        'capo': capo,
        'tuning': tuning,
        'content': content,
        'recommendedGuitar': guitar,
        'kemperPreset': kemper,
        'pedalPreset': pedal,
        'sourceUrl': url
    }

def import_single_song(url: str, update_files: bool = True):
    print(f"\n[+] Téléchargement depuis : {url}")
    try:
        song_data = fetch_ug_song(url)
    except Exception as e:
        print(f"[-] ERREUR : {e}")
        return False

    print(f"[OK] Morceau extrait avec succès :")
    print(f"     * Titre      : {song_data['title']}")
    print(f"     * Artiste    : {song_data['artist']}")
    print(f"     * Tonalité   : {song_data['key']}")
    print(f"     * Capodastre : Case {song_data['capo'] if song_data['capo'] > 0 else 'Aucun'}")
    print(f"     * Guitare    : {song_data['recommendedGuitar']}")
    print(f"     * Kemper     : {song_data['kemperPreset']}")
    print(f"     * Taille     : {len(song_data['content'])} caractères")

    if not update_files:
        return True

    # 1. Sauvegarde dans le cache
    cache = {}
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, 'r', encoding='utf-8') as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    cache[url] = {
        'content': song_data['content'],
        'tonality': song_data['key'],
        'capo': song_data['capo'],
        'tuning': song_data['tuning'],
        'song_name': song_data['title'],
        'artist_name': song_data['artist']
    }

    with open(CACHE_PATH, 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)
    print(f"[+] Cache local mis à jour ({len(cache)} entrées)")

    # 2. Sauvegarde dans importedCatalog.json
    catalog = []
    if os.path.exists(CATALOG_PATH):
        try:
            with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
                catalog = json.load(f)
        except Exception:
            catalog = []

    # Vérifier si déjà présent (mise à jour) ou nouveau
    existing_idx = None
    for i, s in enumerate(catalog):
        if s.get('tabUrl') == url or (s.get('title', '').lower() == song_data['title'].lower() and s.get('artist', '').lower() == song_data['artist'].lower()):
            existing_idx = i
            break

    song_id = catalog[existing_idx]['id'] if existing_idx is not None else f"ug-{len(catalog) + 1}"

    app_song_obj = {
        'id': song_id,
        'title': song_data['title'],
        'artist': song_data['artist'],
        'key': song_data['key'],
        'originalKey': song_data['originalKey'],
        'capo': song_data['capo'],
        'tempoBpm': 90,
        'recommendedGuitar': song_data['recommendedGuitar'],
        'kemperPreset': song_data['kemperPreset'],
        'pedalPreset': song_data['pedalPreset'],
        'drumBrutePreset': 'Bank A - Standard 4/4',
        'miniloguePreset': 'Bypass',
        'notes': f"Source : {url}",
        'estimatedDurationSec': 210,
        'scrollSpeedPps': 26,
        'tabUrl': url,
        'content': song_data['content']
    }

    if existing_idx is not None:
        catalog[existing_idx] = app_song_obj
        print(f"[+] Morceau mis à jour dans {CATALOG_PATH} (ID: {song_id})")
    else:
        catalog.append(app_song_obj)
        print(f"[+] Nouveau morceau ajouté à {CATALOG_PATH} (ID: {song_id}, total {len(catalog)} morceaux)")

    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    return True

def main():
    parser = argparse.ArgumentParser(description="Importateur de morceaux Ultimate Guitar pour Your Reign Is Over")
    parser.add_argument('url', nargs='?', help="URL complète de la tablature Ultimate Guitar")
    parser.add_argument('--file', '-f', help="Fichier texte contenant une liste d'URLs (une par ligne)")
    parser.add_argument('--dry-run', action='store_true', help="Affiche l'extraction sans enregistrer dans le catalogue")

    args = parser.parse_args()

    if args.file:
        if not os.path.exists(args.file):
            print(f"[-] Fichier introuvable : {args.file}")
            sys.exit(1)
        with open(args.file, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        print(f"[+] Démarrage du traitement par lot : {len(urls)} URLs à importer...")
        success = 0
        for i, u in enumerate(urls, 1):
            print(f"\n--- [{i}/{len(urls)}] ---")
            if import_single_song(u, update_files=not args.dry_run):
                success += 1
        print(f"\n[Terminé] {success}/{len(urls)} morceaux importés avec succès.")
        return

    url = args.url
    if not url:
        print("=== Importateur Ultimate Guitar — Your Reign Is Over ===")
        url = input("Entrez l'URL de la tablature : ").strip()

    if not url:
        print("[-] Aucune URL fournie.")
        sys.exit(1)

    import_single_song(url, update_files=not args.dry_run)

if __name__ == '__main__':
    main()
