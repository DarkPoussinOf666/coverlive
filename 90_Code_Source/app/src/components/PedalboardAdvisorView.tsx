import React, { useState } from 'react'
import type { Song, Playlist } from '../types/song'
import { 
  diagnosePlaylistPedalboard, 
  HARDWARE_PEDALBOARD,
  type PlaylistPedalDiagnostic 
} from '../utils/pedalboardAdvisor'
import { 
  Sliders, 
  Layers, 
  PowerOff, 
  Cpu, 
  Radio, 
  Sparkles, 
  Check, 
  Info,
  GitBranch
} from 'lucide-react'
import { SignalChainBoard } from './PedalSVG/SignalChainBoard'

interface PedalboardAdvisorViewProps {
  playlist: Playlist
  songs: Song[]
  onApplySuggestionsToSongs?: (updatedSongs: Song[]) => void
}

export const PedalboardAdvisorView: React.FC<PedalboardAdvisorViewProps> = ({
  playlist,
  songs,
  onApplySuggestionsToSongs
}) => {
  const [activeTab, setActiveTab] = useState<'chain' | 'overview' | 'mc8' | 'songs'>('chain')
  const [selectedSongId, setSelectedSongId] = useState<string>('')
  const [justApplied, setJustApplied] = useState(false)

  const diagnostic: PlaylistPedalDiagnostic = diagnosePlaylistPedalboard(playlist, songs)

  // Morceau actuellement sélectionné pour la simulation SVG
  const currentSongSug = diagnostic.songSuggestions.find(s => s.songId === selectedSongId) 
    || diagnostic.songSuggestions[0]

  const handleApplyAll = () => {
    if (!onApplySuggestionsToSongs) return
    const updatedSongs = songs.map(s => {
      const suggestion = diagnostic.songSuggestions.find(sug => sug.songId === s.id)
      if (suggestion) {
        const pedalsSummary = HARDWARE_PEDALBOARD
          .filter(p => suggestion.activePedalIds.includes(p.id) && p.id !== 'mc8')
          .map(p => p.shortName)
          .join(' + ')

        return {
          ...s,
          pedalPreset: `${suggestion.mc8BankPreset} [${pedalsSummary}]`,
          kemperPreset: suggestion.kemperProfile
        }
      }
      return s
    })

    onApplySuggestionsToSongs(updatedSongs)
    setJustApplied(true)
    setTimeout(() => setJustApplied(false), 3000)
  }

  const dormantCount = diagnostic.dormantPedalIds.length
  const activeCount = HARDWARE_PEDALBOARD.length - dormantCount

  return (
    <div className="flex-1 flex flex-col gap-5 overflow-hidden">
      
      {/* 1. Header & Synthèse du Pedalboard pour cette Playlist */}
      <div className="p-4 rounded-2xl bg-[#07090e] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-white">
                Configuration Pedalboard — {diagnostic.playlistName}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {diagnostic.totalSongs} morceaux
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Chaîne de son SVG interactive, câblage en série, Morningstar MC-8 et presets Kemper
            </p>
          </div>
        </div>

        {/* Action Harmonisation & Application */}
        <div className="flex items-center gap-3">
          {onApplySuggestionsToSongs && (
            <button
              onClick={handleApplyAll}
              disabled={justApplied || diagnostic.totalSongs === 0}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                justApplied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
              }`}
            >
              {justApplied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Presets Appliqués aux Morceaux !
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Appliquer les presets à la setlist
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. Barre d'onglets de navigation du Diagnostic */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chain')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'chain'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Signal Chain & Board SVG
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Matrice ({activeCount} actives / {dormantCount} dormantes)
          </button>

          <button
            onClick={() => setActiveTab('mc8')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'mc8'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            Plan Morningstar MC-8 ({diagnostic.mc8BankPlan.length} banque{diagnostic.mc8BankPlan.length > 1 ? 's' : ''})
          </button>

          <button
            onClick={() => setActiveTab('songs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'songs'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            Détail Morceaux ({diagnostic.songSuggestions.length})
          </button>
        </div>

        {dormantCount > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
            <Info className="w-3.5 h-3.5" />
            <span>{dormantCount} pédale{dormantCount > 1 ? 's' : ''} non sollicitée{dormantCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* 3. Contenu de l'onglet actif */}
      <div className="flex-1 overflow-y-auto pr-1">
        
        {/* VUE 0 : SIGNAL CHAIN & BOARD SVG INTERACTIF */}
        {activeTab === 'chain' && (
          <SignalChainBoard
            currentSongSuggestion={currentSongSug}
            allSuggestions={diagnostic.songSuggestions}
            onSelectSong={(id) => setSelectedSongId(id)}
            selectedSongId={selectedSongId || currentSongSug?.songId}
          />
        )}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            
            {/* Pédales indispensables & fréquentes */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
                Pédales Sollicitées pour ce set
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {diagnostic.pedalUsage
                  .filter(u => u.status !== 'dormant')
                  .map(({ pedal, usageCount, percentage, status }) => {
                    const badgeBg = 
                      status === 'indispensable' 
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40' 
                        : status === 'frequent'
                        ? 'bg-amber-950/70 text-amber-300 border-amber-800/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'

                    return (
                      <div
                        key={pedal.id}
                        className="p-3.5 rounded-xl bg-[#07090e] border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-sm">{pedal.name}</h5>
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                              {pedal.type === 'dsp' ? 'DSP Numérique' : pedal.type === 'analog' ? 'Analogique' : 'Contrôleur'}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeBg}`}>
                            {percentage}% ({usageCount} morceaux)
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          {pedal.description}
                        </p>

                        {/* Barre de progression d'utilisation */}
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              status === 'indispensable' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Pédales dormantes (Inutilisées dans ce set) */}
            {dormantCount > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2.5">
                  <PowerOff className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pédales Dormantes / Non utilisées sur cette Setlist
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {diagnostic.pedalUsage
                    .filter(u => u.status === 'dormant')
                    .map(({ pedal }) => (
                      <div
                        key={pedal.id}
                        className="p-3 rounded-xl bg-[#07090e]/50 border border-slate-800/50 opacity-60 hover:opacity-100 transition flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-semibold text-slate-300 text-xs">{pedal.name}</h5>
                          <span className="text-[10px] text-slate-500 font-mono">0 morceau sollicité</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                          Bypass complet
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VUE 2 : PLAN MORNINGSTAR MC-8 */}
        {activeTab === 'mc8' && (
          <div className="flex flex-col gap-6">
            {diagnostic.mc8BankPlan.map((bank) => (
              <div key={bank.bankNumber} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    Banque MC-8 #{bank.bankNumber} — {bank.bankName}
                  </h5>
                  <span className="text-xs text-slate-500 font-mono">
                    8 commutateurs au pied (A à H)
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => {
                    const slot = bank.slots.find(s => s.letter === letter)
                    return (
                      <div
                        key={letter}
                        className={`p-3 rounded-xl border flex flex-col justify-between min-h-[100px] ${
                          slot
                            ? 'bg-[#07090e] border-slate-800 hover:border-slate-700'
                            : 'bg-[#07090e]/40 border-slate-800/40 opacity-40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/50 flex items-center justify-center font-bold text-xs font-mono">
                            {letter}
                          </span>
                          {slot && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              PC #{slot.pcNumber}
                            </span>
                          )}
                        </div>

                        {slot ? (
                          <div className="mt-2">
                            <h6 className="font-bold text-white text-xs truncate" title={slot.songTitle}>
                              {slot.songTitle}
                            </h6>
                            <p className="text-[10px] text-amber-400/90 truncate mt-0.5">
                              {slot.pedalsSummary}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-slate-600 font-mono">
                            (Vide / Inactif)
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VUE 3 : DÉTAIL MORCEAU PAR MORCEAU */}
        {activeTab === 'songs' && (
          <div className="flex flex-col gap-3">
            {diagnostic.songSuggestions.map((sug, idx) => (
              <div
                key={sug.songId}
                className="p-3.5 rounded-xl bg-[#07090e] border border-slate-800 hover:border-slate-700 transition flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-white text-sm">{sug.title}</h5>
                      <span className="text-xs text-slate-400">{sug.artist}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
                    {sug.mc8BankPreset}
                  </span>
                </div>

                {/* Détails Sonores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Profil Kemper</span>
                    <span className="font-semibold text-emerald-400 truncate block">{sug.kemperProfile}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Gain & Drive</span>
                    <span className="font-semibold text-yellow-400 truncate block">{sug.primaryDrive}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Espace & Délai</span>
                    <span className="font-semibold text-cyan-400 truncate block">{sug.primaryModDelay}</span>
                  </div>
                </div>

                {/* Pédales Actives Badge List */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Pédales :</span>
                  {sug.activePedalIds.map(pedalId => {
                    const pedal = HARDWARE_PEDALBOARD.find(p => p.id === pedalId)
                    if (!pedal) return null
                    return (
                      <span
                        key={pedalId}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                      >
                        {pedal.shortName}
                      </span>
                    )
                  })}
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  💡 {sug.explanation}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  )
}
