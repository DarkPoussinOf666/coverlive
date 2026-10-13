import React from 'react'
import { decodeHtmlEntities } from '../utils/textCleaner.ts'

interface ChordProViewerProps {
  content: string
  fontSizePx: number
}

// Regex validant un accord musical individuel (standard, altéré, suspendu, basse spécifique)
export const SINGLE_CHORD_REGEX =
  /^[A-G][b#]?(?:m|min|maj|M|dim|aug|sus|add)?[0-9]*(?:(?:b|#)[0-9]+)?(?:\/[A-G][b#]?)?$/

/**
 * Détecte si une ligne est entièrement ou quasi-exclusivement composée d'accords
 * (avec gestion des espaces d'alignement, séparateurs '|', slashs et annotations de répétition)
 */
export function isLineOfChords(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false

  const tokens = trimmed.split(/\s+/).filter((t) => t.length > 0)
  if (tokens.length === 0) return false

  const isChordToken = (t: string) => {
    const cleaned = t.replace(/^[\(\[\{]/, '').replace(/[\)\]\},:]$/, '')
    if (['|', '/', '||', '%', '-', 'N.C.', 'NC'].includes(cleaned.toUpperCase())) return true
    if (/^[0-9]+x$/i.test(cleaned) || /^x[0-9]+$/i.test(cleaned)) return true
    return SINGLE_CHORD_REGEX.test(cleaned)
  }

  const chordCount = tokens.filter(isChordToken).length
  return chordCount / tokens.length >= 0.75
}

/**
 * Détecte si la ligne est une section de tablature guitare (e|---...)
 */
export function isTablatureLine(line: string): boolean {
  const trimmed = line.trim()
  return /^[eEaAdDgGbB]\|[-0-9hpbr\/\\~x\s|]+/.test(trimmed)
}

/**
 * Détecte un en-tête de section diégétique ([Intro], [Chorus], [Couplet 1], etc.)
 */
export function isSectionHeader(line: string): boolean {
  const trimmed = line.trim()
  return (
    trimmed.startsWith('[') &&
    trimmed.endsWith(']') &&
    !trimmed.slice(1, -1).includes('[') &&
    trimmed.length > 2 &&
    !SINGLE_CHORD_REGEX.test(trimmed.slice(1, -1))
  )
}

/**
 * Détecte si une ligne utilise la syntaxe inline ChordPro ([Am]Paroles...)
 */
export function hasInlineChords(line: string): boolean {
  const trimmed = line.trim()
  if (isSectionHeader(trimmed)) return false
  return /\[[A-G][b#]?(?:m|min|maj|M|dim|aug|sus|add)?[0-9]*(?:(?:b|#)[0-9]+)?(?:\/[A-G][b#]?)?\]/.test(
    line
  )
}

interface InlineChordChunk {
  chord: string | null
  text: string
}

function parseInlineChordLine(line: string): InlineChordChunk[] {
  const chunks: InlineChordChunk[] = []
  const regex = /\[([A-G][b#]?(?:m|min|maj|M|dim|aug|sus|add)?[0-9]*(?:(?:b|#)[0-9]+)?(?:\/[A-G][b#]?)?)\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let currentChord: string | null = null

  while ((match = regex.exec(line)) !== null) {
    const textBefore = line.substring(lastIndex, match.index)
    if (textBefore || currentChord) {
      chunks.push({ chord: currentChord, text: textBefore })
    }
    currentChord = match[1]
    lastIndex = regex.lastIndex
  }

  const trailingText = line.substring(lastIndex)
  if (trailingText || currentChord) {
    chunks.push({ chord: currentChord, text: trailingText })
  }

  return chunks
}

export const ChordProViewer: React.FC<ChordProViewerProps> = ({ content, fontSizePx }) => {
  const cleanedContent = decodeHtmlEntities(content)
  const lines = cleanedContent.split('\n')

  // Analyse et groupement séquentiel des lignes
  const renderedElements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // 1. Ligne vide
    if (trimmed === '') {
      renderedElements.push(<div key={`empty-${i}`} className="h-4" />)
      i++
      continue
    }

    // 2. Balise de section [Couplet], [Refrain], [Intro]
    if (isSectionHeader(line)) {
      renderedElements.push(
        <div key={`section-${i}`} className="pt-8 pb-3">
          <span className="inline-block px-3.5 py-1 text-xs md:text-sm font-bold tracking-widest uppercase bg-sky-950/80 text-sky-200 border border-sky-600/60 rounded-lg shadow-sm">
            {trimmed.slice(1, -1)}
          </span>
        </div>
      )
      i++
      continue
    }

    // 3. Tablature guitare ASCII (chasse fixe stricte, préservation de tous les tirets)
    if (isTablatureLine(line)) {
      renderedElements.push(
        <div
          key={`tab-${i}`}
          className="font-mono whitespace-pre select-text text-sky-300/90 leading-tight py-0.5 tracking-normal"
          style={{ tabSize: 4 }}
        >
          {line}
        </div>
      )
      i++
      continue
    }

    // 4. Ligne avec accords inline ChordPro ([Am]Paroles...)
    if (hasInlineChords(line)) {
      const chunks = parseInlineChordLine(line)
      renderedElements.push(
        <div key={`inline-${i}`} className="py-1.5 flex flex-wrap items-end font-mono">
          {chunks.map((chunk, cIdx) => (
            <span key={cIdx} className="inline-flex flex-col items-start mr-0.5">
              <span
                className="font-mono font-bold text-xs md:text-sm leading-none pb-1 select-text"
                style={{ color: 'var(--spectrum-chord-color)' }}
              >
                {chunk.chord || '\u00A0'}
              </span>
              <span
                className="font-mono select-text whitespace-pre leading-relaxed"
                style={{ color: 'var(--spectrum-alias-text-color-default)' }}
              >
                {chunk.text}
              </span>
            </span>
          ))}
        </div>
      )
      i++
      continue
    }

    // 5. Ligne d'accords au-dessus des paroles (Format Ultimate Guitar standard)
    if (isLineOfChords(line)) {
      const nextLine = i + 1 < lines.length ? lines[i + 1] : null
      const nextTrimmed = nextLine ? nextLine.trim() : ''

      // Si la ligne suivante est du texte de chant (ni section, ni tablature, ni accords)
      const isNextLineLyrics =
        nextLine !== null &&
        nextTrimmed !== '' &&
        !isSectionHeader(nextLine) &&
        !isTablatureLine(nextLine) &&
        !isLineOfChords(nextLine)

      if (isNextLineLyrics) {
        // Bloc couplé : Ligne d'accords + Ligne de paroles (Alignement 1:1 garanti)
        renderedElements.push(
          <div key={`couplet-${i}`} className="my-1.5 flex flex-col">
            <div
              className="font-mono whitespace-pre select-text font-bold leading-none pb-1 tracking-normal"
              style={{ color: 'var(--spectrum-chord-color)', tabSize: 4 }}
            >
              {line}
            </div>
            <div
              className="font-mono whitespace-pre select-text font-normal leading-relaxed tracking-normal"
              style={{ color: 'var(--spectrum-alias-text-color-default)', tabSize: 4 }}
            >
              {nextLine}
            </div>
          </div>
        )
        i += 2 // Avancer de 2 car la ligne de paroles a été couplée
        continue
      } else {
        // Ligne d'accords seule (grille instrumentale, intro ou pont)
        renderedElements.push(
          <div
            key={`chord-solo-${i}`}
            className="my-1.5 font-mono whitespace-pre select-text font-bold leading-normal tracking-normal"
            style={{ color: 'var(--spectrum-chord-color)', tabSize: 4 }}
          >
            {line}
          </div>
        )
        i++
        continue
      }
    }

    // 6. Ligne de paroles seule
    renderedElements.push(
      <div
        key={`lyric-${i}`}
        className="font-mono whitespace-pre select-text font-normal leading-relaxed py-0.5 tracking-normal"
        style={{ color: 'var(--spectrum-alias-text-color-default)', tabSize: 4 }}
      >
        {line}
      </div>
    )
    i++
  }

  return (
    <div
      className="font-tab select-none tracking-normal transition-all overflow-x-auto"
      style={{
        fontSize: `${fontSizePx}px`,
        lineHeight: 1.6,
        tabSize: 4,
        fontFamily: 'var(--spectrum-global-font-family-mono)',
      }}
    >
      {renderedElements}
    </div>
  )
}
