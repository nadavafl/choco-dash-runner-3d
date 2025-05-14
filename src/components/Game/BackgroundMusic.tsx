
import { useState, useEffect } from 'react';

interface BackgroundMusicProps {
  url: string;
  volume?: number;
  playing?: boolean;
}

/**
 * Component for playing background music in the game.
 * 
 * Supported audio formats: MP3, WAV, OGG
 * 
 * @param url Path to the audio file (e.g. "/sounds/background-music.mp3")
 * @param volume Volume level from 0 to 1 (default: 0.5)
 * @param playing Whether the music should be playing (default: true)
 */
const BackgroundMusic = ({ url, volume = 0.5, playing = true }: BackgroundMusicProps) => {
  const [audio] = useState<HTMLAudioElement | null>(() => {
    // Create audio element when component mounts
    if (typeof window !== 'undefined') {
      const audioElement = new Audio(url);
      audioElement.loop = true;
      audioElement.volume = volume;
      return audioElement;
    }
    return null;
  });

  useEffect(() => {
    if (!audio) return;
    
    // Update volume when prop changes
    audio.volume = volume;
  }, [audio, volume]);

  useEffect(() => {
    if (!audio) return;
    
    // Play or pause based on playing prop
    if (playing) {
      // Using a Promise with catch to handle autoplay restrictions
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
          // Often this is due to browser autoplay restrictions
        });
      }
    } else {
      audio.pause();
    }
    
    // Cleanup function
    return () => {
      audio.pause();
    };
  }, [audio, playing]);

  // This component doesn't render anything visible
  return null;
};

export default BackgroundMusic;
