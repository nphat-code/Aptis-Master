'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface AudioPlayerProps {
  src: string;
  title?: string;
  autoPlay?: boolean;
  maxPlayCount?: number; // Aptis allows playing twice max (default: 2)
  onEnded?: () => void;
}

// Module-level map to retain audio play counts across question navigation during a test session
const playCountsMap: Record<string, number> = {};

export function resetAudioPlayCounts() {
  for (const key in playCountsMap) {
    delete playCountsMap[key];
  }
}

export default function AudioPlayer({
  src,
  title,
  autoPlay = false,
  maxPlayCount = 2,
  onEnded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Normalise audio src path (add leading slash if missing)
  const normalizedSrc = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

  // Initialize playCount from persistent playCountsMap
  const [playCount, setPlayCount] = useState(() => playCountsMap[normalizedSrc] || 0);

  useEffect(() => {
    // Sync playCount from playCountsMap when normalizedSrc changes
    setIsPlaying(false);
    setPlayCount(playCountsMap[normalizedSrc] || 0);
    setHasError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [normalizedSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // User clicks Stop: pause audio and reset to start (0:00)
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      // User clicks Play
      const currentCount = playCountsMap[normalizedSrc] || 0;
      if (currentCount >= maxPlayCount) {
        return; // Max 2 plays reached, cannot play again
      }

      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          const newCount = (playCountsMap[normalizedSrc] || 0) + 1;
          playCountsMap[normalizedSrc] = newCount;
          setPlayCount(newCount);
        })
        .catch((err) => {
          console.warn('Audio play error:', err);
          setHasError(true);
        });
    }
  };

  const handleAudioEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  const isMaxReachedAndStopped = !isPlaying && playCount >= maxPlayCount;

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <audio
        ref={audioRef}
        src={normalizedSrc}
        onEnded={handleAudioEnded}
        onError={() => setHasError(true)}
        preload="metadata"
      />

      <button
        type="button"
        disabled={isMaxReachedAndStopped}
        onClick={togglePlay}
        className={`group inline-flex items-center gap-2.5 transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none ${
          isMaxReachedAndStopped
            ? 'opacity-40 cursor-not-allowed text-slate-400'
            : 'cursor-pointer text-slate-900 hover:text-[#CC1C01] active:text-[#CC1C01]'
        }`}
        aria-label={isPlaying ? 'Stop Audio' : 'Play Audio'}
      >
        {/* Circle Play/Pause Icon */}
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-current flex items-center justify-center transition-colors shrink-0 ${
          isMaxReachedAndStopped ? 'border-slate-300 text-slate-400' : ''
        }`}>
          {isPlaying ? (
            /* Pause/Stop Square */
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            /* Play Triangle */
            <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        {/* Text: Play/Stop with Underline */}
        <span className="text-[14px] font-medium underline underline-offset-4 tracking-tight transition-colors">
          Play/Stop
        </span>
      </button>

      {hasError && (
        <span className="text-xs text-red-600 font-medium ml-2">
          (⚠️ Lỗi nạp audio: {normalizedSrc})
        </span>
      )}
    </div>
  );
}
