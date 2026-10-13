import type { Playlist } from '../types/song'

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-acoustic-warmup',
    name: '☕ Live Acoustique Folk & Intimiste',
    description: 'Session folk épurée à la Lag Primavera & Shure 55. Arpèges, voix et ambiance intimiste.',
    color: '#f59e0b', // Amber
    songIds: ['song-1', 'song-2', 'song-3', 'ug-10', 'ug-15', 'ug-25', 'ug-30'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pl-grunge-alternative',
    name: '⚡ Rock 90s & Grunge Session',
    description: 'Set énergique branché Fender Jaguar & Duesenberg Paloma. DS-1, Whammy & Kemper Crunch.',
    color: '#8b5cf6', // Violet
    songIds: ['song-3', 'ug-1', 'ug-2', 'ug-3', 'ug-5', 'ug-8', 'ug-12'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pl-chill-stream',
    name: '🌙 Late Night Twitch & Ambient',
    description: 'Morceaux calmes avec nappes Synth9 EHX, Memory Man et Looper Ditto X2.',
    color: '#06b6d4', // Cyan
    songIds: ['song-1', 'ug-2', 'ug-4', 'ug-7', 'ug-18', 'ug-22'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]
