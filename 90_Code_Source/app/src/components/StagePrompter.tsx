import React, { useState, useEffect } from 'react'
import type { Song } from '../types/song'
import { ChordProViewer } from './ChordProViewer'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Gauge, 
  Type, 
  Maximize2, 
  Minimize2,
  Guitar,
  Sliders,
  Music,
  Drum,
  KeyRound
} from 'lucide-react'

interface StagePrompterProps {
  song: Song
  onNext?: () => void
  onPrev?: () => void
  hasNext: boolean
  hasPrev: boolean
  onExit: () => void
  setlistInfo?: {
    name: string
    currentIndex: number
    totalCount: number
    nextSong?: Song
  }
}

export const StagePrompter: React.FC<StagePrompterProps> = ({
  song,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onExit,
  setlistInfo
}) => {
  const [speedPps, setSpeedPps] = useState<number>(song.scrollSpeedPps || 28)
  const [fontSizePx, setFontSizePx] = useState<number>(24)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [hudMessage, setHudMessage] = useState<string | null>(null)
  const hudTimeoutRef = React.useRef<number | null>(null)
  const isControlsVisible = true

  const showHud = (msg: string) => {
    setHudMessage(msg)
    if (hudTimeoutRef.current) window.clearTimeout(hudTimeoutRef.current)
    hudTimeoutRef.current = window.setTimeout(() => {
      setHudMessage(null)
    }, 1100)
  }

  const { containerRef, isPlaying, toggle, resetToTop, pause } = useAutoScroll({
    speedPps,
    onFinished: () => {
      showHud('🏁 FIN DU MORCEAU')
    }
  })

  // Synchroniser la vitesse et réinitialiser uniquement quand l'ID du morceau change
  useEffect(() => {
    setSpeedPps(song.scrollSpeedPps || 28)
    resetToTop()
    pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.id])

  // Raccourcis clavier de scène (Espace: play/pause, R: reset, Flèches: vitesse, N/P: navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si on est dans un champ de texte
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
        showHud(!isPlaying ? '▶ DÉFILEMENT' : '⏸ PAUSE')
      } else if (e.code === 'KeyR') {
        e.preventDefault()
        resetToTop()
        showHud('↺ RETOUR EN HAUT')
      } else if (e.code === 'ArrowUp') {
        e.preventDefault()
        setSpeedPps((prev) => {
          const next = Math.min(prev + 2, 80)
          showHud(`⚡ VITESSE : ${next} px/s`)
          return next
        })
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        setSpeedPps((prev) => {
          const next = Math.max(prev - 2, 8)
          showHud(`⚡ VITESSE : ${next} px/s`)
          return next
        })
      } else if (e.code === 'ArrowRight' && hasNext && onNext) {
        e.preventDefault()
        showHud('⏭ MORCEAU SUIVANT')
        onNext()
      } else if (e.code === 'ArrowLeft' && hasPrev && onPrev) {
        e.preventDefault()
        showHud('⏮ MORCEAU PRÉCÉDENT')
        onPrev()
      } else if (e.code === 'Escape') {
        onExit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle, resetToTop, hasNext, hasPrev, onNext, onPrev, onExit, isPlaying])

  // Bascule Plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
        showHud('⛶ PLEIN ÉCRAN')
      }).catch(() => {})
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
        showHud('🗗 FENÊTRÉ')
      }).catch(() => {})
    }
  }

  return (
    <div className="relative w-screen h-screen bg-[#07090e] text-slate-100 flex flex-col overflow-hidden select-none">
      
      {/* 0. HUD Transitoire de Commande Scène (Feedback visuel immédiat) */}
      {hudMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="px-6 py-3.5 rounded-2xl bg-black/90 backdrop-blur-md border border-amber-500/70 shadow-2xl text-amber-300 font-mono text-lg font-black tracking-widest flex items-center gap-3">
            {hudMessage}
          </div>
        </div>
      )}

      {/* 1. Header Scène Minimaliste (Infos live & Mémos Matos) */}
      <header className="px-6 py-3 bg-[#0d121c] border-b border-slate-800 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="min-h-[44px] px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl spectrum-focus-ring transition"
          >
            ← Quitter Scène
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-wide">{song.title}</h1>
              <span className="text-slate-300 text-sm font-medium">— {song.artist}</span>
            </div>
            
            {/* Badges Matériel Scène — Palette Spectrum haute lisibilité */}
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-200 border border-indigo-700/60">
                <Guitar className="w-3.5 h-3.5" />
                {song.recommendedGuitar}
              </span>
              
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-700/60">
                <Sliders className="w-3.5 h-3.5" />
                Kemper: {song.kemperPreset}
              </span>

              {song.capo > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-200 border border-amber-700/60">
                  <KeyRound className="w-3.5 h-3.5" />
                  Capo {song.capo}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800">
                  Pas de Capo
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800">
                <Music className="w-3.5 h-3.5 text-sky-400" />
                {song.key} • {song.tempoBpm} BPM
              </span>

              {song.drumBrutePreset && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-950/80 text-purple-200 border border-purple-700/60">
                  <Drum className="w-3 h-3" />
                  {song.drumBrutePreset}
                </span>
              )}

              {song.pedalPreset && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-950/80 text-pink-200 border border-pink-700/60">
                  <Sliders className="w-3 h-3" />
                  MC-8: {song.pedalPreset}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Indicateur Setlist & Morceau Suivant */}
        <div className="flex items-center gap-3">
          {setlistInfo && (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <span>📋 {setlistInfo.name}</span>
                <span className="text-amber-400 font-mono">({setlistInfo.currentIndex + 1} / {setlistInfo.totalCount})</span>
              </div>

              {setlistInfo.nextSong && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-400 font-medium">À suivre :</span>
                  <span className="font-semibold text-slate-100 truncate max-w-[140px]">{setlistInfo.nextSong.title}</span>
                  {setlistInfo.nextSong.recommendedGuitar !== song.recommendedGuitar ? (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/80 text-red-200 border border-red-700/60 font-bold animate-pulse">
                      🎸 Changer : {setlistInfo.nextSong.recommendedGuitar}
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      Même guitare
                    </span>
                  )}
                  {setlistInfo.nextSong.capo !== song.capo && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-200 border border-amber-700/60 font-bold">
                      Capo {setlistInfo.nextSong.capo}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-xs font-mono font-medium tracking-wider uppercase text-slate-200">
              {isPlaying ? 'DÉFILEMENT ACTIF' : 'PAUSE'}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700 rounded-xl spectrum-focus-ring transition"
            title="Plein écran (F11)"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Zone de Téléprompteur Haute Lisibilité (Scroll Area) */}
      <main 
        ref={containerRef}
        onClick={toggle}
        className="flex-1 px-8 md:px-20 lg:px-36 py-12 overflow-y-auto cursor-pointer select-none"
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="max-w-4xl mx-auto pb-48">
          {song.notes && (
            <div className="mb-8 p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200 text-sm">
              <span className="font-bold mr-2">📌 NOTE DE JEU :</span>
              {song.notes}
            </div>
          )}

          <ChordProViewer content={song.content} fontSizePx={fontSizePx} />
        </div>
      </main>

      {/* 3. Barre de Contrôle Flottante de Scène (Boutons tactiles 44-48px conformes Spectrum) */}
      <footer 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ${
          isControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-20 hover:opacity-100 translate-y-2'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0f1420]/95 backdrop-blur-md border border-slate-700/80 shadow-2xl">
          
          {/* Précédent (48x48px) */}
          <button
            disabled={!hasPrev}
            onClick={(e) => { e.stopPropagation(); onPrev?.() }}
            className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl bg-slate-800/90 hover:bg-slate-700 spectrum-focus-ring transition"
            title="Morceau précédent (Flèche Gauche)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* PLAY / PAUSE MAÎTRE (56x56px) */}
          <button
            onClick={(e) => { e.stopPropagation(); toggle() }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-transform active:scale-95 spectrum-focus-ring ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40' 
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
            }`}
            title="Démarrer / Pause (Espace)"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-0.5" />}
          </button>

          {/* Reset en Haut (48x48px) */}
          <button
            onClick={(e) => { e.stopPropagation(); resetToTop() }}
            className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-white rounded-xl bg-slate-800/90 hover:bg-slate-700 spectrum-focus-ring transition"
            title="Retour en haut (Touche R)"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          {/* Suivant (48x48px) */}
          <button
            disabled={!hasNext}
            onClick={(e) => { e.stopPropagation(); onNext?.() }}
            className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl bg-slate-800/90 hover:bg-slate-700 spectrum-focus-ring transition"
            title="Morceau suivant (Flèche Droite)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="w-px h-8 bg-slate-700 mx-1" />

          {/* Réglage de Vitesse (Pixels / Sec) */}
          <div className="flex items-center gap-2 px-2 min-h-[44px]" onClick={(e) => e.stopPropagation()}>
            <Gauge className="w-5 h-5 text-amber-400 shrink-0" />
            <input 
              type="range"
              min="10"
              max="70"
              value={speedPps}
              onChange={(e) => {
                const val = Number(e.target.value)
                setSpeedPps(val)
                showHud(`⚡ VITESSE : ${val} px/s`)
              }}
              className="w-24 accent-amber-500 cursor-pointer h-2"
            />
            <span className="text-xs font-mono w-14 text-slate-200">{speedPps} px/s</span>
          </div>

          <div className="w-px h-8 bg-slate-700 mx-1" />

          {/* Réglage Taille de Police (Boutons tactiles 44x44px conformes Adobe Spectrum) */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => {
                setFontSizePx((prev) => {
                  const next = Math.max(prev - 2, 16)
                  showHud(`🗛 POLICE : ${next} px`)
                  return next
                })
              }}
              className="w-11 h-11 flex items-center justify-center text-slate-200 hover:text-white rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold spectrum-focus-ring transition"
              title="Réduire police (A-)"
            >
              A-
            </button>
            <Type className="w-4 h-4 text-slate-400" />
            <button 
              onClick={() => {
                setFontSizePx((prev) => {
                  const next = Math.min(prev + 2, 38)
                  showHud(`🗛 POLICE : ${next} px`)
                  return next
                })
              }}
              className="w-11 h-11 flex items-center justify-center text-slate-200 hover:text-white rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold spectrum-focus-ring transition"
              title="Agrandir police (A+)"
            >
              A+
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
