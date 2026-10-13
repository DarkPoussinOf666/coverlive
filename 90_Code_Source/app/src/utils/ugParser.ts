import type { Song } from '../types/song.ts'

export type RecommendedGuitar = Song['recommendedGuitar']

/**
 * Nettoie le contenu balisé d'Ultimate Guitar ([ch]...[/ch], [tab]...[/tab])
 * et normalise la typographie et les retours à la ligne.
 */
export function cleanUgContent(rawContent: string): string {
  if (!rawContent) return ''

  // 1. Remplacer [ch]C[/ch] par C
  let cleaned = rawContent.replace(/\[ch\](.*?)\[\/ch\]/gi, '$1')

  // 2. Supprimer les balises [tab] et [/tab]
  cleaned = cleaned.replace(/\[\/?tab\]/gi, '')

  // 3. Décodage robuste des entités HTML courantes
  const entities: Record<string, string> = {
    '&#039;': "'",
    '&#39;': "'",
    '&apos;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '’': "'",
    '‘': "'",
    '“': '"',
    '”': '"',
  }

  for (const [entity, replacement] of Object.entries(entities)) {
    cleaned = cleaned.replaceAll(entity, replacement)
  }

  // 4. Normaliser les retours chariot
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 5. Réduire les sauts de ligne multiples excessifs (> 2 sauts)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  return cleaned.trim()
}

/**
 * Assigne intelligemment la guitare et le preset Kemper selon l'artiste ou le genre.
 */
export function suggestGear(artist: string): {
  recommendedGuitar: RecommendedGuitar
  kemperPreset: string
  pedalPreset: string
} {
  const a = (artist || '').toLowerCase()

  if (
    a.includes('cash') ||
    a.includes('obel') ||
    a.includes('dylan') ||
    a.includes('folk') ||
    a.includes('acoustic') ||
    a.includes('brassens') ||
    a.includes('lennon') ||
    a.includes('simon') ||
    a.includes('garfunkel') ||
    a.includes('stevens')
  ) {
    return {
      recommendedGuitar: 'Lag Primavera',
      kemperPreset: 'Acoustic Preamp Clean',
      pedalPreset: 'Ditto X2 + Eventide H9 Space',
    }
  }

  if (
    a.includes('nirvana') ||
    a.includes('pixies') ||
    a.includes('white stripes') ||
    a.includes('cage') ||
    a.includes('smashing') ||
    a.includes('placebo') ||
    a.includes('radiohead')
  ) {
    return {
      recommendedGuitar: 'Fender Jaguar',
      kemperPreset: 'Vox AC30 Top Boost',
      pedalPreset: 'Boss OD-200 Crunch + Eventide Delay',
    }
  }

  if (
    a.includes('incubus') ||
    a.includes('coldplay') ||
    a.includes('verve') ||
    a.includes('john mayer') ||
    a.includes('blue stones') ||
    a.includes('larkin poe')
  ) {
    return {
      recommendedGuitar: 'Duesenberg Paloma',
      kemperPreset: 'Dumble Clean & Crunch',
      pedalPreset: 'Soul Food Klon + Synth9 Ambient',
    }
  }

  if (
    a.includes('foo fighters') ||
    a.includes('green day') ||
    a.includes('audioslave') ||
    a.includes('cult') ||
    a.includes('red hot') ||
    a.includes('rhcp') ||
    a.includes('chili peppers')
  ) {
    return {
      recommendedGuitar: 'Fender Telecaster Baja',
      kemperPreset: 'Deluxe Reverb Tweed',
      pedalPreset: 'ZVex Fuzz Factory Solo',
    }
  }

  return {
    recommendedGuitar: 'Lag Roxanne',
    kemperPreset: 'Marshall JCM800 Rock',
    pedalPreset: 'Eventide H9 Shimmer + Memory Man',
  }
}

export interface ExtractedUgSong {
  title: string
  artist: string
  key: string
  originalKey: string
  capo: number
  tuning: string
  content: string
  recommendedGuitar: RecommendedGuitar
  kemperPreset: string
  pedalPreset: string
  notes: string
}

/**
 * Parse le code HTML d'une page Ultimate Guitar et extrait la chanson structurée.
 */
export function extractSongFromUgHtml(html: string, sourceUrl: string): ExtractedUgSong | null {
  const match = html.match(/<div class="js-store" data-content="([^"]+)"/)
  if (!match) return null

  // Décodage du JSON data-content
  let rawJson = match[1]
  const entities: Record<string, string> = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#039;': "'",
    '&#39;': "'",
  }
  for (const [entity, replacement] of Object.entries(entities)) {
    rawJson = rawJson.replaceAll(entity, replacement)
  }

  try {
    const store = JSON.parse(rawJson)
    const pageData = store?.store?.page?.data || {}
    const tabData = pageData.tab || {}
    const tabView = pageData.tab_view || {}
    const wikiTab = tabView.wiki_tab || {}

    const rawContent = wikiTab.content || ''
    if (!rawContent) return null

    const title = cleanUgContent(tabData.song_name || 'Sans titre')
    const artist = cleanUgContent(tabData.artist_name || 'Artiste inconnu')
    const meta = typeof tabView?.meta === 'object' && tabView.meta !== null && !Array.isArray(tabView.meta) ? tabView.meta : {}
    const key = tabData.tonality_name || meta.tonality || 'Standard'
    const capoRaw = tabData.capo ?? meta.capo ?? 0
    const capo = typeof capoRaw === 'number' ? capoRaw : parseInt(String(capoRaw), 10) || 0
    const tuningRaw = tabData.tuning
    const tuning = 
      typeof tuningRaw === 'object' && tuningRaw !== null && 'value' in tuningRaw
        ? String(tuningRaw.value)
        : Array.isArray(tuningRaw) && tuningRaw.length > 0
          ? String(tuningRaw[0])
          : typeof tuningRaw === 'string'
            ? tuningRaw
            : 'Standard'

    const cleanedContent = cleanUgContent(rawContent)
    const gear = suggestGear(artist)

    return {
      title,
      artist,
      key: key || 'Standard',
      originalKey: key || 'Standard',
      capo,
      tuning,
      content: cleanedContent,
      recommendedGuitar: gear.recommendedGuitar,
      kemperPreset: gear.kemperPreset,
      pedalPreset: gear.pedalPreset,
      notes: `Source : ${sourceUrl}`,
    }
  } catch (err) {
    console.error('Erreur lors du parsing JSON UG:', err)
    return null
  }
}
