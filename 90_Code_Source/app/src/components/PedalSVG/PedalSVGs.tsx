import React from 'react'

export interface PedalSVGProps {
  isActive: boolean
  isHovered?: boolean
  onClick?: () => void
  statusText?: string
}

/**
 * DigiTech Whammy 5
 * Châssis rouge vif, large pédale d'expression basculante à texture diamantée,
 * rotacteur de sélection des intervalles avec LEDs rouges, footswitch True Bypass.
 */
export const Whammy5SVG: React.FC<PedalSVGProps> = ({ isActive }) => {
  return (
    <svg viewBox="0 0 140 210" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="whammyBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="60%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="treadPlate" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="ledRedGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f87171" stopOpacity="1" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ombre portée */}
      <rect x="6" y="8" width="128" height="194" rx="10" fill="#000" opacity="0.6" filter="blur(4px)" />

      {/* Châssis principal */}
      <rect x="5" y="5" width="130" height="200" rx="10" fill="url(#whammyBody)" stroke="#991b1b" strokeWidth="2" />
      <rect x="9" y="9" width="122" height="192" rx="8" fill="none" stroke="#fca5a5" strokeWidth="0.8" opacity="0.3" />

      {/* Sélecteur rotatif & graduations en haut à gauche */}
      <circle cx="36" cy="40" r="20" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
      <circle cx="36" cy="40" r="14" fill="#27272a" />
      {/* Index du rotateur */}
      <line x1="36" y1="40" x2="46" y2="30" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />

      {/* LEDs de modes autour du rotateur */}
      {[-45, -20, 0, 20, 45, 90, 135, 180, 225].map((ang, i) => {
        const rad = (ang * Math.PI) / 180
        const lx = 36 + Math.cos(rad) * 23
        const ly = 40 + Math.sin(rad) * 23
        const lit = isActive && i === 2
        return (
          <circle
            key={i}
            cx={lx}
            cy={ly}
            r={lit ? 2.5 : 1.5}
            fill={lit ? '#ef4444' : '#52525b'}
            stroke={lit ? '#fee2e2' : 'none'}
            strokeWidth={0.5}
          />
        )
      })}

      {/* Badge Marque */}
      <text x="80" y="32" fill="#fff" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        Whammy
      </text>
      <text x="80" y="44" fill="#fca5a5" fontSize="7" fontWeight="bold" fontFamily="monospace">
        DigiTech V5
      </text>

      {/* Toggle Classic / Chords */}
      <rect x="78" y="52" width="22" height="9" rx="3" fill="#09090b" stroke="#3f3f46" strokeWidth="0.8" />
      <circle cx="84" cy="56.5" r="2.5" fill="#e2e8f0" />
      <text x="104" y="59" fill="#94a3b8" fontSize="5.5" fontFamily="monospace">CHORDS</text>

      {/* Large Pédale de bascule (Treadle) */}
      <rect x="18" y="70" width="104" height="96" rx="6" fill="url(#treadPlate)" stroke="#334155" strokeWidth="1.5" />
      
      {/* Stries antidérapantes diamantées */}
      {[-24, -12, 0, 12, 24].map((offset, idx) => (
        <line
          key={idx}
          x1={24 + offset + 20}
          y1="76"
          x2={24 + offset + 60}
          y2="158"
          stroke="#0f172a"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
      <rect x="36" y="105" width="68" height="26" rx="4" fill="#09090b" opacity="0.9" stroke="#1e293b" />
      <text x="70" y="122" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        EXPRESSION
      </text>

      {/* LED d'état principale */}
      <circle cx="35" cy="184" r="5" fill={isActive ? '#ef4444' : '#3f3f46'} stroke="#7f1d1d" strokeWidth="1" />
      {isActive && (
        <circle cx="35" cy="184" r="10" fill="url(#ledRedGlow)" opacity="0.75" />
      )}

      {/* Footswitch mécanique */}
      <circle cx="70" cy="184" r="12" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="70" cy="184" r="8" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <circle cx="70" cy="184" r="4" fill="#64748b" />

      {/* Repères Jack */}
      <rect x="1" y="90" width="3" height="14" rx="1.5" fill="#475569" />
      <rect x="136" y="90" width="3" height="14" rx="1.5" fill="#475569" />
    </svg>
  )
}

/**
 * EHX Synth9
 * Châssis blanc aluminium, bandeau violet/bleu, 4 potentiomètres blancs et footswitch chromé.
 */
export const Synth9SVG: React.FC<PedalSVGProps> = ({ isActive }) => {
  return (
    <svg viewBox="0 0 105 165" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="synth9Body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Ombre */}
      <rect x="5" y="6" width="95" height="153" rx="8" fill="#000" opacity="0.5" filter="blur(3px)" />

      {/* Châssis */}
      <rect x="4" y="4" width="97" height="157" rx="8" fill="url(#synth9Body)" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Bandeau sérigraphie Violet/Bleu EHX */}
      <rect x="4" y="24" width="97" height="38" fill="#7c3aed" />
      <rect x="4" y="24" width="97" height="6" fill="#0284c7" />

      <text x="52" y="45" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        SYNTH 9
      </text>
      <text x="52" y="55" fill="#c4b5fd" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        ELECTRO-HARMONIX
      </text>

      {/* 4 Potentiomètres (Dry, Synth, Ctrl 1, Ctrl 2) */}
      {[
        { cx: 25, cy: 76, label: 'DRY' },
        { cx: 52, cy: 76, label: 'SYNTH' },
        { cx: 80, cy: 76, label: 'CTRL 1' },
        { cx: 52, cy: 104, label: 'PRESET' }
      ].map((k, i) => (
        <g key={i}>
          <circle cx={k.cx} cy={k.cy} r="9" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <circle cx={k.cx} cy={k.cy} r="6" fill="#0f172a" />
          <line x1={k.cx} y1={k.cy} x2={k.cx} y2={k.cy - 7} stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          <text x={k.cx} y={k.cy + 13} fill="#64748b" fontSize="4.5" fontWeight="bold" textAnchor="middle">
            {k.label}
          </text>
        </g>
      ))}

      {/* LED d'activation */}
      <circle cx="52" cy="122" r="3.5" fill={isActive ? '#a855f7' : '#475569'} stroke="#3b0764" strokeWidth="0.8" />
      {isActive && (
        <circle cx="52" cy="122" r="7" fill="#c084fc" opacity="0.6" />
      )}

      {/* Footswitch */}
      <circle cx="52" cy="142" r="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
      <circle cx="52" cy="142" r="6" fill="#94a3b8" />
    </svg>
  )
}

/**
 * ZVex Fuzz Factory
 * Boîtier aluminium brut horizontal (130x120), illustration hand-painted, 5 mini-potentiomètres en rangée.
 */
export const FuzzFactorySVG: React.FC<PedalSVGProps> = ({ isActive }) => {
  return (
    <svg viewBox="0 0 130 120" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Ombre */}
      <rect x="5" y="6" width="120" height="108" rx="6" fill="#000" opacity="0.5" filter="blur(3px)" />

      {/* Boîtier Chrome / Alu Poli */}
      <rect x="4" y="4" width="122" height="112" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      
      {/* Motif fantaisie ZVex */}
      <path d="M 12 25 Q 35 15 65 25 T 118 20" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.7" />
      <path d="M 12 30 Q 40 40 70 30 T 118 35" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6" />

      <text x="65" y="24" fill="#0f172a" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        FUZZ FACTORY
      </text>
      <text x="65" y="32" fill="#475569" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        ZVEX EFFECTS • GERMANIUM
      </text>

      {/* 5 Boutons Potars alignés (Vol, Gate, Comp, Drive, Stab) */}
      {[
        { cx: 20, cy: 50, label: 'VOL' },
        { cx: 42, cy: 50, label: 'GATE' },
        { cx: 65, cy: 50, label: 'COMP' },
        { cx: 88, cy: 50, label: 'DRIVE' },
        { cx: 110, cy: 50, label: 'STAB' }
      ].map((p, idx) => (
        <g key={idx}>
          <circle cx={p.cx} cy={p.cy} r="7" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <circle cx={p.cx} cy={p.cy} r="4" fill="#1e293b" />
          <line x1={p.cx} y1={p.cy} x2={p.cx} y2={p.cy - 5.5} stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
          <text x={p.cx} y={p.cy + 12} fill="#334155" fontSize="4.5" fontWeight="bold" textAnchor="middle">
            {p.label}
          </text>
        </g>
      ))}

      {/* LED d'activation */}
      <circle cx="35" cy="85" r="3.5" fill={isActive ? '#10b981' : '#475569'} stroke="#064e3b" strokeWidth="0.8" />
      {isActive && (
        <circle cx="35" cy="85" r="7" fill="#34d399" opacity="0.6" />
      )}

      {/* Footswitch */}
      <circle cx="65" cy="88" r="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
      <circle cx="65" cy="88" r="6" fill="#94a3b8" />
    </svg>
  )
}

/**
 * Boss Pedal Générique Réutilisable (DS-1 Orange, FZ Rose/Noir, Flanger Violet)
 * Boîtier iconique Boss avec compartiment batterie caoutchouc noir et pédalier articulé.
 */
export const BossStandardPedalSVG: React.FC<PedalSVGProps & {
  model: 'DS-1' | 'FZ' | 'BF-3' | 'SOUL FOOD'
  title: string
  subtitle: string
  mainColor: string
  knobCount: 3 | 4
  ledColor: string
}> = ({ isActive, model, title, subtitle, mainColor, knobCount, ledColor }) => {
  return (
    <svg viewBox="0 0 100 160" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Ombre */}
      <rect x="5" y="6" width="90" height="148" rx="8" fill="#000" opacity="0.5" filter="blur(3px)" />

      {/* Châssis métallique principal */}
      <rect x="4" y="4" width="92" height="152" rx="7" fill={mainColor} stroke="#1e293b" strokeWidth="1.5" />

      {/* Plaque supérieure des potentiomètres (foncée) */}
      <rect x="9" y="9" width="82" height="48" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1" />

      {/* LED Check */}
      <circle cx="50" cy="17" r="3" fill={isActive ? ledColor : '#3f3f46'} stroke="#18181b" strokeWidth="0.8" />
      {isActive && (
        <circle cx="50" cy="17" r="6" fill={ledColor} opacity="0.6" />
      )}
      <text x="50" y="24" fill="#71717a" fontSize="3.5" fontWeight="bold" textAnchor="middle">CHECK</text>

      {/* Potentiomètres */}
      {knobCount === 3 ? (
        <>
          <g>
            <circle cx="26" cy="38" r="7.5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <line x1="26" y1="38" x2="26" y2="32" stroke="#e4e4e7" strokeWidth="1.5" strokeLinecap="round" />
            <text x="26" y="52" fill="#a1a1aa" fontSize="4" textAnchor="middle">TONE</text>
          </g>
          <g>
            <circle cx="50" cy="38" r="7.5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <line x1="50" y1="38" x2="50" y2="32" stroke="#e4e4e7" strokeWidth="1.5" strokeLinecap="round" />
            <text x="50" y="52" fill="#a1a1aa" fontSize="4" textAnchor="middle">LEVEL</text>
          </g>
          <g>
            <circle cx="74" cy="38" r="7.5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <line x1="74" y1="38" x2="74" y2="32" stroke="#e4e4e7" strokeWidth="1.5" strokeLinecap="round" />
            <text x="74" y="52" fill="#a1a1aa" fontSize="4" textAnchor="middle">DIST</text>
          </g>
        </>
      ) : (
        <>
          {[20, 40, 60, 80].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy="38" r="6.5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
              <line x1={cx} y1={38} x2={cx} y2={33} stroke="#e4e4e7" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}
        </>
      )}

      {/* Titre & Modèle sur le milieu */}
      <rect x="9" y="60" width="82" height="24" rx="2" fill="#000" opacity="0.15" />
      <text x="50" y="72" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        {model}
      </text>
      <text x="50" y="80" fill="#e2e8f0" fontSize="5.5" fontWeight="bold" textAnchor="middle">
        {title}
      </text>

      {/* Pédalier mécanique articulé Boss avec semelle noire */}
      <rect x="9" y="88" width="82" height="62" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="1" />
      <rect x="15" y="93" width="70" height="42" rx="3" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
      
      {/* Logo BOSS estampillé en bas */}
      <text x="50" y="145" fill="#ffffff" fontSize="9" fontWeight="900" letterSpacing="1.5" textAnchor="middle" fontFamily="sans-serif">
        BOSS
      </text>
      <text x="50" y="122" fill="#52525b" fontSize="5" fontWeight="bold" textAnchor="middle">
        {subtitle}
      </text>
    </svg>
  )
}

/**
 * Boss OD-200 Hybrid Multi-Drive
 * Boîtier métallique large à double footswitch, écran LCD segmenté, 6 potentiomètres et voyants LEDs.
 */
export const BossOD200SVG: React.FC<PedalSVGProps> = ({ isActive }) => {
  return (
    <svg viewBox="0 0 145 170" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Ombre */}
      <rect x="6" y="7" width="133" height="156" rx="8" fill="#000" opacity="0.6" filter="blur(3px)" />

      {/* Châssis métallique gris anthracite / or */}
      <rect x="5" y="5" width="135" height="160" rx="8" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
      <rect x="8" y="8" width="129" height="154" rx="6" fill="none" stroke="#ca8a04" strokeWidth="0.8" opacity="0.5" />

      {/* Écran Digital LED Segment 3 digits */}
      <rect x="15" y="14" width="46" height="22" rx="3" fill="#000" stroke="#292524" strokeWidth="1" />
      <text x="38" y="30" fill={isActive ? '#eab308' : '#713f12'} fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
        CRN
      </text>

      {/* Badge Modèle OD-200 */}
      <text x="75" y="24" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">
        OD-200
      </text>
      <text x="75" y="33" fill="#ca8a04" fontSize="6" fontWeight="bold" fontFamily="monospace">
        HYBRID DRIVE • MIDI
      </text>

      {/* Potentiomètres (Param, Drive, Level, Low, Mid, High) */}
      {[
        { cx: 24, cy: 52, label: 'PARAM' },
        { cx: 48, cy: 52, label: 'DRIVE' },
        { cx: 72, cy: 52, label: 'LEVEL' },
        { cx: 96, cy: 52, label: 'LOW' },
        { cx: 120, cy: 52, label: 'MID/HIGH' }
      ].map((k, i) => (
        <g key={i}>
          <circle cx={k.cx} cy={k.cy} r="7.5" fill="#0c0a09" stroke="#57534e" strokeWidth="1" />
          <line x1={k.cx} y1={k.cy} x2={k.cx} y2={k.cy - 6} stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
          <text x={k.cx} y={k.cy + 12} fill="#a8a29e" fontSize="3.8" textAnchor="middle">{k.label}</text>
        </g>
      ))}

      {/* Ligne médiane / séparation */}
      <line x1="12" y1="74" x2="133" y2="74" stroke="#292524" strokeWidth="1" />

      {/* Boutons poussoirs Memory & Menus */}
      <rect x="20" y="82" width="28" height="12" rx="2" fill="#292524" stroke="#44403c" strokeWidth="0.8" />
      <text x="34" y="90.5" fill="#facc15" fontSize="5.5" fontWeight="bold" textAnchor="middle">MEMORY</text>

      {/* 2 Larges Footswitches métalliques avec anneaux LED (ON/OFF et MEMORY/BOOST) */}
      {/* Switch 1: Bypass/On */}
      <g>
        <circle cx="40" cy="132" r="14" fill="#44403c" stroke="#78716c" strokeWidth="1.5" />
        <circle cx="40" cy="132" r="9" fill="#1c1917" />
        <circle cx="40" cy="108" r="3.5" fill={isActive ? '#eab308' : '#44403c'} />
        {isActive && <circle cx="40" cy="108" r="7" fill="#facc15" opacity="0.6" />}
        <text x="40" y="156" fill="#e7e5e4" fontSize="7" fontWeight="bold" textAnchor="middle">ON/OFF</text>
      </g>

      {/* Switch 2: Memory/Boost */}
      <g>
        <circle cx="105" cy="132" r="14" fill="#44403c" stroke="#78716c" strokeWidth="1.5" />
        <circle cx="105" cy="132" r="9" fill="#1c1917" />
        <circle cx="105" cy="108" r="3.5" fill={isActive ? '#22c55e' : '#44403c'} />
        <text x="105" y="156" fill="#e7e5e4" fontSize="7" fontWeight="bold" textAnchor="middle">MEMORY</text>
      </g>
    </svg>
  )
}

/**
 * Eventide H9 (Space, TimeFactor Delay, ModFactor Pitch)
 * Boîtier emblématique blanc perle, grand encodeur rotatif central avec couronne de LEDs bleues,
 * écran OLED matriciel et 2 footswitches sans clic.
 */
export const EventideH9SVG: React.FC<PedalSVGProps & {
  modelNumber: 1 | 2 | 3
  algorithmFamily: 'SPACE REVERB' | 'TIMFACTOR DELAY' | 'MOD & PITCH'
  accentColor: string
}> = ({ isActive, modelNumber, algorithmFamily, accentColor }) => {
  return (
    <svg viewBox="0 0 130 170" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`h9Halo-${modelNumber}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ombre */}
      <rect x="5" y="6" width="120" height="158" rx="10" fill="#000" opacity="0.6" filter="blur(3px)" />

      {/* Châssis blanc perle glacé */}
      <rect x="4" y="4" width="122" height="162" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Écran matriciel noir en haut */}
      <rect x="16" y="14" width="98" height="24" rx="4" fill="#09090b" stroke="#1e293b" strokeWidth="1" />
      <text x="65" y="27" fill={isActive ? accentColor : '#475569'} fontSize="9" fontWeight="900" fontFamily="monospace" textAnchor="middle">
        {isActive ? `H9 #${modelNumber} ON` : `BYPASS`}
      </text>
      <text x="65" y="34" fill="#94a3b8" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
        {algorithmFamily}
      </text>

      {/* Grand Encodeur Rotatif Central (Jog Wheel Eventide) */}
      <circle cx="65" cy="80" r="28" fill="#18181b" stroke="#334155" strokeWidth="1.5" />
      <circle cx="65" cy="80" r="21" fill="#0f172a" />
      <circle cx="65" cy="80" r="14" fill="#1e293b" />
      <circle cx="65" cy="65" r="2.5" fill="#f8fafc" />

      {/* Anneau de LEDs d'expression autour du jog wheel */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, idx) => {
        const rad = (deg * Math.PI) / 180
        const lx = 65 + Math.cos(rad) * 25
        const ly = 80 + Math.sin(rad) * 25
        const isLedLit = isActive && idx < 8
        return (
          <circle
            key={idx}
            cx={lx}
            cy={ly}
            r={isLedLit ? 1.8 : 1.2}
            fill={isLedLit ? accentColor : '#334155'}
          />
        )
      })}

      {/* Boutons X Y Z Presets */}
      <circle cx="28" cy="80" r="4.5" fill="#334155" />
      <circle cx="102" cy="80" r="4.5" fill="#334155" />

      {/* Indicateur d'état actif */}
      {isActive && (
        <circle cx="65" cy="80" r="32" fill={`url(#h9Halo-${modelNumber})`} opacity="0.3" pointerEvents="none" />
      )}

      {/* 2 Footswitches tactiles silencieux */}
      <g>
        <circle cx="34" cy="136" r="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
        <circle cx="34" cy="136" r="6" fill="#94a3b8" />
        <circle cx="34" cy="120" r="3" fill={isActive ? accentColor : '#94a3b8'} />
        <text x="34" y="154" fill="#64748b" fontSize="6" fontWeight="bold" textAnchor="middle">ACTIVE</text>
      </g>

      <g>
        <circle cx="96" cy="136" r="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
        <circle cx="96" cy="136" r="6" fill="#94a3b8" />
        <circle cx="96" cy="120" r="3" fill="#64748b" />
        <text x="96" y="154" fill="#64748b" fontSize="6" fontWeight="bold" textAnchor="middle">TAP / PRESET</text>
      </g>
    </svg>
  )
}

/**
 * EHX Stereo Memory Man
 * Boîtier grand format vintage en métal plié, sérigraphie turquoise/bleue, 5 potards et commutateur de Chorus/Vibrato.
 */
export const MemoryManSVG: React.FC<PedalSVGProps> = ({ isActive }) => {
  return (
    <svg viewBox="0 0 155 165" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Ombre */}
      <rect x="6" y="6" width="143" height="153" rx="8" fill="#000" opacity="0.5" filter="blur(3px)" />

      {/* Boîtier Métallique Plié EHX */}
      <rect x="5" y="4" width="145" height="157" rx="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Sérigraphie Triangle & Rayons vintage */}
      <rect x="5" y="18" width="145" height="34" fill="#0d9488" />
      <text x="77" y="38" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        STEREO MEMORY MAN
      </text>
      <text x="77" y="46" fill="#99f6e4" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        ANALOG DELAY / CHORUS / VIBRATO
      </text>

      {/* 5 Potentiomètres (Blend, Level, Feedback, Delay, Depth) */}
      {[
        { cx: 22, cy: 72, label: 'BLEND' },
        { cx: 50, cy: 72, label: 'LEVEL' },
        { cx: 77, cy: 72, label: 'FDBK' },
        { cx: 105, cy: 72, label: 'DELAY' },
        { cx: 133, cy: 72, label: 'DEPTH' }
      ].map((k, i) => (
        <g key={i}>
          <circle cx={k.cx} cy={k.cy} r="7.5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <line x1={k.cx} y1={k.cy} x2={k.cx} y2={k.cy - 6} stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
          <text x={k.cx} y={k.cy + 13} fill="#475569" fontSize="4" fontWeight="bold" textAnchor="middle">{k.label}</text>
        </g>
      ))}

      {/* Commutateur Chorus / Vibrato */}
      <rect x="65" y="96" width="24" height="10" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
      <circle cx="72" cy="101" r="2.5" fill="#e2e8f0" />
      <text x="77" y="114" fill="#64748b" fontSize="4.5" textAnchor="middle">CHORUS / VIB</text>

      {/* LED d'état */}
      <circle cx="48" cy="136" r="3.5" fill={isActive ? '#14b8a6' : '#475569'} stroke="#0f766e" strokeWidth="0.8" />
      {isActive && (
        <circle cx="48" cy="136" r="7" fill="#2dd4bf" opacity="0.6" />
      )}

      {/* Footswitch mécanique */}
      <circle cx="77" cy="136" r="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
      <circle cx="77" cy="136" r="6" fill="#94a3b8" />
    </svg>
  )
}

/**
 * TC Electronic Ditto X2
 * Looper stéréo 2 boutons (Loop & FX/Stop), sélecteur de mode 1/2 speed / Reverse.
 */
export const DittoX2SVG: React.FC<PedalSVGProps> = ({ isActive }) => {
  return (
    <svg viewBox="0 0 145 165" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Ombre */}
      <rect x="6" y="6" width="133" height="153" rx="8" fill="#000" opacity="0.5" filter="blur(3px)" />

      {/* Châssis alu brossé foncé TC Electronic */}
      <rect x="5" y="4" width="135" height="157" rx="8" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />

      {/* Badge DITTO X2 */}
      <text x="72" y="24" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        ditto <tspan fill="#a1a1aa" fontSize="10">X2</tspan>
      </text>
      <text x="72" y="32" fill="#71717a" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        TC ELECTRONIC • LOOPER
      </text>

      {/* Grand potentiomètre de Loop Level au centre */}
      <circle cx="72" cy="56" r="15" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
      <circle cx="72" cy="56" r="10" fill="#18181b" />
      <line x1="72" y1="56" x2="72" y2="44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <text x="72" y="78" fill="#a1a1aa" fontSize="5" fontWeight="bold" textAnchor="middle">LOOP LEVEL</text>

      {/* Toggle FX (Reverse / 1/2 Speed) */}
      <rect x="110" y="52" width="14" height="8" rx="2" fill="#09090b" stroke="#3f3f46" strokeWidth="0.8" />
      <circle cx="114" cy="56" r="2" fill="#e4e4e7" />
      <text x="117" y="68" fill="#71717a" fontSize="4.5" textAnchor="middle">FX</text>

      {/* 2 Footswitches doux (Loop à gauche, FX/Stop à droite) */}
      {/* Switch Loop */}
      <g>
        <circle cx="42" cy="120" r="12" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="42" cy="120" r="8" fill="#94a3b8" />
        {/* LED bicolore (Rouge = REC, Vert = PLAY) */}
        <circle cx="42" cy="98" r="3.5" fill={isActive ? '#ef4444' : '#3f3f46'} />
        {isActive && <circle cx="42" cy="98" r="7" fill="#f87171" opacity="0.6" />}
        <text x="42" y="144" fill="#e4e4e7" fontSize="7" fontWeight="bold" textAnchor="middle">LOOP</text>
      </g>

      {/* Switch Stop */}
      <g>
        <circle cx="102" cy="120" r="12" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="102" cy="120" r="8" fill="#94a3b8" />
        <circle cx="102" cy="98" r="3.5" fill={isActive ? '#22c55e' : '#3f3f46'} />
        <text x="102" y="144" fill="#e4e4e7" fontSize="7" fontWeight="bold" textAnchor="middle">STOP / FX</text>
      </g>
    </svg>
  )
}

/**
 * Morningstar MC-8 (Contrôleur MIDI Master)
 * Large pédalier 8 footswitches (A à H), 4 doubles écrans LCD rétro-éclairés bleus/cyan, boîtier acier noir pro.
 */
export const MorningstarMC8SVG: React.FC<PedalSVGProps & {
  activeSlotLetter?: string
  currentBankName?: string
}> = ({ isActive = true, activeSlotLetter = 'A', currentBankName = 'SET 1' }) => {
  const switches = [
    { letter: 'A', x: 38, y: 55 },
    { letter: 'B', x: 104, y: 55 },
    { letter: 'C', x: 170, y: 55 },
    { letter: 'D', x: 236, y: 55 },
    { letter: 'E', x: 38, y: 110 },
    { letter: 'F', x: 104, y: 110 },
    { letter: 'G', x: 170, y: 110 },
    { letter: 'H', x: 236, y: 110 }
  ]

  return (
    <svg viewBox="0 0 280 140" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Ombre */}
      <rect x="6" y="6" width="268" height="128" rx="8" fill="#000" opacity="0.6" filter="blur(4px)" />

      {/* Châssis métallique noir */}
      <rect x="5" y="4" width="270" height="132" rx="8" fill="#09090b" stroke="#27272a" strokeWidth="2" />
      <rect x="8" y="7" width="264" height="126" rx="6" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />

      {/* Écran LCD Principal LCD Matrix Bleu / Cyan */}
      <rect x="40" y="12" width="200" height="22" rx="3" fill="#030712" stroke="#1e293b" strokeWidth="1" />
      
      {/* Affichage d'écran OLED */}
      <text x="50" y="27" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
        B01: {currentBankName}
      </text>
      <text x="230" y="27" fill="#f59e0b" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">
        SLOT [{activeSlotLetter}]
      </text>

      {/* Marque Morningstar MC8 en haut & LED power */}
      <text x="14" y="26" fill="#e4e4e7" fontSize="7" fontWeight="900" fontFamily="sans-serif">
        MC8
      </text>
      <circle cx="32" cy="23" r="2.5" fill={isActive ? '#10b981' : '#475569'} />

      {/* 8 Footswitches A à H */}
      {switches.map(sw => {
        const isCurrent = activeSlotLetter === sw.letter
        return (
          <g key={sw.letter}>
            {/* Base switch */}
            <circle cx={sw.x} cy={sw.y} r="10" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" />
            <circle cx={sw.x} cy={sw.y} r="6.5" fill={isCurrent ? '#f59e0b' : '#27272a'} />

            {/* LED d'anneau */}
            {isCurrent && (
              <circle cx={sw.x} cy={sw.y} r="13" fill="#f59e0b" opacity="0.35" />
            )}

            {/* Lettre du switch */}
            <text
              x={sw.x}
              y={sw.y + 19}
              fill={isCurrent ? '#f59e0b' : '#71717a'}
              fontSize="7"
              fontWeight="900"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {sw.letter}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
