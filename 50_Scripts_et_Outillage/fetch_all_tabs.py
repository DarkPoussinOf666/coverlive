import urllib.request
import re
import json
import time
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from ug_cleaner import clean_ug_content, normalize_title, normalize_artist

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def fetch_ug_tab(url: str):
    """Télécharge la page Ultimate-Guitar et extrait la vraie grille d'accords et les métadonnées."""
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            match = re.search(r'<div class="js-store" data-content="([^"]+)"', html)
            if not match:
                return None
            
            raw_json = match.group(1).replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
            store = json.loads(raw_json)
            page_data = store.get('store', {}).get('page', {}).get('data', {})
            
            tab_data = page_data.get('tab', {})
            tab_view = page_data.get('tab_view', {})
            wiki_tab = tab_view.get('wiki_tab', {})
            
            content = wiki_tab.get('content', '')
            tonality = tab_data.get('tonality_name', '') or tab_view.get('meta', {}).get('tonality', 'Standard')
            capo = tab_data.get('capo', 0) or tab_view.get('meta', {}).get('capo', 0)
            tuning = tab_data.get('tuning', {}).get('value', 'Standard')
            song_name = tab_data.get('song_name', '')
            artist_name = tab_data.get('artist_name', '')
            
            cleaned_body = clean_ug_content(content)
            
            return {
                'content': cleaned_body,
                'tonality': tonality,
                'capo': int(capo) if str(capo).isdigit() else 0,
                'tuning': tuning,
                'song_name': song_name,
                'artist_name': artist_name
            }
    except Exception as e:
        # print(f"Erreur sur {url}: {e}")
        return None

def main():
    catalog_path = '50_Scripts_et_Outillage/extracted_catalog.json'
    cache_path = '50_Scripts_et_Outillage/ug_tabs_cache.json'
    
    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # Charger le cache existant pour permettre la reprise incrémentale
    cache = {}
    if os.path.exists(cache_path):
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cache = json.load(f)
            print(f"Cache existant chargé : {len(cache)} tablatures déjà récupérées.")
        except Exception:
            cache = {}

    # Dédoublonner le catalogue d'abord
    unique_catalog = []
    seen_keys = set()
    for item in catalog:
        norm_key = (normalize_artist(item['artist']), normalize_title(item['title']))
        if norm_key in seen_keys:
            continue
        seen_keys.add(norm_key)
        unique_catalog.append(item)

    print(f"Total morceaux uniques dédoublonnés : {len(unique_catalog)} (sur {len(catalog)} initialement)")

    # Récupérer les tablatures
    success_count = len(cache)
    target_count = len(unique_catalog)

    for i, item in enumerate(unique_catalog):
        url = item['tab_url']
        if url in cache:
            continue

        print(f"[{i+1}/{target_count}] Scraping: {item['artist']} - {item['title']}...")
        result = fetch_ug_tab(url)
        
        if result and result['content']:
            cache[url] = result
            success_count += 1
            print(f"  [OK] ({len(result['content'])} car., cle: {result['tonality']}, capo: {result['capo']})")
        else:
            print(f"  [ECHEC] Pas de contenu wiki")
            cache[url] = {'content': '', 'tonality': 'Standard', 'capo': 0}

        # Sauvegarder le cache tous les 10 morceaux
        if (i + 1) % 10 == 0:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(cache, f, indent=2, ensure_ascii=False)
            print(f"==> Sauvegarde cache ({len(cache)} entrées) <==")

        # Pause polie pour ne pas se faire bannir l'IP
        time.sleep(0.3)

    # Sauvegarde finale du cache
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)

    print(f"\nTerminé ! {success_count} tablatures en cache.")

if __name__ == '__main__':
    main()
