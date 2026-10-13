import React, { useState } from 'react'
import type { Song, Playlist } from '../types/song'
import { PedalboardAdvisorView } from './PedalboardAdvisorView'
import { 
  Play, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronUp, 
  ChevronDown, 
  Guitar, 
  Clock, 
  Music2, 
  Search, 
  AlertTriangle,
  Radio,
  Sliders,
  ListMusic
} from 'lucide-react'

interface PlaylistsViewProps {
  playlists: Playlist[]
  songs: Song[]
  activePlaylistId: string | null
  onSelectPlaylist: (id: string) => void
  onCreatePlaylist: () => void
  onEditPlaylist: (playlist: Playlist) => void
  onDeletePlaylist: (id: string) => void
  onReorderSongs: (playlistId: string, songIds: string[]) => void
  onAddSongToPlaylist: (playlistId: string, songId: string) => void
  onRemoveSongFromPlaylist: (playlistId: string, songId: string) => void
  onLaunchLive: (songId: string, playlist?: Playlist) => void
  selectedSongId: string | null
  onSelectSong: (id: string) => void
  onApplySuggestionsToSongs?: (updatedSongs: Song[]) => void
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  songs,
  activePlaylistId,
  onSelectPlaylist,
  onCreatePlaylist,
  onEditPlaylist,
  onDeletePlaylist,
  onReorderSongs,
  onAddSongToPlaylist,
  onRemoveSongFromPlaylist,
  onLaunchLive,
  selectedSongId,
  onSelectSong,
  onApplySuggestionsToSongs
}) => {
  const [songSearchQuery, setSongSearchQuery] = useState('')
  const [isAddPickerOpen, setIsAddPickerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'order' | 'pedalboard'>('order')

  const activePlaylist = playlists.find(p => p.id === activePlaylistId) || playlists[0] || null

  // Chansons de la playlist active dans l'ordre exact
  const playlistSongs: Song[] = activePlaylist 
    ? activePlaylist.songIds
        .map(id => songs.find(s => s.id === id))
        .filter((s): s is Song => Boolean(s))
    : []

  // Durée totale estimée en minutes
  const totalDurationMinutes = Math.round(
    playlistSongs.reduce((acc, s) => acc + (s.estimatedDurationSec || 210), 0) / 60
  )

  // Statistiques des guitares requises
  const guitarCounts = playlistSongs.reduce((acc, song) => {
    acc[song.recommendedGuitar] = (acc[song.recommendedGuitar] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Chansons disponibles à ajouter (filtrées par recherche et pas déjà dans la playlist)
  const availableSongsToAdd = songs.filter(s => {
    const isAlreadyIn = activePlaylist?.songIds.includes(s.id)
    const matchesSearch = s.title.toLowerCase().includes(songSearchQuery.toLowerCase()) || 
                          s.artist.toLowerCase().includes(songSearchQuery.toLowerCase())
    return !isAlreadyIn && matchesSearch
  })

  // Déplacer un morceau vers le haut
  const handleMoveUp = (index: number) => {
    if (!activePlaylist || index === 0) return
    const newSongIds = [...activePlaylist.songIds]
    const temp = newSongIds[index - 1]
    newSongIds[index - 1] = newSongIds[index]
    newSongIds[index] = temp
    onReorderSongs(activePlaylist.id, newSongIds)
  }

  // Déplacer un morceau vers le bas
  const handleMoveDown = (index: number) => {
    if (!activePlaylist || index === activePlaylist.songIds.length - 1) return
    const newSongIds = [...activePlaylist.songIds]
    const temp = newSongIds[index + 1]
    newSongIds[index + 1] = newSongIds[index]
    newSongIds[index] = temp
    onReorderSongs(activePlaylist.id, newSongIds)
  }

  return (
    <div className="flex-1 flex gap-8 h-[calc(100vh-140px)] overflow-hidden">
      
      {/* 1. Colonne Gauche : Liste des Setlists & Création */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Mes Setlists Live ({playlists.length})
          </h2>
          <button
            onClick={onCreatePlaylist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Setlist
          </button>
        </div>

        {/* Liste des cartes Setlists */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {playlists.map((pl) => {
            const isSelected = activePlaylist?.id === pl.id
            const count = pl.songIds.length
            return (
              <div
                key={pl.id}
                onClick={() => onSelectPlaylist(pl.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col gap-2 group relative overflow-hidden ${
                  isSelected 
                    ? 'bg-[#131b2e] border-amber-500/60 shadow-lg' 
                    : 'bg-[#0f1420] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Bande latérale colorée */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5" 
                  style={{ backgroundColor: pl.color || '#f59e0b' }} 
                />

                <div className="flex items-start justify-between pl-2">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-white text-base truncate group-hover:text-amber-400 transition">
                      {pl.name}
                    </h4>
                    {pl.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {pl.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditPlaylist(pl)
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                      title="Modifier nom/couleur"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {playlists.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeletePlaylist(pl.id)
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                        title="Supprimer la setlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-2 text-xs text-slate-400 font-mono mt-1">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Music2 className="w-3.5 h-3.5 text-amber-400" />
                    {count} morceau{count > 1 ? 'x' : ''}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    ~{Math.round(count * 3.5)} min
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Colonne Centrale / Droite : Détail & Ordre de la Setlist Active */}
      <div className="flex-1 bg-[#0f1420] border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 overflow-hidden">
        {activePlaylist ? (
          <>
            {/* Header de la Setlist Active */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3.5 h-3.5 rounded-full shrink-0" 
                    style={{ backgroundColor: activePlaylist.color || '#f59e0b' }} 
                  />
                  <h3 className="text-2xl font-black text-white truncate">
                    {activePlaylist.name}
                  </h3>
                </div>
                {activePlaylist.description && (
                  <p className="text-sm text-slate-400 mt-1 pl-6">
                    {activePlaylist.description}
                  </p>
                )}
              </div>

              {/* Bouton Lancement Live Setlist */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  disabled={playlistSongs.length === 0}
                  onClick={() => onLaunchLive(playlistSongs[0].id, activePlaylist)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-black shadow-lg shadow-amber-500/20 transition active:scale-95"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  DÉMARRER LE LIVE ({playlistSongs.length})
                </button>
              </div>
            </div>

            {/* Mémos et Stats de la Setlist */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 flex items-center gap-3">
                <Music2 className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Morceaux</span>
                  <span className="text-sm font-semibold text-slate-200">{playlistSongs.length} au total</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Durée Estimée</span>
                  <span className="text-sm font-semibold text-slate-200">~{totalDurationMinutes} minutes</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 flex items-center gap-3">
                <Guitar className="w-5 h-5 text-indigo-400" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Guitares Requis</span>
                  <span className="text-xs font-semibold text-slate-300 truncate block">
                    {Object.entries(guitarCounts).map(([g, c]) => `${c}x ${g.split(' ')[0]}`).join(', ') || 'Aucune'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sélecteur de mode : Ordre de Passage vs Diagnostic Pedalboard */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 shrink-0">
              <button
                onClick={() => setViewMode('order')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'order'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white bg-[#07090e] border border-slate-800'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                Ordre de Passage ({playlistSongs.length})
              </button>

              <button
                onClick={() => setViewMode('pedalboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'pedalboard'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white bg-[#07090e] border border-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Diagnostic & Suggestion Pedalboard
              </button>
            </div>

            {viewMode === 'pedalboard' ? (
              <PedalboardAdvisorView
                playlist={activePlaylist}
                songs={songs}
                onApplySuggestionsToSongs={onApplySuggestionsToSongs}
              />
            ) : (
              /* Section Morceaux de la Setlist (Ordre de passage) */
              <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ordre de passage en live
                  </span>

                  <button
                    onClick={() => setIsAddPickerOpen(!isAddPickerOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    {isAddPickerOpen ? 'Fermer la sélection' : 'Ajouter des morceaux'}
                  </button>
                </div>

                {/* Tiroir d'ajout de morceaux depuis le catalogue */}
                {isAddPickerOpen && (
                  <div className="p-4 rounded-xl bg-[#07090e] border border-slate-800 shrink-0 flex flex-col gap-3 max-h-56">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Chercher parmi tout le répertoire (titre, artiste)..."
                        value={songSearchQuery}
                        onChange={(e) => setSongSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-[#0f1420] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="overflow-y-auto flex flex-col gap-1.5 pr-1">
                      {availableSongsToAdd.slice(0, 15).map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#0f1420] hover:bg-slate-800/60 border border-slate-800/80 text-xs"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-white">{s.title}</span>
                            <span className="text-slate-400 ml-1.5">— {s.artist}</span>
                            <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300">
                              {s.recommendedGuitar}
                            </span>
                          </div>
                          <button
                            onClick={() => onAddSongToPlaylist(activePlaylist.id, s.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition"
                          >
                            <Plus className="w-3 h-3" />
                            Ajouter
                          </button>
                        </div>
                      ))}
                      {availableSongsToAdd.length === 0 && (
                        <p className="text-center text-xs text-slate-500 py-2">
                          Aucun morceau trouvé ou tous sont déjà dans la setlist.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Liste ordonnée de la setlist */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                  {playlistSongs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 border border-dashed border-slate-800 rounded-xl">
                      <Music2 className="w-10 h-10 mb-2 stroke-1" />
                      <p className="text-sm font-medium">Cette setlist est vide.</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Cliquez sur "Ajouter des morceaux" ci-dessus pour composer votre concert.
                      </p>
                    </div>
                  ) : (
                    playlistSongs.map((song, idx) => {
                      const isSelected = song.id === selectedSongId
                      const prevSong = idx > 0 ? playlistSongs[idx - 1] : null
                      const guitarChanged = prevSong && prevSong.recommendedGuitar !== song.recommendedGuitar

                      return (
                        <div key={song.id} className="flex flex-col gap-1">
                          {/* Indicateur de changement de guitare entre deux morceaux */}
                          {guitarChanged && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 font-medium my-0.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>
                                Pause transition : Poser la {prevSong.recommendedGuitar.split(' ')[0]} → Prendre la <strong>{song.recommendedGuitar}</strong>
                              </span>
                            </div>
                          )}

                          <div
                            onClick={() => onSelectSong(song.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition group ${
                              isSelected 
                                ? 'bg-amber-950/30 border-amber-500/60 shadow-md' 
                                : 'bg-[#07090e] border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            {/* Numéro & Infos */}
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                                {idx + 1}
                              </span>
                              <div className="truncate">
                                <h5 className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition">
                                  {song.title}
                                </h5>
                                <p className="text-xs text-slate-400 truncate">
                                  {song.artist} • <span className="text-amber-400 font-mono">{song.key}</span>
                                  {song.capo > 0 && ` • Capo ${song.capo}`}
                                </p>
                              </div>
                            </div>

                            {/* Badges & Actions ordonnancement */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/40 hidden md:inline">
                                {song.recommendedGuitar}
                              </span>

                              {/* Monter / Descendre */}
                              <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5">
                                <button
                                  disabled={idx === 0}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMoveUp(idx)
                                  }}
                                  className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition"
                                  title="Monter dans la setlist"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  disabled={idx === playlistSongs.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMoveDown(idx)
                                  }}
                                  className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition"
                                  title="Descendre dans la setlist"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Retirer de la setlist */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onRemoveSongFromPlaylist(activePlaylist.id, song.id)
                                }}
                                className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                                title="Retirer de la setlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Bouton Play Scène direct */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onLaunchLive(song.id, activePlaylist)
                                }}
                                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition ml-1"
                                title="Démarrer le live à partir de ce morceau"
                              >
                                <Play className="w-3 h-3 fill-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Music2 className="w-12 h-12 mb-3 stroke-1" />
            <p>Sélectionnez ou créez une setlist pour l'organiser</p>
          </div>
        )}
      </div>

    </div>
  )
}
