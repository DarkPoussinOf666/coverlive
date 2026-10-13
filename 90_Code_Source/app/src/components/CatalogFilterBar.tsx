import React, { useState } from 'react'
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Guitar, 
  KeyRound, 
  Clock, 
  FileCheck2, 
  RotateCcw
} from 'lucide-react'

export interface FilterState {
  searchQuery: string
  guitar: string
  key: string
  capo: string // 'all', '0', '1', '2', '3', '4+'
  bpmRange: string // 'all', 'slow', 'medium', 'fast'
  tabStatus: string // 'all', 'complete', 'incomplete'
  sortBy: 'title' | 'artist' | 'tempo' | 'duration' | 'key'
  sortOrder: 'asc' | 'desc'
}

interface CatalogFilterBarProps {
  filters: FilterState
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  onReset: () => void
  availableKeys: string[]
  totalSongs: number
  filteredCount: number
}

export const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableKeys,
  totalSongs,
  filteredCount
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const hasActiveFilters = 
    Boolean(filters.searchQuery) ||
    filters.guitar !== 'all' ||
    filters.key !== 'all' ||
    filters.capo !== 'all' ||
    filters.bpmRange !== 'all' ||
    filters.tabStatus !== 'all' ||
    filters.sortBy !== 'title' ||
    filters.sortOrder !== 'asc'

  return (
    <div className="flex flex-col gap-2.5">
      {/* 1. Ligne Principale : Recherche + Quick Toggle Filtres Avancés + Tri */}
      <div className="flex items-center gap-2">
        {/* Champ de recherche */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher titre, artiste (RHCP, Nirvana, Cash...)"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-[#0f1420] border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 spectrum-focus-ring transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange('searchQuery', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bouton Toggle Filtres Avancés */}
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border spectrum-focus-ring transition ${
            isAdvancedOpen || (hasActiveFilters && filters.guitar !== 'all')
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/50'
              : 'bg-[#0f1420] text-slate-300 border-slate-700/80 hover:text-white hover:border-slate-600'
          }`}
          title="Afficher/Masquer les filtres musicaux avancés"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filtres</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          )}
        </button>

        {/* Sélecteur de Tri */}
        <div className="flex items-center gap-1 bg-[#0f1420] border border-slate-700/80 rounded-xl p-0.5">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value as FilterState['sortBy'])}
            className="bg-transparent text-slate-200 text-xs py-2 pl-2 pr-1 spectrum-focus-ring cursor-pointer"
          >
            <option value="title" className="bg-[#0f1420]">Titre</option>
            <option value="artist" className="bg-[#0f1420]">Artiste</option>
            <option value="tempo" className="bg-[#0f1420]">BPM / Tempo</option>
            <option value="duration" className="bg-[#0f1420]">Durée</option>
            <option value="key" className="bg-[#0f1420]">Tonalité</option>
          </select>

          {/* Toggle Ordre Ascendant / Descendant */}
          <button
            onClick={() => onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 text-slate-300 hover:text-amber-400 rounded-lg hover:bg-slate-800 spectrum-focus-ring transition"
            title={filters.sortOrder === 'asc' ? 'Ordre croissant (A-Z / 1-9)' : 'Ordre décroissant (Z-A / 9-1)'}
          >
            <ArrowUpDown className={`w-3.5 h-3.5 transition ${filters.sortOrder === 'desc' ? 'rotate-180 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Tiroir des Filtres Musicaux Avancés */}
      {isAdvancedOpen && (
        <div className="p-3.5 rounded-xl bg-[#0b0e17] border border-slate-800 flex flex-col gap-3 text-xs animate-in fade-in duration-150">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            
            {/* Filtre Guitare */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Guitar className="w-3 h-3 text-indigo-400" />
                Guitare
              </label>
              <select
                value={filters.guitar}
                onChange={(e) => onFilterChange('guitar', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#0f1420] border border-slate-700/80 rounded-lg text-slate-100 spectrum-focus-ring"
              >
                <option value="all">Toutes ({totalSongs})</option>
                <option value="Lag Primavera">Lag Primavera (Acoustique)</option>
                <option value="Fender Jaguar">Fender Jaguar (Grunge)</option>
                <option value="Duesenberg Paloma">Duesenberg Paloma (Polyvalente)</option>
                <option value="Fender Telecaster Baja">Fender Telecaster Baja (Twang)</option>
                <option value="Lag Roxanne">Lag Roxanne (Rock/Lead)</option>
              </select>
            </div>

            {/* Filtre Tonalité (Key) */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-amber-400" />
                Tonalité
              </label>
              <select
                value={filters.key}
                onChange={(e) => onFilterChange('key', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#0f1420] border border-slate-700/80 rounded-lg text-slate-100 spectrum-focus-ring"
              >
                <option value="all">Toutes tonalités</option>
                {availableKeys.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Filtre Capodastre */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[9px]">C</span>
                Capodastre
              </label>
              <select
                value={filters.capo}
                onChange={(e) => onFilterChange('capo', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#0f1420] border border-slate-700/80 rounded-lg text-slate-100 spectrum-focus-ring"
              >
                <option value="all">Tous les capos</option>
                <option value="0">Sans capo (Standard)</option>
                <option value="1">Capo 1</option>
                <option value="2">Capo 2</option>
                <option value="3">Capo 3</option>
                <option value="4+">Capo 4 et plus</option>
              </select>
            </div>

            {/* Filtre Tranches de BPM */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                Tempo / BPM
              </label>
              <select
                value={filters.bpmRange}
                onChange={(e) => onFilterChange('bpmRange', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#0f1420] border border-slate-700/80 rounded-lg text-slate-100 spectrum-focus-ring"
              >
                <option value="all">Tous tempos</option>
                <option value="slow">Ballades (&lt; 80 BPM)</option>
                <option value="medium">Modéré (80 - 120 BPM)</option>
                <option value="fast">Rythmé (&gt; 120 BPM)</option>
              </select>
            </div>

            {/* Filtre Statut de la Grille */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <FileCheck2 className="w-3 h-3 text-cyan-400" />
                Statut Grille
              </label>
              <select
                value={filters.tabStatus}
                onChange={(e) => onFilterChange('tabStatus', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#0f1420] border border-slate-700/80 rounded-lg text-slate-100 spectrum-focus-ring"
              >
                <option value="all">Tous statuts</option>
                <option value="complete">Tabs complètes Ultimate-Guitar</option>
                <option value="incomplete">Paroles seules / À compléter</option>
              </select>
            </div>

            {/* Bouton Réinitialisation */}
            <div className="flex flex-col justify-end">
              <button
                onClick={onReset}
                disabled={!hasActiveFilters}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                Réinitialiser
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. Compteur & Badges d'état */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-0.5">
        <span>
          Affichage : <strong className="text-amber-400">{filteredCount}</strong> / {totalSongs} morceaux
        </span>
        {hasActiveFilters && (
          <span className="text-amber-400/90 font-sans font-semibold">
            Filtres actifs
          </span>
        )}
      </div>
    </div>
  )
}
