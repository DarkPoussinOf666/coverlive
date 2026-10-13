import type { Song } from '../types/song'

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Hurt (Acoustic Version)',
    artist: 'Johnny Cash / Nine Inch Nails',
    key: 'Am',
    originalKey: 'Am',
    capo: 0,
    tempoBpm: 80,
    recommendedGuitar: 'Lag Primavera',
    kemperPreset: 'Acoustic Folk Preamp - Warm Body',
    drumBrutePreset: 'Bank A - Beat 01 (Subtle Shaker 80 BPM)',
    miniloguePreset: 'Patch 14 (Subtle Dark Pad)',
    notes: 'Micro Audio-Technica placé à 20cm de la 12ème frette. Commencer très calme en arpèges.',
    estimatedDurationSec: 215,
    scrollSpeedPps: 26,
    content: `[Intro]
Am   C   D   Am
Am   C   D   Am

[Couplet 1]
    Am     C        D          Am
I hurt myself today   to see if I still feel
  Am     C       D          Am
I focus on the pain  the only thing that's real
    Am       C       D          Am
The needle tears a hole  the old familiar sting
      Am      C       D              Am
Try to kill it all away  but I remember everything

[Refrain]
G            Am
What have I become?
F            C
My sweetest friend
G          Am          F
Everyone I know goes away in the end
    G                 Am
And you could have it all
F            C
My empire of dirt
G             Am
I will let you down
F
I will make you hurt

[Couplet 2]
  Am          C        D            Am
I wear this crown of thorns  upon my liar's chair
Am         C      D            Am
Full of broken thoughts  I cannot repair
  Am          C        D               Am
Beneath the stains of time  the feelings disappear
Am        C      D            Am
You are someone else  I am still right here

[Refrain]
G            Am
What have I become?
F            C
My sweetest friend
G          Am          F
Everyone I know goes away in the end
    G                 Am
And you could have it all
F            C
My empire of dirt
G             Am
I will let you down
F
I will make you hurt

[Outro]
   G              Am
If I could start again
  F            C
A million miles away
G             Am
I would keep myself
F
I would find a way`
  },
  {
    id: 'song-2',
    title: 'Creep',
    artist: 'Radiohead',
    key: 'G',
    originalKey: 'G',
    capo: 0,
    tempoBpm: 92,
    recommendedGuitar: 'Duesenberg Paloma',
    kemperPreset: 'Dumble Clean -> Big Muff Solo Crunch',
    drumBrutePreset: 'Bank B - Beat 04 (Ghost snare)',
    miniloguePreset: 'Patch 08 (Vintage Sine Bell)',
    notes: 'Sélecteur micro milieu pour les arpèges clairs. Cloner le son de Jonny Greenwood au refrain !',
    estimatedDurationSec: 240,
    scrollSpeedPps: 30,
    content: `[Intro]
G   B   C   Cm
(Arpèges nets et suspendus)

[Couplet 1]
              G
When you were here before
                  B
Couldn't look you in the eye
                   C
You're just like an angel
                    Cm
Your skin makes me cry

                  G
You float like a feather
               B
In a beautiful world
                C
I wish I was special
                    Cm
You're so fuckin' special

[Refrain - Exploser le crunch Kemper !]
          G
But I'm a creep
          B
I'm a weirdo
                   C
What the hell am I doin' here?
            Cm
I don't belong here

[Couplet 2]
                G
I don't care if it hurts
               B
I wanna have control
                C
I want a perfect body
                 Cm
I want a perfect soul

             G
I want you to notice
              B
When I'm not around
                C
You're so fuckin' special
               Cm
I wish I was special

[Refrain]
          G
But I'm a creep
          B
I'm a weirdo
                   C
What the hell am I doin' here?
            Cm
I don't belong here`
  },
  {
    id: 'song-3',
    title: 'Where Is My Mind?',
    artist: 'Pixies',
    key: 'E',
    originalKey: 'E',
    capo: 0,
    tempoBpm: 82,
    recommendedGuitar: 'Fender Jaguar',
    kemperPreset: 'Vox AC30 Top Boost + Spring Reverb',
    drumBrutePreset: 'Bank A - Beat 07',
    miniloguePreset: 'Patch 02 (Sub Bass Drive)',
    notes: 'Activer le circuit Rhythm pour l intro puis passer en Lead. Voix avec Shure 55 bien collé.',
    estimatedDurationSec: 230,
    scrollSpeedPps: 28,
    content: `[Intro]
E   C#m   G#   A
(Oooh... stop...)
E   C#m   G#   A

[Couplet 1]
     E               C#m
With your feet in the air 
         G#        A
and your head on the ground
E         C#m         G#          A
 Try this trick and spin it, yeah
E            C#m
 Your head will collapse 
       G#                     A
if there's nothing in it and you'll ask yourself

[Refrain]
E            C#m
 Where is my mind?
G#           A
 Where is my mind?
E            C#m     G#    A
 Where is my mind?

E         G#            A             Am             C#m   B
Way out in the water, see it swimmin'

[Couplet 2]
  E         C#m
I was swimmin' in the Caribbean
G#        A
Animals were hiding behind the rock
E          C#m
Except the little fish
    G#                           A
Bumped into me, I swear he was tryin' to talk to me, koi-koi

[Refrain]
E            C#m
 Where is my mind?
G#           A
 Where is my mind?
E            C#m     G#    A
 Where is my mind?`
  }
]
