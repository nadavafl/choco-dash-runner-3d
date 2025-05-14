
import { useState, useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  url: string;
  volume?: number;
  playing?: boolean;
  onInit?: (initFn: () => void) => void;
}

/**
 * Component for playing background music in the game.
 * 
 * Supported audio formats: MP3, WAV, OGG
 * 
 * @param url Path to the audio file (e.g. "/sounds/background-music.mp3")
 * @param volume Volume level from 0 to 1 (default: 0.5)
 * @param playing Whether the music should be playing (default: true)
 * @param onInit Callback that provides the initialize function
 */
const BackgroundMusic = ({ url, volume = 0.5, playing = true, onInit }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Create audio element when component mounts
    if (typeof window !== 'undefined') {
      const audioElement = new Audio(url);
      audioElement.loop = true;
      audioElement.volume = volume;
      audioRef.current = audioElement;
      
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
    
    console.log("Music playing state change:", playing);
    
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
      console.log("Audio initializing...");
      setAudioInitialized(true);
      if (playing) {
        console.log("Attempting to play audio on initialization");
        audioRef.current.play()
          .then(() => {
            console.log("Audio successfully initialized and playing");
          })
          .catch(error => {
            console.error("Audio initialization failed:", error);
          });
      }
    }
  };

  // Provide the initialization function through the callback
  useEffect(() => {
    if (onInit) {
      onInit(initializeAudio);
    }
  }, [onInit]);

  // This component doesn't render anything visible
  return null;
};

export default BackgroundMusic;
