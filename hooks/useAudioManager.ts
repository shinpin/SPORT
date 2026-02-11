
import { useRef, useEffect, useCallback } from 'react';

const BGM_URL = "https://github.com/shinpin/SPORT/raw/refs/heads/main/BGM_footballtest.mp3";

export function useAudioManager(isMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = BGM_URL;
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = "auto";
    audio.muted = isMuted;

    audio.onerror = (e) => {
      console.error("背景音樂加載失敗：", BGM_URL, e);
    };

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("自動播放受限", err);
      });
    }

    const unlockAudio = () => {
      if (audioRef.current && audioRef.current.paused && !audioRef.current.muted) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
  }, []);

  return { play };
}
