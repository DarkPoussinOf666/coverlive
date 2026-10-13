import json
import os
import re

# Charger le catalogue extrait initial
with open('50_Scripts_et_Outillage/extracted_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

# Charger le cache des tablatures scrapées
cache_path = '50_Scripts_et_Outillage/ug_tabs_cache.json'
cache = {}
if os.path.exists(cache_path):
    with open(cache_path, 'r', encoding='utf-8') as f:
        cache = json.load(f)

print(f"Cache chargé avec {len(cache)} entrées.")

# Guitares disponibles
guitars = [
    'Lag Primavera',
    'Fender Jaguar',
    'Duesenberg Paloma',
    'Fender Telecaster Baja',
    'Lag Roxanne'
]

pedal_presets = [
    'Eventide H9 Shimmer + Memory Man',
    'Boss OD-200 Crunch + Eventide Delay',
    'Soul Food Klon + Synth9 Ambient',
    'ZVex Fuzz Factory Solo',
    'Boss Flanger + Eventide Mod',
    'Ditto X2 Loop Ready'
]

def normalize_str(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r'\(.*?\)|\[.*?\]', '', s)
    s = re.sub(r'[^a-z0-9]', '', s)
    return s

unique_catalog = []
seen_keys = set()
for item in catalog:
    norm_key = (normalize_str(item['artist']), normalize_str(item['title']))
    if norm_key in seen_keys:
        continue
    seen_keys.add(norm_key)
    unique_catalog.append(item)

print(f"Catalogue dédoublonné : {len(unique_catalog)} morceaux uniques (sur {len(catalog)} initialement).")

formatted_songs = []
scraped_real_tabs_count = 0

from ug_cleaner import clean_ug_content

for idx, item in enumerate(unique_catalog):
    url = item['tab_url']
    artist = clean_ug_content(item['artist'])
    title = clean_ug_content(item['title'])
    
    cached = cache.get(url, {})
    has_real_content = bool(cached and cached.get('content') and len(cached['content'].strip()) > 50)
    
    if has_real_content:
        scraped_real_tabs_count += 1
        content = clean_ug_content(cached['content'])
        key = cached.get('tonality') or 'Standard'
        capo = cached.get('capo') or 0
        if cached.get('artist_name'):
            artist = clean_ug_content(cached['artist_name'])
        if cached.get('song_name'):
            title = clean_ug_content(cached['song_name'])
    else:
        key = 'Standard'
        capo = 0
        content = f"""[En-tête Morceau]
{title} — {artist}
Tablature importée depuis Ultimate-Guitar

[Intro]
Em   G   D   A
Em   G   D   A

[Couplet 1]
Em               G
   Paroles et accords à compléter ou éditer
D                 A
   Cliquez sur 'Éditer' pour coller la grille complète
Em               G
   Défilement automatique prêt à l'emploi
D                 A
   Vitesse réglable et synchronisable

[Refrain]
C                G
   Your Reign Is Over Live Session
D                Em
   Prêt pour la scène et le stream Twitch
C                G
   Contrôle au pied via Morningstar MC-8
D                Em
   Plein écran sans distraction

[Outro]
Em   G   D   A
Em"""

    # Attribution de guitare et Kemper
    artist_lower = artist.lower()
    if any(k in artist_lower for k in ['cash', 'obel', 'dylan', 'folk', 'acoustic', 'brassens', 'lennon', 'simon', 'garfunkel', 'stevens']):
        guitar = 'Lag Primavera'
        kemper = 'Acoustic Preamp Clean'
    elif any(k in artist_lower for k in ['nirvana', 'pixies', 'white stripes', 'cage', 'smashing', 'placebo', 'radiohead']):
        guitar = 'Fender Jaguar'
        kemper = 'Vox AC30 Top Boost'
    elif any(k in artist_lower for k in ['incubus', 'coldplay', 'verve', 'john mayer', 'blue stones', 'larkin poe']):
        guitar = 'Duesenberg Paloma'
        kemper = 'Dumble Clean & Crunch'
    elif any(k in artist_lower for k in ['foo fighters', 'green day', 'audioslave', 'cult', 'red hot', 'rhcp', 'chili peppers']):
        guitar = 'Fender Telecaster Baja'
        kemper = 'Deluxe Reverb Tweed'
    else:
        guitar = 'Lag Roxanne'
        kemper = 'Marshall JCM800 Rock'

    song_obj = {
        'id': f"ug-{idx+1}",
        'title': title,
        'artist': artist,
        'key': key if key else 'Standard',
        'originalKey': key if key else 'Standard',
        'capo': int(capo) if str(capo).isdigit() else 0,
        'tempoBpm': 90,
        'recommendedGuitar': guitar,
        'kemperPreset': kemper,
        'pedalPreset': pedal_presets[idx % len(pedal_presets)],
        'drumBrutePreset': 'Bank A - Standard 4/4',
        'miniloguePreset': 'Bypass',
        'notes': f"Source : {url}",
        'estimatedDurationSec': 210,
        'scrollSpeedPps': 26,
        'tabUrl': url,
        'content': content
    }
    formatted_songs.append(song_obj)

output_file = '90_Code_Source/app/src/data/importedCatalog.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(formatted_songs, f, indent=2, ensure_ascii=False)

print(f"\nTerminé ! {len(formatted_songs)} morceaux au total dans {output_file}.")
print(f"Dont {scraped_real_tabs_count} morceaux avec la VRAIE grille d'accords et paroles extraite d'Ultimate-Guitar !")
