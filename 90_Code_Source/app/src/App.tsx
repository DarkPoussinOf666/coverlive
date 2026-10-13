import { useState, useEffect, useMemo } from 'react'
import type { Song, Playlist } from './types/song'
import { INITIAL_SONGS } from './data/initialSongs'
import { INITIAL_PLAYLISTS } from './data/initialPlaylists'
import importedCatalog from './data/importedCatalog.json'
import { StagePrompter } from './components/StagePrompter'
import { SongEditorModal } from './components/SongEditorModal'
import { PlaylistEditorModal } from './components/PlaylistEditorModal'
import { PlaylistsView } from './components/PlaylistsView'
import { PedalboardAdvisorView } from './components/PedalboardAdvisorView'
import { CatalogFilterBar, type FilterState } from './components/CatalogFilterBar'
import { 
  Music2, 
  Play, 
  Guitar, 
  Sliders, 
  ListMusic, 
  FileText, 
  Radio, 
  KeyRound, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Layers
} from 'lucide-react'
import { decodeHtmlEntities } from './utils/textCleaner'

export function App() {
  // 1. État Répertoire des morceaux avec nettoyage automatique des entités HTML
  const [songs, setSongs] = useState<Song[]>(() => {
    let list: Song[] = []
    const saved = localStorage.getItem('yrio_songs')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed
        }
      } catch (e) {
        // Fallback
      }
    }
    if (list.length === 0) {
      list = [
        ...INITIAL_SONGS,
        ...(importedCatalog as unknown as Song[])
      ]
    }
    // Nettoyage systématique pour assainir toute entité HTML résiduelle (&amp;, &#039;, etc.)
    return list.map(s => ({
      ...s,
      title: decodeHtmlEntities(s.title),
      artist: decodeHtmlEntities(s.artist),
      content: decodeHtmlEntities(s.content)
    }))
  })

  // 2. État Playlists / Setlists
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('yrio_playlists')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {}
    }
    return INITIAL_PLAYLISTS
  })

  // 3. Navigation et Vues
  const [activeTab, setActiveTab] = useState<'catalog' | 'playlists' | 'pedalboard'>('catalog')
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(() => playlists[0]?.id || null)
  const [livePlaylistId, setLivePlaylistId] = useState<string | null>(null)
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null)
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false)

  // 4. Filtres et Tris avancés
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    guitar: 'all',
    key: 'all',
    capo: 'all',
    bpmRange: 'all',
    tabStatus: 'all',
    sortBy: 'title',
    sortOrder: 'asc'
  })

  // 5. Modales
  const [isSongEditorOpen, setIsSongEditorOpen] = useState<boolean>(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [isPlaylistEditorOpen, setIsPlaylistEditorOpen] = useState<boolean>(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)

  // Persistance dans localStorage
  useEffect(() => {
    localStorage.setItem('yrio_songs', JSON.stringify(songs))
  }, [songs])

  useEffect(() => {
    localStorage.setItem('yrio_playlists', JSON.stringify(playlists))
  }, [playlists])

  // Extraction dynamique des tonalités (Keys) existantes
  const availableKeys = useMemo(() => {
    const keySet = new Set<string>()
    songs.forEach(s => {
      if (s.key && s.key.trim()) {
        keySet.add(s.key.trim())
      }
    })
    return Array.from(keySet).sort()
  }, [songs])

  // Filtrage et Tri multicritères mémoïsés
  const filteredSongs = useMemo(() => {
    const list = songs.filter(s => {
      // 1. Recherche plein texte (Titre ou Artiste)
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase()
        const inTitle = s.title.toLowerCase().includes(q)
        const inArtist = s.artist.toLowerCase().includes(q)
        if (!inTitle && !inArtist) return false
      }

      // 2. Filtre Guitare
      if (filters.guitar !== 'all' && s.recommendedGuitar !== filters.guitar) {
        return false
      }

      // 3. Filtre Tonalité (Key)
      if (filters.key !== 'all' && s.key !== filters.key) {
        return false
      }

      // 4. Filtre Capodastre
      if (filters.capo !== 'all') {
        if (filters.capo === '0' && s.capo !== 0) return false
        if (filters.capo === '1' && s.capo !== 1) return false
        if (filters.capo === '2' && s.capo !== 2) return false
        if (filters.capo === '3' && s.capo !== 3) return false
        if (filters.capo === '4+' && s.capo < 4) return false
      }

      // 5. Filtre BPM
      if (filters.bpmRange !== 'all') {
        const bpm = s.tempoBpm || 100
        if (filters.bpmRange === 'slow' && bpm >= 80) return false
        if (filters.bpmRange === 'medium' && (bpm < 80 || bpm > 120)) return false
        if (filters.bpmRange === 'fast' && bpm <= 120) return false
      }

      // 6. Statut Tablature (Accords réels vs À compléter)
      if (filters.tabStatus !== 'all') {
        const isComplete = Boolean(s.content && !s.content.includes("Paroles et accords à compléter"))
        if (filters.tabStatus === 'complete' && !isComplete) return false
        if (filters.tabStatus === 'incomplete' && isComplete) return false
      }

      return true
    })

    // Tris directionnels
    list.sort((a, b) => {
      let cmp = 0
      switch (filters.sortBy) {
        case 'title':
          cmp = a.title.localeCompare(b.title)
          break
        case 'artist':
          cmp = a.artist.localeCompare(b.artist)
          break
        case 'tempo':
          cmp = (a.tempoBpm || 0) - (b.tempoBpm || 0)
          break
        case 'duration':
          cmp = (a.estimatedDurationSec || 0) - (b.estimatedDurationSec || 0)
          break
        case 'key':
          cmp = (a.key || '').localeCompare(b.key || '')
          break
        default:
          cmp = 0
      }
      return filters.sortOrder === 'asc' ? cmp : -cmp
    })

    return list
  }, [songs, filters])

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      guitar: 'all',
      key: 'all',
      capo: 'all',
      bpmRange: 'all',
      tabStatus: 'all',
      sortBy: 'title',
      sortOrder: 'asc'
    })
  }

  const handleApplySuggestionsToSongs = (updatedSongs: Song[]) => {
    setSongs(updatedSongs)
  }

  // Morceau actuellement sélectionné
  const currentSong = songs.find(s => s.id === selectedSongId) || songs[0]

  // Gestion du Live (sur playlist ou sur tout le catalogue)
  const handleLaunchLive = (songId: string, playlist?: Playlist) => {
    setSelectedSongId(songId)
    setLivePlaylistId(playlist ? playlist.id : null)
    setIsLiveMode(true)
  }

  // Chansons actives dans le live (selon si on joue une setlist ou le catalogue)
  const activeLivePlaylist = livePlaylistId ? playlists.find(p => p.id === livePlaylistId) : null
  const liveSongList: Song[] = activeLivePlaylist 
    ? activeLivePlaylist.songIds.map(id => songs.find(s => s.id === id)).filter((s): s is Song => Boolean(s))
    : songs

  const currentLiveIndex = liveSongList.findIndex(s => s.id === (selectedSongId || currentSong?.id))
  const nextLiveSong = currentLiveIndex >= 0 && currentLiveIndex < liveSongList.length - 1 
    ? liveSongList[currentLiveIndex + 1] 
    : undefined

  const handleNextSong = () => {
    if (currentLiveIndex < liveSongList.length - 1) {
      setSelectedSongId(liveSongList[currentLiveIndex + 1].id)
    }
  }

  const handlePrevSong = () => {
    if (currentLiveIndex > 0) {
      setSelectedSongId(liveSongList[currentLiveIndex - 1].id)
    }
  }

  // Actions CRUD Chansons
  const handleSaveSong = (songToSave: Song) => {
    setSongs((prev) => {
      const existsIndex = prev.findIndex(s => s.id === songToSave.id)
      if (existsIndex >= 0) {
        const copy = [...prev]
        copy[existsIndex] = songToSave
        return copy
      } else {
        return [songToSave, ...prev]
      }
    })
    setSelectedSongId(songToSave.id)
  }

  const handleDeleteSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Voulez-vous supprimer ce morceau du répertoire ?')) {
      setSongs((prev) => prev.filter(s => s.id !== id))
      // Retirer aussi des playlists
      setPlaylists((prev) => prev.map(p => ({
        ...p,
        songIds: p.songIds.filter(sId => sId !== id)
      })))
      if (selectedSongId === id) {
        setSelectedSongId(songs[0]?.id || null)
      }
    }
  }

  // Actions CRUD Playlists
  const handleSavePlaylist = (playlistToSave: Playlist) => {
    setPlaylists((prev) => {
      const existsIndex = prev.findIndex(p => p.id === playlistToSave.id)
      if (existsIndex >= 0) {
        const copy = [...prev]
        copy[existsIndex] = playlistToSave
        return copy
      } else {
        return [...prev, playlistToSave]
      }
    })
    setActivePlaylistId(playlistToSave.id)
  }

  const handleDeletePlaylist = (id: string) => {
    if (confirm('Voulez-vous supprimer cette setlist ?')) {
      setPlaylists((prev) => prev.filter(p => p.id !== id))
      if (activePlaylistId === id) {
        setActivePlaylistId(playlists.find(p => p.id !== id)?.id || null)
      }
    }
  }

  const handleReorderSongs = (playlistId: string, newSongIds: string[]) => {
    setPlaylists((prev) => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: newSongIds, updatedAt: new Date().toISOString() }
      }
      return p
    }))
  }

  const handleAddSongToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists((prev) => prev.map(p => {
      if (p.id === playlistId && !p.songIds.includes(songId)) {
        return { ...p, songIds: [...p.songIds, songId], updatedAt: new Date().toISOString() }
      }
      return p
    }))
  }

  const handleRemoveSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists((prev) => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== songId), updatedAt: new Date().toISOString() }
      }
      return p
    }))
  }

  // 1. Vue Live / Téléprompteur Plein Écran
  if (isLiveMode && currentSong) {
    return (
      <StagePrompter
        song={currentSong}
        hasNext={currentLiveIndex < liveSongList.length - 1}
        hasPrev={currentLiveIndex > 0}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        onExit={() => setIsLiveMode(false)}
        setlistInfo={activeLivePlaylist ? {
          name: activeLivePlaylist.name,
          currentIndex: currentLiveIndex,
          totalCount: liveSongList.length,
          nextSong: nextLiveSong
        } : undefined}
      />
    )
  }

  // 2. Vue Régie / Tableau de Bord
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Régie */}
      <header className="px-8 py-3.5 bg-[#0d121c] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Guitar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">YOUR REIGN IS OVER</h1>
            <p className="text-xs text-slate-400 font-mono">
              Régie Live Stream Twitch • Guitare, Voix, Kemper & Pedalboard MC-8
            </p>
          </div>
        </div>

        {/* Navigation Onglets : Répertoire vs Setlists */}
        <div className="flex items-center bg-[#07090e] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            Répertoire Complet ({songs.length})
          </button>

          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'playlists'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music2 className="w-4 h-4" />
            Setlists Live ({playlists.length})
          </button>

          <button
            onClick={() => setActiveTab('pedalboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'pedalboard'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Pedalboard & Signal Chain
          </button>
        </div>

        {/* Boutons d'action principaux */}
        <div className="flex items-center gap-3">
          {activeTab === 'catalog' && (
            <button 
              onClick={() => {
                setEditingSong(null)
                setIsSongEditorOpen(true)
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Nouveau Morceau
            </button>
          )}
          {activeTab === 'playlists' && (
            <button 
              onClick={() => {
                setEditingPlaylist(null)
                setIsPlaylistEditorOpen(true)
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Créer une Setlist
            </button>
          )}

          <button 
            onClick={() => handleLaunchLive(currentSong?.id || songs[0]?.id || '')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
            MODE SCÈNE DIRECT
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-8 gap-8 overflow-hidden">
        
        {activeTab === 'pedalboard' ? (
          /* VUE DIRECTE DU PEDALBOARD & SIGNAL CHAIN SVG */
          <div className="flex-1 bg-[#0f1420] border border-slate-800 rounded-2xl p-6 flex flex-col overflow-hidden">
            <PedalboardAdvisorView
              playlist={playlists.find(p => p.id === activePlaylistId) || playlists[0]}
              songs={songs}
              onApplySuggestionsToSongs={handleApplySuggestionsToSongs}
            />
          </div>
        ) : activeTab === 'playlists' ? (
          /* VUE PLAYLISTS & SETLISTS LIVE */
          <PlaylistsView
            playlists={playlists}
            songs={songs}
            activePlaylistId={activePlaylistId}
            onSelectPlaylist={setActivePlaylistId}
            onCreatePlaylist={() => {
              setEditingPlaylist(null)
              setIsPlaylistEditorOpen(true)
            }}
            onEditPlaylist={(pl) => {
              setEditingPlaylist(pl)
              setIsPlaylistEditorOpen(true)
            }}
            onDeletePlaylist={handleDeletePlaylist}
            onReorderSongs={handleReorderSongs}
            onAddSongToPlaylist={handleAddSongToPlaylist}
            onRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
            onLaunchLive={handleLaunchLive}
            selectedSongId={selectedSongId}
            onSelectSong={setSelectedSongId}
            onApplySuggestionsToSongs={handleApplySuggestionsToSongs}
          />
        ) : (
          /* VUE RÉPERTOIRE GLOBAL */
          <>
            {/* Colonne Gauche : Liste des Morceaux & Filtres */}
            <div className="w-2/5 flex flex-col gap-3.5 h-[calc(100vh-140px)]">
              
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-amber-400" />
                  Catalogue Répertoire
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {songs.length} morceaux
                </span>
              </div>

              {/* Barre de Filtres Avancés & Tris */}
              <CatalogFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                availableKeys={availableKeys}
                totalSongs={songs.length}
                filteredCount={filteredSongs.length}
              />

              {/* Liste déroulante des morceaux */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                {filteredSongs.map((song) => {
                  const isSelected = song.id === (selectedSongId || currentSong?.id)
                  const hasRealTab = song.content && !song.content.includes("Paroles et accords à compléter")
                  return (
                    <div
                      key={song.id}
                      onClick={() => setSelectedSongId(song.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-amber-950/25 border-amber-500/50 shadow-md' 
                          : 'bg-[#0f1420] border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col gap-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm group-hover:text-amber-400 transition truncate">
                            {song.title}
                          </span>
                          {hasRealTab && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Tablature réelle Ultimate-Guitar" />
                          )}
                        </div>
                        <span className="text-xs text-slate-400 truncate">
                          {song.artist} • <span className="text-amber-400/90 font-mono">{song.key}</span>
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-200 border border-indigo-700/60 truncate max-w-[150px]">
                            {song.recommendedGuitar}
                          </span>
                          {song.capo > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-950/80 text-amber-200 border border-amber-700/60 font-semibold">
                              Capo {song.capo}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingSong(song)
                            setIsSongEditorOpen(true)
                          }}
                          className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 spectrum-focus-ring transition"
                          title="Modifier les accords ou infos"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSong(song.id, e)}
                          className="p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 spectrum-focus-ring transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLaunchLive(song.id)
                          }}
                          className="p-2.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold transition shadow-sm ml-1"
                          title="Jouer ce morceau en direct"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Colonne Droite : Fiche Technique & Prévisualisation du Morceau Sélectionné */}
            <div className="w-3/5 bg-[#0f1420] border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 h-[calc(100vh-140px)] overflow-hidden">
              {currentSong ? (
                <>
                  {/* En-tête Morceau */}
                  <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-white">{currentSong.title}</h3>
                        {(currentSong as any).tabUrl && (
                          <a 
                            href={(currentSong as any).tabUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-slate-500 hover:text-amber-400 transition"
                            title="Voir la source Ultimate-Guitar"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-400 font-medium">{currentSong.artist}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Menu rapide Ajouter à une Setlist */}
                      {playlists.length > 0 && (
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSongToPlaylist(e.target.value, currentSong.id)
                              alert(`Morceau ajouté à la setlist "${playlists.find(p => p.id === e.target.value)?.name}" !`)
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="">➕ Ajouter à Setlist...</option>
                          {playlists.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.songIds.includes(currentSong.id) ? '(Déjà inclus)' : ''}
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={() => {
                          setEditingSong(currentSong)
                          setIsSongEditorOpen(true)
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        Éditer
                      </button>

                      <button
                        onClick={() => handleLaunchLive(currentSong.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        SCÈNE LIVE
                      </button>
                    </div>
                  </div>

                  {/* Fiche Technique & Mémos Setup */}
                  <div className="grid grid-cols-2 gap-3 shrink-0">
                    <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 flex items-center gap-3">
                      <Guitar className="w-5 h-5 text-indigo-400" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Guitare Recommandée</span>
                        <span className="text-sm font-semibold text-slate-200">{currentSong.recommendedGuitar}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 flex items-center gap-3">
                      <Sliders className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Kemper Profiler</span>
                        <span className="text-sm font-semibold text-slate-200">{currentSong.kemperPreset}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 flex items-center gap-3">
                      <Layers className="w-5 h-5 text-pink-400" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Pedalboard / MC-8</span>
                        <span className="text-sm font-semibold text-slate-200">{currentSong.pedalPreset || 'MC-8 Clean Preset'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 flex items-center gap-3">
                      <KeyRound className="w-5 h-5 text-amber-400" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Capo & Tonalité</span>
                        <span className="text-sm font-semibold text-slate-200">
                          {currentSong.capo > 0 ? `Capo Frette ${currentSong.capo}` : 'Pas de Capo'} • {currentSong.key}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prévisualisation des Paroles & Accords */}
                  <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-hidden">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 shrink-0">
                      <FileText className="w-4 h-4 text-amber-400" />
                      Aperçu de la grille (Format Stage Noir)
                    </span>
                    
                    <div className="flex-1 bg-[#07090e] border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-tab text-sm leading-relaxed">
                      <pre className="text-slate-300 font-tab whitespace-pre-wrap select-text">
                        {decodeHtmlEntities(currentSong.content)}
                      </pre>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <Music2 className="w-12 h-12 mb-3 stroke-1" />
                  <p>Sélectionnez un morceau pour voir sa fiche technique</p>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* Modal d'édition morceau */}
      <SongEditorModal 
        isOpen={isSongEditorOpen}
        song={editingSong}
        onClose={() => setIsSongEditorOpen(false)}
        onSave={handleSaveSong}
      />

      {/* Modal d'édition playlist */}
      <PlaylistEditorModal
        isOpen={isPlaylistEditorOpen}
        playlist={editingPlaylist}
        onClose={() => setIsPlaylistEditorOpen(false)}
        onSave={handleSavePlaylist}
      />

    </div>
  )
}

export default App
