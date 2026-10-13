export interface Song {
  id: string
  title: string
  artist: string
  key: string
  originalKey?: string
  capo: number // 0 si aucun capo
  tempoBpm: number
  recommendedGuitar: 'Lag Primavera' | 'Fender Jaguar' | 'Duesenberg Paloma' | 'Fender Telecaster Baja' | 'Lag Roxanne'
  kemperPreset: string
  pedalPreset?: string
  drumBrutePreset?: string
  miniloguePreset?: string
  notes?: string
  estimatedDurationSec: number
  scrollSpeedPps: number // pixels par seconde par défaut
  content: string // Format ChordPro ou texte tabulaire
}

export interface Playlist {
  id: string
  name: string
  description?: string
  color?: string
  songIds: string[]
  createdAt: string
  updatedAt: string
}

// Alias pour compatibilité
export type Setlist = Playlist

