import type { Song, Playlist } from '../types/song'

export interface PedalDevice {
  id: string
  name: string
  shortName: string
  category: 'midi' | 'delay_reverb' | 'gain' | 'modulation_pitch' | 'synth_looper'
  description: string
  color: string // Tailwind color accent
  type: 'analog' | 'dsp' | 'controller'
  signalChainOrder: number // 1 à N dans le routing audio, 0 pour contrôleur MIDI externe
  format: 'standard' | 'double' | 'large' | 'expression' | 'midi_controller'
  dimensions: { width: number; height: number } // en px relatifs pour le rendu SVG
  powerInfo: string
  hasMidi: boolean
}

export const HARDWARE_PEDALBOARD: PedalDevice[] = [
  // --- Chaîne Audio Principale (Signal Chain 1 -> 13) ---
  {
    id: 'whammy5',
    name: 'DigiTech Whammy 5',
    shortName: 'Whammy 5',
    category: 'modulation_pitch',
    description: 'Glissandos de pitch, Octaver +1/+2 et Drop-tuning via pédale de bascule',
    color: 'red',
    type: 'dsp',
    signalChainOrder: 1,
    format: 'expression',
    dimensions: { width: 140, height: 210 },
    powerInfo: '9V DC (265mA)',
    hasMidi: true
  },
  {
    id: 'synth9',
    name: 'EHX Synth9',
    shortName: 'Synth9',
    category: 'synth_looper',
    description: 'Émulation de synthétiseurs vintage (Moog, Prophet, OBX, String Synth)',
    color: 'purple',
    type: 'dsp',
    signalChainOrder: 2,
    format: 'standard',
    dimensions: { width: 105, height: 165 },
    powerInfo: '9V DC (100mA)',
    hasMidi: false
  },
  {
    id: 'fuzz_factory',
    name: 'ZVex Fuzz Factory',
    shortName: 'Fuzz Factory',
    category: 'gain',
    description: 'Fuzz Germanium haute impédance, auto-oscillation, son velcro et sustain infini',
    color: 'emerald',
    type: 'analog',
    signalChainOrder: 3,
    format: 'standard',
    dimensions: { width: 130, height: 120 },
    powerInfo: '9V DC (3mA)',
    hasMidi: false
  },
  {
    id: 'boss_fz',
    name: 'Boss FZ Fuzz Shifter',
    shortName: 'Boss FZ',
    category: 'gain',
    description: 'Fuzz vintage 70s et saturation d’octave riche en harmoniques',
    color: 'rose',
    type: 'analog',
    signalChainOrder: 4,
    format: 'standard',
    dimensions: { width: 100, height: 160 },
    powerInfo: '9V DC (20mA)',
    hasMidi: false
  },
  {
    id: 'soul_food',
    name: 'EHX Soul Food (Klon Clean Boost)',
    shortName: 'Soul Food',
    category: 'gain',
    description: 'Overdrive transparent, headroom rehaussé et boost organique transparent',
    color: 'amber',
    type: 'analog',
    signalChainOrder: 5,
    format: 'standard',
    dimensions: { width: 100, height: 155 },
    powerInfo: '9V DC (22mA)',
    hasMidi: false
  },
  {
    id: 'od200',
    name: 'Boss OD-200 Hybrid Drive',
    shortName: 'OD-200',
    category: 'gain',
    description: 'Overdrives analogiques + DSP 32-bit, crunch dynamique et rappel de presets MIDI',
    color: 'yellow',
    type: 'dsp',
    signalChainOrder: 6,
    format: 'double',
    dimensions: { width: 145, height: 170 },
    powerInfo: '9V DC (220mA)',
    hasMidi: true
  },
  {
    id: 'ds1',
    name: 'Boss DS-1 Distortion',
    shortName: 'DS-1',
    category: 'gain',
    description: 'Distorsion tranchante emblématique, son rock alternatif et grunge 90s',
    color: 'orange',
    type: 'analog',
    signalChainOrder: 7,
    format: 'standard',
    dimensions: { width: 100, height: 160 },
    powerInfo: '9V DC (4mA)',
    hasMidi: false
  },
  {
    id: 'boss_flanger',
    name: 'Boss Flanger',
    shortName: 'Boss Flanger',
    category: 'modulation_pitch',
    description: 'Modulation analogique BBD, balayages métalliques et textures spectrales',
    color: 'violet',
    type: 'analog',
    signalChainOrder: 8,
    format: 'standard',
    dimensions: { width: 100, height: 160 },
    powerInfo: '9V DC (30mA)',
    hasMidi: false
  },
  {
    id: 'h9_mod',
    name: 'Eventide H9 #3 (ModFactor / Pitch)',
    shortName: 'H9 Mod',
    category: 'modulation_pitch',
    description: 'Chorus, Flanger, Phaser, Pitch Shifter, HarPeggiator de qualité studio',
    color: 'indigo',
    type: 'dsp',
    signalChainOrder: 9,
    format: 'standard',
    dimensions: { width: 130, height: 170 },
    powerInfo: '9V DC (500mA)',
    hasMidi: true
  },
  {
    id: 'memory_man',
    name: 'EHX Stereo Memory Man',
    shortName: 'Memory Man',
    category: 'delay_reverb',
    description: 'Délai analogique chaleureux et modulations spatiales vintage',
    color: 'teal',
    type: 'analog',
    signalChainOrder: 10,
    format: 'large',
    dimensions: { width: 155, height: 165 },
    powerInfo: '9V DC (200mA)',
    hasMidi: false
  },
  {
    id: 'h9_delay',
    name: 'Eventide H9 #2 (TimeFactor Delay)',
    shortName: 'H9 Delay',
    category: 'delay_reverb',
    description: 'Délais numériques et analogiques synchronisés au tempo MIDI',
    color: 'blue',
    type: 'dsp',
    signalChainOrder: 11,
    format: 'standard',
    dimensions: { width: 130, height: 170 },
    powerInfo: '9V DC (500mA)',
    hasMidi: true
  },
  {
    id: 'h9_space',
    name: 'Eventide H9 #1 (Space Reverb)',
    shortName: 'H9 Space',
    category: 'delay_reverb',
    description: 'Réverbes de studio d’ambiance (Plate, Hall, Shimmer, Room, Blackhole)',
    color: 'cyan',
    type: 'dsp',
    signalChainOrder: 12,
    format: 'standard',
    dimensions: { width: 130, height: 170 },
    powerInfo: '9V DC (500mA)',
    hasMidi: true
  },
  {
    id: 'ditto_x2',
    name: 'TC Electronic Ditto X2',
    shortName: 'Ditto X2',
    category: 'synth_looper',
    description: 'Looper stéréo live 2 footswitches (Record/Overdub & Stop/FX) en bout de chaîne',
    color: 'zinc',
    type: 'dsp',
    signalChainOrder: 13,
    format: 'double',
    dimensions: { width: 145, height: 165 },
    powerInfo: '9V DC (100mA)',
    hasMidi: false
  },

  // --- Contrôleur MIDI Central (Bus de commande au pied) ---
  {
    id: 'mc8',
    name: 'Morningstar MC-8',
    shortName: 'MC-8',
    category: 'midi',
    description: 'Chef d’orchestre MIDI Pro — 8 footswitches LCD, pilote Kemper, H9s & OD-200',
    color: 'amber',
    type: 'controller',
    signalChainOrder: 0,
    format: 'midi_controller',
    dimensions: { width: 280, height: 140 },
    powerInfo: '9V DC (250mA)',
    hasMidi: true
  }
]

export interface SongPedalSuggestion {
  songId: string
  title: string
  artist: string
  activePedalIds: string[]
  primaryDrive: string
  primaryModDelay: string
  kemperProfile: string
  mc8BankPreset: string
  explanation: string
}

export interface PlaylistPedalDiagnostic {
  playlistId: string
  playlistName: string
  totalSongs: number
  /**
   * Pédales avec leur taux d'utilisation sur la setlist
   */
  pedalUsage: {
    pedal: PedalDevice
    usageCount: number
    percentage: number
    status: 'indispensable' | 'frequent' | 'rare' | 'dormant'
  }[]
  /**
   * Pédales matérielles jamais activées pour cette setlist
   */
  dormantPedalIds: string[]
  /**
   * Recommandations détaillées chanson par chanson
   */
  songSuggestions: SongPedalSuggestion[]
  /**
   * Résumé de configuration pour le contrôleur au pied MC-8
   */
  mc8BankPlan: {
    bankNumber: number
    bankName: string
    slots: {
      letter: string
      songTitle: string
      pcNumber: number
      pedalsSummary: string
    }[]
  }[]
}

/**
 * Analyse un morceau et déduit la configuration de pédales idéale
 */
export function analyzeSongPedals(song: Song, indexInSetlist: number = 0): SongPedalSuggestion {
  const isAcoustic = song.recommendedGuitar === 'Lag Primavera'
  const textContext = `${song.title} ${song.artist} ${song.content || ''} ${song.kemperPreset || ''} ${song.pedalPreset || ''}`.toLowerCase()

  const activePedalIds: string[] = ['mc8', 'h9_space'] // Toujours le MC-8 et la réverbe d'ambiance
  let primaryDrive = 'Clean / Acoustic Preamp'
  let primaryModDelay = 'H9 Space (Studio Hall)'
  let kemperProfile = song.kemperPreset || 'Acoustic Clean'
  let explanation = ''

  if (isAcoustic) {
    // Profil Acoustique Folk / Doux
    if (textContext.includes('delay') || textContext.includes('echo') || song.tempoBpm < 90) {
      activePedalIds.push('memory_man')
      primaryModDelay = 'Memory Man Warm Tape Echo'
    }
    if (textContext.includes('loop') || textContext.includes('ditto') || textContext.includes('solo')) {
      activePedalIds.push('ditto_x2')
    }
    primaryDrive = 'Aucun gain (Son acoustique naturel)'
    kemperProfile = 'Kemper Acoustic Preamp / AT4040 EQ'
    explanation = 'Configuration acoustique pure : réverbe Space aérée, délai analogique doux et looper en option.'
  } else {
    // Guitare Électrique — Profils par nuances de style
    const isHeavy = /grunge|nirvana|punk|metal|rage|muse|rock|distortion|fuzz|smashing|foo/i.test(textContext)
    const isSynthPop = /synth|80s|new wave|depeche|cure|electro|mgmt/i.test(textContext)
    const isAltIndie = /radiohead|oasis|smiths|arctic|floyd|pink|coldplay|u2|twang|baja/i.test(textContext)

    // Modulations & effets spéciaux
    if (isSynthPop || textContext.includes('synth')) {
      activePedalIds.push('synth9', 'boss_flanger')
      primaryModDelay = 'EHX Synth9 + Boss Flanger'
    }

    if (textContext.includes('whammy') || textContext.includes('octave') || /muse|white stripes|rage|audioslave/i.test(textContext)) {
      activePedalIds.push('whammy5')
    }

    // Gestion du Gain / Saturation
    if (isHeavy || textContext.includes('fuzz')) {
      if (textContext.includes('fuzz') || /muse|bellamy|hendrix/i.test(textContext)) {
        activePedalIds.push('fuzz_factory', 'od200')
        primaryDrive = 'ZVex Fuzz Factory + OD-200'
      } else {
        activePedalIds.push('ds1', 'od200')
        primaryDrive = 'Boss DS-1 + OD-200 Crunch'
      }
      kemperProfile = song.kemperPreset || 'Marshall JCM800 / Friedman BE'
      explanation = 'Profil High-Gain dynamique : distorsion incisive DS-1 ou Fuzz Factory avec appui OD-200.'
    } else if (isAltIndie || song.recommendedGuitar === 'Fender Telecaster Baja') {
      activePedalIds.push('soul_food')
      if (song.tempoBpm > 105) activePedalIds.push('od200')
      primaryDrive = 'EHX Soul Food (Klon Clean Boost) + Crunch léger'
      kemperProfile = song.kemperPreset || 'Deluxe Reverb / Tweed Twang'
      explanation = 'Profil Alt/Indie : saturation transparente Soul Food, réactivité au toucher et twang naturel.'
    } else {
      // Électrique standard / Ballade / Polyvalent
      activePedalIds.push('soul_food', 'od200')
      primaryDrive = 'Boss OD-200 (Boutique Clean/Crunch)'
      kemperProfile = song.kemperPreset || 'Fender Twin / Vox AC30'
      explanation = 'Profil Polyvalent : boost dynamique au Soul Food et crunch réactif via OD-200.'
    }

    // Délais & Modulations temporelles
    if (song.tempoBpm <= 100 || textContext.includes('delay')) {
      activePedalIds.push('h9_delay')
      primaryModDelay += ' + H9 TimeFactor Tempo Sync'
    } else {
      activePedalIds.push('memory_man')
      primaryModDelay += ' + Memory Man Analog Slapback'
    }

    if (textContext.includes('chorus') || textContext.includes('flanger') || /cure|nirvana|come as you are/i.test(textContext)) {
      activePedalIds.push('h9_mod')
    }
  }

  // Calcul du slot MC-8 (Banques de 8 presets A à H)
  const bankNumber = Math.floor(indexInSetlist / 8) + 1
  const letter = String.fromCharCode(65 + (indexInSetlist % 8)) // A, B, C, D, E, F, G, H
  const mc8BankPreset = `Bank ${bankNumber} - Preset ${letter} (PC #${indexInSetlist + 1})`

  return {
    songId: song.id,
    title: song.title,
    artist: song.artist,
    activePedalIds: Array.from(new Set(activePedalIds)),
    primaryDrive,
    primaryModDelay,
    kemperProfile,
    mc8BankPreset,
    explanation
  }
}

/**
 * Diagnostic complet d'une Playlist pour le Pedalboard physique
 */
export function diagnosePlaylistPedalboard(playlist: Playlist, allSongs: Song[]): PlaylistPedalDiagnostic {
  const playlistSongs = playlist.songIds
    .map(id => allSongs.find(s => s.id === id))
    .filter((s): s is Song => Boolean(s))

  const songSuggestions = playlistSongs.map((song, idx) => analyzeSongPedals(song, idx))
  const total = playlistSongs.length

  // Calculer l'utilisation de chaque pédale matérielle
  const pedalUsage = HARDWARE_PEDALBOARD.map(pedal => {
    const usageCount = songSuggestions.filter(s => s.activePedalIds.includes(pedal.id)).length
    const percentage = total > 0 ? Math.round((usageCount / total) * 100) : 0
    
    let status: 'indispensable' | 'frequent' | 'rare' | 'dormant' = 'dormant'
    if (percentage >= 70) status = 'indispensable'
    else if (percentage >= 30) status = 'frequent'
    else if (percentage > 0) status = 'rare'
    else status = 'dormant'

    return {
      pedal,
      usageCount,
      percentage,
      status
    }
  })

  // Identifier les pédales non sollicitées
  const dormantPedalIds = pedalUsage
    .filter(u => u.status === 'dormant')
    .map(u => u.pedal.id)

  // Plan de banques Morningstar MC-8 (8 boutons A-H par banque)
  const mc8BankPlan: PlaylistPedalDiagnostic['mc8BankPlan'] = []
  const banksCount = Math.ceil(total / 8) || 1

  for (let b = 0; b < banksCount; b++) {
    const bankNum = b + 1
    const bankSongs = songSuggestions.slice(b * 8, (b + 1) * 8)
    const slots = bankSongs.map((sug, slotIdx) => {
      const activePedals = HARDWARE_PEDALBOARD
        .filter(p => sug.activePedalIds.includes(p.id) && p.id !== 'mc8')
        .map(p => p.shortName)
        .join(', ')

      return {
        letter: String.fromCharCode(65 + slotIdx),
        songTitle: sug.title,
        pcNumber: b * 8 + slotIdx + 1,
        pedalsSummary: activePedals || 'Bypass'
      }
    })

    mc8BankPlan.push({
      bankNumber: bankNum,
      bankName: `${playlist.name} (Partie ${bankNum})`,
      slots
    })
  }

  return {
    playlistId: playlist.id,
    playlistName: playlist.name,
    totalSongs: total,
    pedalUsage,
    dormantPedalIds,
    songSuggestions,
    mc8BankPlan
  }
}
