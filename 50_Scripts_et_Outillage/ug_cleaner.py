import json
import re
import html

def clean_ug_content(raw_content: str) -> str:
    """Nettoie les balises [ch]Am[/ch], [tab]...[/tab] et entités HTML d'Ultimate Guitar pour un rendu pro."""
    if not raw_content:
        return ""
    
    # 1. Remplacer [ch]C[/ch] par C
    cleaned = re.sub(r'\[ch\](.*?)\[/ch\]', r'\1', raw_content)
    
    # 2. Supprimer les balises [tab] et [/tab]
    cleaned = re.sub(r'\[/?tab\]', '', cleaned)
    
    # 3. Décodage robuste des entités HTML (simple et double échappement)
    for _ in range(3):
        prev = cleaned
        cleaned = html.unescape(cleaned)
        if cleaned == prev:
            break
            
    # Remplacements ciblés supplémentaires pour les entités récalcitrantes
    replacements = {
        '&#039;': "'",
        '&#39;': "'",
        '&apos;': "'",
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&nbsp;': ' ',
        '\xa0': ' ',
        '’': "'",
        '‘': "'",
        '“': '"',
        '”': '"'
    }
    for old, new in replacements.items():
        cleaned = cleaned.replace(old, new)

    # 4. Normaliser les retours chariot Windows
    cleaned = cleaned.replace('\r\n', '\n').replace('\r', '\n')
    
    # 5. Supprimer les triples sauts de ligne
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    
    return cleaned.strip()

def normalize_title(title: str) -> str:
    """Normalise un titre pour la détection de doublons."""
    t = html.unescape(title or '').lower()
    t = re.sub(r'\(.*?\)', '', t) # enlever (acoustic), (live), etc.
    t = re.sub(r'\[.*?\]', '', t)
    t = re.sub(r'[^a-z0-9]', '', t)
    return t

def normalize_artist(artist: str) -> str:
    """Normalise le nom d'artiste."""
    a = html.unescape(artist or '').lower()
    a = re.sub(r'[^a-z0-9]', '', a)
    return a
