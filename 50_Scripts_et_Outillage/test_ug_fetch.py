import urllib.request
import re
import json

url = 'https://tabs.ultimate-guitar.com/tab/incubus/11am-chords-822721'
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
)

try:
    with urllib.request.urlopen(req, timeout=8) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Status: {resp.status}, HTML length: {len(html)}")
        
        # Recherche du JSON js-store injecté par Ultimate-Guitar
        match = re.search(r'<div class="js-store" data-content="([^"]+)"', html)
        if match:
            raw_json = match.group(1).replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
            store = json.loads(raw_json)
            page_data = store.get('store', {}).get('page', {}).get('data', {})
            tab_view = page_data.get('tab_view', {})
            wiki_tab = tab_view.get('wiki_tab', {})
            content = wiki_tab.get('content', '')
            
            print("Trouvé wiki_tab content !")
            print("Taille contenu :", len(content))
            print("Extrait du contenu :")
            print(content[:300])
        else:
            print("js-store non trouvé, recherche alternative...")
            if 'js-tab' in html:
                print("js-tab présent")
except Exception as e:
    print(f"Erreur : {e}")
