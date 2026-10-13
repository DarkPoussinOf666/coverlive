import React, { useState, useEffect } from 'react'
import type { Playlist } from '../types/song'
import { X, ListMusic, Palette } from 'lucide-react'

interface PlaylistEditorModalProps {
  isOpen: boolean
  playlist: Playlist | null
  onClose: () => void
  onSave: (playlist: Playlist) => void
}

const COLOR_OPTIONS = [
  { name: 'Ambre', hex: '#f59e0b' },
  { name: 'Émeraude', hex: '#10b981' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Rose / Fuzz', hex: '#ec4899' },
  { name: 'Cyan / Ambient', hex: '#06b6d4' },
  { name: 'Rouge / Hard', hex: '#ef4444' }
]

export const PlaylistEditorModal: React.FC<PlaylistEditorModalProps> = ({
  isOpen,
  playlist,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#f59e0b')

  useEffect(() => {
    if (playlist) {
      setName(playlist.name)
      setDescription(playlist.description || '')
      setColor(playlist.color || '#f59e0b')
    } else {
      setName('')
      setDescription('')
      setColor('#f59e0b')
    }
  }, [playlist, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const now = new Date().toISOString()
    const savedPlaylist: Playlist = {
      id: playlist ? playlist.id : `pl-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color,
      songIds: playlist ? playlist.songIds : [],
      createdAt: playlist ? playlist.createdAt : now,
      updatedAt: now
    }

    onSave(savedPlaylist)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0f1420] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d121c] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ListMusic className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {playlist ? 'Modifier la Setlist' : 'Nouvelle Setlist Live'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nom de la Setlist *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Live Twitch 2h, Acoustique Bar, Spécial Grunge..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Contexte Live
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Guitare folk Lag Primavera pour la première partie, puis Duesenberg pour le rappel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#07090e] border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Couleur d'étiquette
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c.hex ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              {playlist ? 'Enregistrer' : 'Créer la Setlist'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
