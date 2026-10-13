import React, { useState } from 'react'
import {
  HARDWARE_PEDALBOARD,
  type PedalDevice,
  type SongPedalSuggestion
} from '../../utils/pedalboardAdvisor'
import { PedalRenderer } from './PedalRenderer'
import {
  ArrowRight,
  Radio,
  Zap,
  Volume2,
  Sliders,
  CircleDot
} from 'lucide-react'

interface SignalChainBoardProps {
  currentSongSuggestion?: SongPedalSuggestion
  allSuggestions: SongPedalSuggestion[]
  onSelectSong?: (songId: string) => void
  selectedSongId?: string
}

export const SignalChainBoard: React.FC<SignalChainBoardProps> = ({
  currentSongSuggestion,
  allSuggestions,
  onSelectSong,
  selectedSongId
}) => {
  // Pédale actuellement inspectée dans le panneau latéral/inférieur
  const [inspectedPedalId, setInspectedPedalId] = useState<string>('whammy5')
  const [filterMode, setFilterMode] = useState<'all' | 'active_only'>('all')

  // Récupérer la liste des pédales de la chaîne audio triées par ordre physique de routing (1 -> 13)
  const audioChainPedals = [...HARDWARE_PEDALBOARD]
    .filter(p => p.signalChainOrder > 0)
    .sort((a, b) => a.signalChainOrder - b.signalChainOrder)

  // Contrôleur MC-8 MIDI
  const mc8Pedal = HARDWARE_PEDALBOARD.find(p => p.id === 'mc8')

  // Set des IDs actifs sur le morceau actuellement sélectionné
  const activeIds = new Set<string>(currentSongSuggestion?.activePedalIds || ['h9_space'])

  // Pédale inspectée
  const inspectedPedal: PedalDevice =
    HARDWARE_PEDALBOARD.find(p => p.id === inspectedPedalId) || audioChainPedals[0]

  const isInspectedActive = activeIds.has(inspectedPedal.id)

  // Calcul du slot MC-8 pour l'affichage LCD
  let mc8SlotLetter = 'A'
  let mc8BankName = 'SETLIST'
  if (currentSongSuggestion?.mc8BankPreset) {
    const match = currentSongSuggestion.mc8BankPreset.match(/Preset\s+([A-H])/i)
    if (match) mc8SlotLetter = match[1]
    const bankMatch = currentSongSuggestion.mc8BankPreset.match(/Bank\s+(\d+)/i)
    if (bankMatch) mc8BankName = `BANK ${bankMatch[1]}`
  }

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* 1. Barre de contrôle supérieur : Sélecteur de Morceau du Set & Filtre */}
      <div className="p-3.5 rounded-2xl bg-[#090b10] border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Morceau actif pour la simulation
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedSongId || currentSongSuggestion?.songId || ''}
                onChange={(e) => onSelectSong?.(e.target.value)}
                className="bg-slate-900 text-white font-bold text-xs rounded-lg border border-slate-700 px-2.5 py-1 focus:outline-none focus:border-amber-400"
              >
                {allSuggestions.map((sug, idx) => (
                  <option key={sug.songId} value={sug.songId}>
                    #{idx + 1} {sug.title} ({sug.artist})
                  </option>
                ))}
              </select>

              {currentSongSuggestion && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/50 text-amber-300">
                  {currentSongSuggestion.mc8BankPreset}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Kemper & Stats d'activation */}
        <div className="flex items-center gap-4">
          {currentSongSuggestion && (
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Profil Kemper associé</span>
              <span className="text-xs font-bold text-emerald-400 truncate max-w-[220px]">
                {currentSongSuggestion.kemperProfile}
              </span>
            </div>
          )}

          {/* Toggle filtre actives uniquement */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chaîne Complète ({audioChainPedals.length})
            </button>
            <button
              onClick={() => setFilterMode('active_only')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                filterMode === 'active_only'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CircleDot className="w-3 h-3 text-amber-400" />
              Actives ({activeIds.size})
            </button>
          </div>
        </div>
      </div>

      {/* 2. Le Board Visuel : Signal Chain Linéaire (In Guitar -> Out Kemper) */}
      <div className="relative rounded-2xl bg-[#06080d] border border-slate-800 p-4 shadow-2xl overflow-hidden">
        
        {/* En-tête de la chaîne */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Audio Signal Flow — Câblage Série Haute Définition
            </span>
            <span className="text-[10px] text-slate-500">
              (Guitare In ➔ Pré-gain ➔ Drives ➔ Modulations ➔ Délais ➔ Réverbe ➔ Looper ➔ Kemper Profiler)
            </span>
          </div>

          <div className="text-[10px] text-amber-400/90 font-mono">
            {activeIds.size} matériel(s) sous tension • Cliquez sur un item pour inspecter
          </div>
        </div>

        {/* Conteneur de Défilement Horizontal du Signal Chain */}
        <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          <div className="flex items-center gap-2 min-w-max px-2">
            
            {/* ENTRÉE SIGNAL : GUITARE IN */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-slate-700 w-28 h-40 shrink-0 text-center shadow-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-white">GUITARE IN</span>
              <span className="text-[9px] text-slate-400 mt-1 font-mono">Jack 6.35mm</span>
              <span className="text-[9px] text-emerald-400 mt-1 font-semibold">Signal Clean Dry</span>
            </div>

            {/* Câble Patch Début */}
            <div className="flex items-center px-1 text-slate-600">
              <ArrowRight className="w-5 h-5 text-emerald-400/80" />
            </div>

            {/* BOUCLE DES PÉDALES AUDIO (1 à 13) */}
            {audioChainPedals
              .filter(pedal => filterMode === 'all' || activeIds.has(pedal.id))
              .map((pedal, index, filteredList) => {
                const isActive = activeIds.has(pedal.id)
                const isSelected = inspectedPedalId === pedal.id

                return (
                  <React.Fragment key={pedal.id}>
                    {/* Carte de la Pédale avec son SVG */}
                    <div
                      onClick={() => setInspectedPedalId(pedal.id)}
                      className={`group relative flex flex-col items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all duration-200 shrink-0 ${
                        isSelected
                          ? 'ring-2 ring-amber-400 bg-slate-800/80 shadow-amber-500/20 shadow-xl'
                          : 'hover:bg-slate-900/80 bg-slate-950/40'
                      }`}
                      style={{
                        width: `${Math.max(pedal.dimensions.width * 1.05, 128)}px`,
                        height: '280px'
                      }}
                    >
                      {/* Badge Ordre dans la Chaîne & Statut ON/OFF */}
                      <div className="w-full flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          #{pedal.signalChainOrder}
                        </span>

                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {isActive ? 'ON' : 'BYPASS'}
                        </span>
                      </div>

                      {/* Représentation SVG Vectorielle */}
                      <div
                        className={`w-full flex-1 flex items-center justify-center p-1 transition-transform duration-200 ${
                          isSelected ? 'scale-105' : 'group-hover:scale-102'
                        } ${!isActive ? 'opacity-55 grayscale-[30%]' : 'opacity-100 drop-shadow-[0_0_12px_rgba(245,158,11,0.2)]'}`}
                      >
                        <PedalRenderer
                          pedal={pedal}
                          isActive={isActive}
                          isHovered={isSelected}
                        />
                      </div>

                      {/* Titre & Info Synthétique au pied */}
                      <div className="w-full text-center mt-2 px-1">
                        <span className="block text-xs font-bold text-white truncate">
                          {pedal.shortName}
                        </span>
                        <span className="block text-[9px] text-slate-400 font-mono truncate">
                          {pedal.type === 'dsp' ? 'DSP 32-bit' : 'Analogique'}
                        </span>
                      </div>
                    </div>

                    {/* Connecteur / Flèche de câble audio entre pédales */}
                    {index < filteredList.length - 1 && (
                      <div className="flex flex-col items-center justify-center px-1 shrink-0">
                        <div className="w-4 h-1 bg-slate-700 rounded-full mb-1" />
                        <ArrowRight
                          className={`w-4 h-4 ${
                            isActive ? 'text-amber-400/90' : 'text-slate-600'
                          }`}
                        />
                        <span className="text-[8px] text-slate-500 font-mono">Jack</span>
                      </div>
                    )}
                  </React.Fragment>
                )
              })}

            {/* Câble Sortie Fin */}
            <div className="flex items-center px-1 text-slate-600">
              <ArrowRight className="w-5 h-5 text-amber-400/80" />
            </div>

            {/* SORTIE DU SIGNAL : KEMPER PROFILER / MINIFUSE */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-slate-700 w-32 h-40 shrink-0 text-center shadow-lg">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-white">KEMPER OUT</span>
              <span className="text-[9px] text-slate-400 mt-1 font-mono">MiniFuse In 1 (Mono/L)</span>
              <span className="text-[9px] text-cyan-300 mt-1 font-semibold truncate max-w-[110px]">
                {currentSongSuggestion?.kemperProfile || 'Studio Profile'}
              </span>
            </div>

          </div>
        </div>

        {/* 3. Section Basse : Morningstar MC-8 (Master MIDI Controller) */}
        {mc8Pedal && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-center gap-6 bg-[#0a0d14] p-4 rounded-xl">
            <div className="flex flex-col md:w-64 shrink-0">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <Radio className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">
                  MIDI Control Bus (MC-8)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Le pédalier Morningstar pilote simultanément par USB/MIDI les 3 Eventide H9, le Boss OD-200 et les profils du Kemper.
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800 font-mono">
                  Preset Actif : {mc8SlotLetter}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  5 Cibles MIDI
                </span>
              </div>
            </div>

            {/* Représentation SVG du contrôleur MC-8 */}
            <div
              onClick={() => setInspectedPedalId('mc8')}
              className={`flex-1 max-w-[340px] cursor-pointer transition p-2 rounded-xl ${
                inspectedPedalId === 'mc8' ? 'ring-2 ring-amber-400 bg-slate-800/40' : 'hover:bg-slate-900/40'
              }`}
            >
              <PedalRenderer
                pedal={mc8Pedal}
                isActive={true}
                activeSlotLetter={mc8SlotLetter}
                currentBankName={mc8BankName}
              />
            </div>

            {/* Résumé des connexions MIDI */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">MIDI CH 1</span>
                <span className="text-cyan-400 font-bold">H9 #1 Space</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">MIDI CH 2</span>
                <span className="text-blue-400 font-bold">H9 #2 Delay</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">MIDI CH 3</span>
                <span className="text-violet-400 font-bold">H9 #3 Mod</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">MIDI CH 4</span>
                <span className="text-yellow-400 font-bold">Boss OD-200</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">MIDI CH 5</span>
                <span className="text-emerald-400 font-bold">Kemper Profiler</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Panneau Détail & Inspection de la Pédale Sélectionnée */}
      {inspectedPedal && (
        <div className="p-4 rounded-2xl bg-[#090b10] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 shrink-0 flex items-center justify-center p-1 bg-slate-950 rounded-xl border border-slate-800">
              <PedalRenderer
                pedal={inspectedPedal}
                isActive={isInspectedActive}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">{inspectedPedal.name}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isInspectedActive
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isInspectedActive ? 'Engagée sur ce titre' : 'Bypass / Inactive'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {inspectedPedal.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono text-slate-400">
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  ⚡ Alim : {inspectedPedal.powerInfo}
                </span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {inspectedPedal.hasMidi ? '🎹 Pilotable MIDI' : '🔌 Câblage Audio Pur'}
                </span>
                {inspectedPedal.signalChainOrder > 0 && (
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-400">
                    Pos. #{inspectedPedal.signalChainOrder} dans la chaîne
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Rôle Diégétique</span>
              <span className="text-xs font-semibold text-white">
                {inspectedPedal.category === 'gain'
                  ? 'Étage de Saturation'
                  : inspectedPedal.category === 'delay_reverb'
                  ? 'Spatialisation & Réflexion'
                  : inspectedPedal.category === 'modulation_pitch'
                  ? 'Couleur & Mouvement'
                  : inspectedPedal.category === 'synth_looper'
                  ? 'Texture Synth & Loop'
                  : 'Contrôleur Global'}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
