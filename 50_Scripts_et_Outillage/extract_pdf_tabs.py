import fitz
import re
import json
import os

pdf_path = 'My tabs @ Ultimate-Guitar.Com.pdf'
output_json = '50_Scripts_et_Outillage/extracted_catalog.json'

doc = fitz.open(pdf_path)
extracted_songs = []

for page_idx in range(len(doc)):
    page = doc[page_idx]
    links = page.get_links()
    
    row_links = {}
    for link in links:
        uri = link.get('uri', '')
        if not uri:
            continue
        rect = link.get('from')
        if not rect:
            continue
        y_center = round((rect.y0 + rect.y1) / 2)
        
        matched_y = None
        for existing_y in row_links:
            if abs(existing_y - y_center) <= 5:
                matched_y = existing_y
                break
        if matched_y is None:
            matched_y = y_center
            row_links[matched_y] = {'artists': [], 'tabs': []}
            
        if 'ultimate-guitar.com/artist/' in uri:
            row_links[matched_y]['artists'].append(uri)
        elif 'tabs.ultimate-guitar.com/tab/' in uri:
            row_links[matched_y]['tabs'].append(uri)

    for y, data in row_links.items():
        if data['tabs']:
            tab_url = data['tabs'][0]
            artist_url = data['artists'][0] if data['artists'] else ''
            
            # Parsing de l'artiste depuis l'URL artiste si dispo
            artist_name = ""
            if artist_url:
                m_art = re.search(r'/artist/([^_/]+(?:_[^_/]+)*)', artist_url)
                if m_art:
                    artist_name = m_art.group(1).replace('_', ' ').title()
            
            # Parsing titre & artiste depuis tab_url
            # Format classique: https://tabs.ultimate-guitar.com/tab/incubus/11am-chords-822721
            m = re.search(r'/tab/([^/]+)/([^-]+(?:-[^-]+)*)-(?:chords|official|tab|crd|bass|ukulele)-(\d+)', tab_url)
            if m:
                if not artist_name:
                    artist_name = m.group(1).replace('_', ' ').replace('-', ' ').title()
                song_title = m.group(2).replace('-', ' ').title()
            else:
                m2 = re.search(r'/tab/([^/]+)/([^/?]+)', tab_url)
                if m2:
                    if not artist_name:
                        artist_name = m2.group(1).replace('_', ' ').replace('-', ' ').title()
                    song_title = m2.group(2).replace('-', ' ').title()
                else:
                    song_title = tab_url.split('/')[-1]
            
            # Nettoyages cosmétiques
            artist_name = re.sub(r'\s+\d+$', '', artist_name).strip()
            song_title = re.sub(r'\s+Chords$', '', song_title, flags=re.IGNORECASE)
            song_title = re.sub(r'\s+Official$', '', song_title, flags=re.IGNORECASE)
            song_title = re.sub(r'\s+Ukulele$', '', song_title, flags=re.IGNORECASE)
            song_title = song_title.strip()

            extracted_songs.append({
                'artist': artist_name or 'Artiste',
                'title': song_title,
                'tab_url': tab_url,
                'page': page_idx + 1
            })

# Dédoublonner
unique_songs = []
seen = set()
for s in extracted_songs:
    if s['tab_url'] not in seen:
        seen.add(s['tab_url'])
        unique_songs.append(s)

print(f"Total morceaux uniques extraits : {len(unique_songs)}")

os.makedirs('50_Scripts_et_Outillage', exist_ok=True)
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(unique_songs, f, indent=2, ensure_ascii=False)

print(f"Catalogue exporté avec succès dans {output_json}")
