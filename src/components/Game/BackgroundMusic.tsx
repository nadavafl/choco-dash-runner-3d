
import { useState, useEffect, useRef } from 'react';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Create audio element when component mounts
    if (typeof window !== 'undefined') {
      const audioElement = new Audio(url);
      audioElement.loop = true;
      audioElement.volume = volume;
      audioRef.current = audioElement;
      
      // Don't auto-play; wait for user interaction
      
      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }
  }, [url]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    // Update volume when prop changes
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !audioInitialized) return;
    
    // Only play/pause if audio has been initialized through user interaction
    if (playing) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [playing, audioInitialized]);
  
  // Method to initialize audio after user interaction
  const initializeAudio = () => {
    if (audioRef.current && !audioInitialized) {
      setAudioInitialized(true);
      if (playing) {
        audioRef.current.play()
          .then(() => {
            console.log("Audio successfully initialized");
          })
          .catch(error => {
            console.error("Audio initialization failed:", error);
          });
      }
    }
  };

  // This component doesn't render anything visible
  // But exposes initializeAudio method
  return { initializeAudio };
};

export default BackgroundMusic;
