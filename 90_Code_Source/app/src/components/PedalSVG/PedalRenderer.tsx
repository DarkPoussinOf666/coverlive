import React from 'react'
import type { PedalDevice } from '../../utils/pedalboardAdvisor'
import {
  Whammy5SVG,
  Synth9SVG,
  FuzzFactorySVG,
  BossStandardPedalSVG,
  BossOD200SVG,
  EventideH9SVG,
  MemoryManSVG,
  DittoX2SVG,
  MorningstarMC8SVG,
  type PedalSVGProps
} from './PedalSVGs'

interface PedalRendererProps {
  pedal: PedalDevice
  isActive: boolean
  isHovered?: boolean
  activeSlotLetter?: string
  currentBankName?: string
}

export const PedalRenderer: React.FC<PedalRendererProps> = ({
  pedal,
  isActive,
  isHovered,
  activeSlotLetter = 'A',
  currentBankName = 'SET 1'
}) => {
  const commonProps: PedalSVGProps = {
    isActive,
    isHovered
  }

  switch (pedal.id) {
    case 'whammy5':
      return <Whammy5SVG {...commonProps} />

    case 'synth9':
      return <Synth9SVG {...commonProps} />

    case 'fuzz_factory':
      return <FuzzFactorySVG {...commonProps} />

    case 'boss_fz':
      return (
        <BossStandardPedalSVG
          {...commonProps}
          model="FZ"
          title="FUZZ SHIFTER"
          subtitle="VINTAGE / OCTAVE"
          mainColor="#be123c"
          knobCount={3}
          ledColor="#fb7185"
        />
      )

    case 'soul_food':
      return (
        <BossStandardPedalSVG
          {...commonProps}
          model="SOUL FOOD"
          title="OVERDRIVE"
          subtitle="EHX KLON BOOST"
          mainColor="#d97706"
          knobCount={3}
          ledColor="#f59e0b"
        />
      )

    case 'od200':
      return <BossOD200SVG {...commonProps} />

    case 'ds1':
      return (
        <BossStandardPedalSVG
          {...commonProps}
          model="DS-1"
          title="DISTORTION"
          subtitle="ROCK / GRUNGE"
          mainColor="#ea580c"
          knobCount={3}
          ledColor="#f97316"
        />
      )

    case 'boss_flanger':
      return (
        <BossStandardPedalSVG
          {...commonProps}
          model="BF-3"
          title="FLANGER"
          subtitle="ANALOG BBD"
          mainColor="#7c3aed"
          knobCount={4}
          ledColor="#c084fc"
        />
      )

    case 'h9_mod':
      return (
        <EventideH9SVG
          {...commonProps}
          modelNumber={3}
          algorithmFamily="MOD & PITCH"
          accentColor="#818cf8"
        />
      )

    case 'memory_man':
      return <MemoryManSVG {...commonProps} />

    case 'h9_delay':
      return (
        <EventideH9SVG
          {...commonProps}
          modelNumber={2}
          algorithmFamily="TIMFACTOR DELAY"
          accentColor="#38bdf8"
        />
      )

    case 'h9_space':
      return (
        <EventideH9SVG
          {...commonProps}
          modelNumber={1}
          algorithmFamily="SPACE REVERB"
          accentColor="#2dd4bf"
        />
      )

    case 'ditto_x2':
      return <DittoX2SVG {...commonProps} />

    case 'mc8':
      return (
        <MorningstarMC8SVG
          {...commonProps}
          activeSlotLetter={activeSlotLetter}
          currentBankName={currentBankName}
        />
      )

    default:
      return (
        <div className="w-full h-full rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-3 text-center">
          <span className="font-bold text-xs text-white">{pedal.name}</span>
          <span className="text-[10px] text-slate-400 font-mono mt-1">{pedal.type}</span>
        </div>
      )
  }
}
