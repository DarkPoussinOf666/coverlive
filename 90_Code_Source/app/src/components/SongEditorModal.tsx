import React, { useState } from 'react'
import type { Song } from '../types/song'
import { 
  X, 
  Save, 
  Guitar, 
  Sliders, 
  Music, 
  KeyRound, 
  Clock, 
  Gauge, 
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe
} from 'lucide-react'

interface SongEditorModalProps {
  song?: Song | null
  isOpen: boolean
  onClose: () => void
  onSave: (song: Song) => void
}

export const SongEditorModal: React.FC<SongEditorModalProps> = ({
  song,
  isOpen,
  onClose,
  onSave,
}) => {
  const [ugUrl, setUgUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  })

  const [formData, setFormData] = useState<Song>(() => {
    if (song) return song
    return {
      id: `song-${Date.now()}`,
      title: '',
      artist: '',
      key: 'Am',
      originalKey: 'Am',
      capo: 0,
      tempoBpm: 90,
      recommendedGuitar: 'Lag Primavera',
      kemperPreset: 'Acoustic Folk Clean',
      pedalPreset: 'Ditto X2 + Eventide H9 Space',
      drumBrutePreset: 'Bank A - Beat 01',
      miniloguePreset: 'Bypass',
      notes: '',
      estimatedDurationSec: 210,
      scrollSpeedPps: 28,
      content: `[Intro]
Am   C   G   D

[Couplet 1]
Am               C
   Paroles du premier couplet...
G                D
   Deuxième ligne de chant...

[Refrain]
F                C
   Paroles du refrain...
G                Am
   Suite du refrain...`,
    }
  })

  // Synchroniser quand song change
  React.useEffect(() => {
    if (song) {
      setFormData(song)
    } else {
      setFormData({
        id: `song-${Date.now()}`,
        title: '',
        artist: '',
        key: 'Am',
        originalKey: 'Am',
        capo: 0,
        tempoBpm: 90,
        recommendedGuitar: 'Lag Primavera',
        kemperPreset: 'Acoustic Folk Clean',
        pedalPreset: 'Ditto X2 + Eventide H9 Space',
        drumBrutePreset: 'Bank A - Beat 01',
        miniloguePreset: 'Bypass',
        notes: '',
        estimatedDurationSec: 210,
        scrollSpeedPps: 28,
        content: `[Intro]
Am   C   G   D

[Couplet 1]
Am               C
   Paroles du premier couplet...
G                D
   Deuxième ligne de chant...

[Refrain]
F                C
   Paroles du refrain...
G                Am
   Suite du refrain...`,
      })
    }
  }, [song, isOpen])

  if (!isOpen) return null

  const handleImportUg = async () => {
    if (!ugUrl.trim()) return
    setIsImporting(true)
    setImportStatus({ type: null, message: '' })

    try {
      const res = await fetch(`/api/scrape-ug?url=${encodeURIComponent(ugUrl.trim())}`)
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'importation")
      }

      const s = data.song
      setFormData(prev => ({
        ...prev,
        title: s.title || prev.title,
        artist: s.artist || prev.artist,
        key: s.key || prev.key,
        originalKey: s.originalKey || prev.originalKey,
        capo: s.capo ?? prev.capo,
        recommendedGuitar: s.recommendedGuitar || prev.recommendedGuitar,
        kemperPreset: s.kemperPreset || prev.kemperPreset,
        pedalPreset: s.pedalPreset || prev.pedalPreset,
        notes: s.notes || prev.notes,
        content: s.content || prev.content,
      }))

      setImportStatus({
        type: 'success',
        message: `« ${s.title} » (${s.artist}) importé ! (Clé: ${s.key}, Capo: ${s.capo}, Guitare: ${s.recommendedGuitar})`
      })
    } catch (err: any) {
      setImportStatus({
        type: 'error',
        message: err.message || "Impossible d'importer cette tablature."
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f1420] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-[#0d121c] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Guitar className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {song ? `Modifier : ${song.title}` : 'Ajouter un nouveau morceau au répertoire'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto p-6 gap-6">
          
          {/* Module d'importation rapide Ultimate Guitar */}
          <div className="p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl flex flex-col gap-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Importation Rapide Ultimate Guitar</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Collez l'URL publique pour pré-remplir la grille et les métadonnées
              </span>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="url"
                value={ugUrl}
                onChange={(e) => setUgUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleImportUg()
                  }
                }}
                placeholder="https://tabs.ultimate-guitar.com/tab/artiste/morceau-chords-12345"
                className="flex-1 px-3.5 py-2 bg-[#07090e] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono"
              />
              <button
                type="button"
                onClick={handleImportUg}
                disabled={isImporting || !ugUrl.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extraction...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Importer</span>
                  </>
                )}
              </button>
            </div>

            {importStatus.message && (
              <div 
                className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                  importStatus.type === 'error'
                    ? 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                    : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                }`}
              >
                {importStatus.type === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>

          
          {/* Ligne 1 : Titre & Artiste */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Titre du morceau *
              </label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Hurt, Creep, Wish You Were Here..."
                className="w-full px-3.5 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Artiste / Groupe *
              </label>
              <input 
                type="text" 
                required
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="Ex: Johnny Cash, Radiohead, Pink Floyd..."
                className="w-full px-3.5 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Ligne 2 : Guitare, Kemper & Pedalboard */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Guitar className="w-3.5 h-3.5 text-indigo-400" />
                Guitare assignée
              </label>
              <select
                value={formData.recommendedGuitar}
                onChange={(e) => setFormData({ ...formData, recommendedGuitar: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Lag Primavera">Lag Primavera (Acoustique)</option>
                <option value="Fender Jaguar">Fender Jaguar</option>
                <option value="Duesenberg Paloma">Duesenberg Paloma</option>
                <option value="Fender Telecaster Baja">Fender Telecaster Baja</option>
                <option value="Lag Roxanne">Lag Roxanne</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Preset Kemper Profiler
              </label>
              <input 
                type="text"
                value={formData.kemperPreset}
                onChange={(e) => setFormData({ ...formData, kemperPreset: e.target.value })}
                placeholder="Ex: Vox AC30 Top Boost, Dumble Clean..."
                className="w-full px-3 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Preset Pédales / MC-8
              </label>
              <input 
                type="text"
                value={formData.pedalPreset || ''}
                onChange={(e) => setFormData({ ...formData, pedalPreset: e.target.value })}
                placeholder="Ex: Eventide H9 Shimmer + Memory Man"
                className="w-full px-3 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Ligne 3 : Tonalité, Capo, Tempo, Vitesse Scroll */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-sky-400" />
                Tonalité
              </label>
              <input 
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="Am, G, E..."
                className="w-full px-3 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Capo (frette)
              </label>
              <input 
                type="number"
                min="0"
                max="12"
                value={formData.capo}
                onChange={(e) => setFormData({ ...formData, capo: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Tempo (BPM)
              </label>
              <input 
                type="number"
                min="40"
                max="240"
                value={formData.tempoBpm}
                onChange={(e) => setFormData({ ...formData, tempoBpm: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                Vitesse Défilement (px/s)
              </label>
              <input 
                type="number"
                min="10"
                max="80"
                value={formData.scrollSpeedPps}
                onChange={(e) => setFormData({ ...formData, scrollSpeedPps: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-[#07090e] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Grille d'Accords & Paroles */}
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              Tablatures & Paroles (Format texte / ChordPro)
            </label>
            <textarea
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-4 bg-[#07090e] border border-slate-700 rounded-xl text-slate-200 font-mono text-sm leading-relaxed focus:outline-none focus:border-amber-500 select-text"
              placeholder="Collez ici les sections [Couplet], [Refrain] avec les accords au-dessus des paroles..."
            />
          </div>

          {/* Boutons d'Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              Enregistrer le morceau
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
