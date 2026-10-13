# Inventaire & Routing Hardware — Live Setup "Your Reign Is Over"

Ce document répertorie l'ensemble de la chaîne technique pour les streams Twitch guitare/chant.

## 1. Table des Instruments & Presets

| Instrument | Type | Rôle / Style | Prise de son / Entrée | Preset Kemper recommandé | Capo / Accordage fréquent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lag Primavera** | Acoustique Folk | Folk, acoustique intimiste, ballades | Micro AT petite membrane $\rightarrow$ In 2 MiniFuse | Kemper Acoustic / Clean Preamp | Standard / Capo 2, 4 |
| **Fender Jaguar** | Électrique | Indie rock, alternative, son brillant | Direct In $\rightarrow$ Kemper Profiler $\rightarrow$ In 1 MiniFuse | Fender Twin / Vox AC30 | Standard / Drop D |
| **Duesenberg Paloma** | Électrique (HSS) | Polyvalent, sons riches, leads expressifs | Direct In $\rightarrow$ Kemper Profiler $\rightarrow$ In 1 MiniFuse | Dumble / Boutique Clean & Crunch | Standard |
| **Fender Telecaster Baja**| Électrique | Twang, rythmiques percutantes, blues/rock| Direct In $\rightarrow$ Kemper Profiler $\rightarrow$ In 1 MiniFuse | Deluxe Reverb / Tweed | Standard / Open G |
| **Lag Roxanne** | Électrique (HH) | Rock puissant, sustain généreux, solo | Direct In $\rightarrow$ Kemper Profiler $\rightarrow$ In 1 MiniFuse | Marshall JCM800 / Friedman | Standard / Drop D |
| **Arturia DrumBrute** | BÀR Analogique | Rythmiques acoustiques/électro, groove live | Mix Out $\rightarrow$ Table / In Aux MiniFuse ou In 3-4 | N/A (Presets patterns machine) | Tempo calé au BPM morceau |
| **Korg Minilogue** | Synthé Polyphonique (4 voix) | Nappes, basses analogiques, arpèges | Audio Out $\rightarrow$ In 3-4 MiniFuse ou Kemper Aux | Presets internes 1-200 | Accordage standard (440Hz) |

---

## 2. Table du Pedalboard & Contrôle MIDI

Le pedalboard de *Your Reign Is Over* est un système haute précision hybride (analogique + numérique MIDI) :

| Pédale / Appareil | Type | Rôle sonore / Fonction | Contrôle / Midi |
| :--- | :--- | :--- | :--- |
| **Morningstar MC-8** | Contrôleur MIDI Pro | Chef d'orchestre au pied : envoi de PC/CC au Kemper, aux 3 H9, et à l'appli Web (USB MIDI) | Master MIDI Out & USB |
| **3x Eventide H9** | Multi-effets DSP | H9 #1 (Space/Reverbs), H9 #2 (TimeFactor/Delays), H9 #3 (ModFactor/PitchFactor) | MIDI In/Thru via MC-8 |
| **Digitech Whammy 5** | Pitch Shifter / Octaver | Glissandos de pitch, drop tuning, harmonisations | Pédale d'expression / MIDI In |
| **EHX Synth9** | Synth Emulation | Émulation de synthétiseurs vintage 90s, Moog, Prophet à la guitare | Entrée directe signal dry |
| **ZVex Fuzz Factory** | Fuzz Germanium | Fuzz destructrice, oscillante, velcros et textures extrêmes | Boucle dynamique avant ampli |
| **Boss OD-200** | Overdrive multi-moteur | Drives variés, boosts transparents, crunch tranchant | MIDI In / Presets sauvegardés |
| **Distortion (DS-1)** | Distortion classique | Lead incisif, saturation typique rock alternatif | Pédale analogique |
| **EHX Klon (Soul Food)** | Overdrive Transparent | Clean boost, saturation légère organique | Always-on ou solo boost |
| **Boss Flanger** | Modulation analogique | Balayages métalliques, jet plane, textures spatiales | Entrée ligne/boucle |
| **EHX Stereo Memory Man** | Analog Delay / Chorus | Répétitions chaleureuses et modulation spatiale vintage | Stéréo In/Out |
| **TC Electronic Ditto X2** | Looper 2 boutons | Bouclage live d'accords pour solos guitare/voix en direct | Fin de chaîne |
| **Boss Fuzz Shifter (FZ)** | Fuzz vintage & octave | Textures fuzz grasses et sustain infini | En amont du drive |

---

## 3. Table des Entrées Audio (Arturia MiniFuse 4)

- **Entrée 1 (XLR/Jack Front)** : Sortie Kemper Profiler (signal guitare électrique modélisé stéréo ou mono gauche).
- **Entrée 2 (XLR/Jack Front)** : Shure 55 Black Edition (micro chant avec préampli Arturia réglé avec gain optimal).
- **Entrée 3 (Jack/XLR Rear)** : Audio-Technica petite membrane (prise de son guitare acoustique Lag Primavera avec alimentation fantôme +48V).
- **Entrée 4 (Jack/XLR Rear)** : Kemper Profiler (canal droit stéréo) ou source auxiliaire.
- **Monitoring** : Sortie Casque 1 & 2 pour écoute retour sans latence.
- **DAW / Captation (Fender Studio One)** :
  - Session multipiste configurée pour enregistrer en parallèle du stream :
    - Piste 1 : Chant (Shure 55)
    - Piste 2 : Guitare acoustique (Audio-Technica)
    - Piste 3-4 : Kemper Profiler (Stéréo L/R) ou Minilogue / DrumBrute
  - Permet d'archiver les performances live et de sortir des extraits mixés propres.

---

## 3. Périphériques de Contrôle & Vidéo

- **AKAI MPC Touch** :
  - Communication USB / MIDI.
  - Possibilité de mapper les pads/boutons pour contrôler l'appli Web :
    - Pad 1 : Morceau précédent
    - Pad 2 : Morceau suivant
    - Pad 3 : Start / Pause autoscroll
    - Pad 4 : Accélérer scroll (+5%)
    - Pad 5 : Ralentir scroll (-5%)
    - Pad 6 : Reset scroll en haut
- **Caméra Logitech HD 1080p** :
  - Cadrage plan moyen (visage + manche de guitare + Shure 55).
- **Stream Twitch / OBS Studio** :
  - Intégration future d'une source navigateur locale (`localhost:5173/overlay`) pour afficher le titre du morceau en cours sur le stream.
