'use client'

import { useState } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { ModeToggle } from '~/components/ModeToggle'
import './BGMPlayer.css'

interface Track {
  name: string
  src: string
}

const playlist: Track[] = [
  { name: 'Chiro - Play with me!', src: '/bgm/Chiro - Play with me.mp3' },
  { name: 'Lukrembo - Sunset', src: '/bgm/Lukrembo - Sunset.mp3' },
  { name: 'Oneul - Morning Peppermint', src: '/bgm/Oneul - Morning Peppermint.mp3' },
  { name: 'Oneul - Winter Glow', src: '/bgm/Oneul - Winter Glow.mp3' },
  { name: 'Oneul - Brunch', src: '/bgm/Oneul - Brunch.mp3' },
  { name: 'Oneul - Raindrops', src: '/bgm/Oneul - Raindrops.mp3' },
  { name: 'Oneul - Monday Bounce', src: '/bgm/Oneul - Monday Bounce.mp3' },
  { name: 'Sharou - 2:23 AM', src: '/bgm/Sharou - 2_23 AM.mp3' },
]

export function BGMPlayer() {
  const [currentIndex, setTrackIndex] = useState(0)

  return (
    <>
      <ModeToggle />
      <div></div>
      <p className="text-center">{playlist[currentIndex]?.name ?? ''}</p>
      <AudioPlayer
        src={playlist[currentIndex]!.src}
        autoPlay
        loop
        progressUpdateInterval={50}
        showJumpControls={false}
        showSkipControls={true}
        onClickPrevious={() => setTrackIndex(currentIndex === 0 ? playlist.length - 1 : currentIndex - 1)}
        onClickNext={() => setTrackIndex(currentIndex === playlist.length - 1 ? 0 : currentIndex + 1)}
      />
    </>
  )
}
