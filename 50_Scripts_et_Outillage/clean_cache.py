import json
import os
import sys
from ug_cleaner import clean_ug_content

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

cache_path = '50_Scripts_et_Outillage/ug_tabs_cache.json'
if os.path.exists(cache_path):
    with open(cache_path, 'r', encoding='utf-8') as f:
        cache = json.load(f)
    
    modified_count = 0
    for url, data in cache.items():
        if isinstance(data, dict):
            raw_content = data.get('content', '')
            cleaned_content = clean_ug_content(raw_content)
            if raw_content != cleaned_content:
                data['content'] = cleaned_content
                modified_count += 1
            if 'song_name' in data:
                data['song_name'] = clean_ug_content(data['song_name'])
            if 'artist_name' in data:
                data['artist_name'] = clean_ug_content(data['artist_name'])
    
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)
    
    print(f"ug_tabs_cache.json nettoyé : {modified_count} morceaux avaient des entités HTML.")
