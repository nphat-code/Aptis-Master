'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface AudioPlayerProps {
  src: string;
  title?: string;
  autoPlay?: boolean;
  maxPlayCount?: number; // e.g. Aptis allows playing twice
  onEnded?: () => void;
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Normalise audio src path (add leading slash if missing)
  const normalizedSrc = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

  useEffect(() => {
    // Reset state when src changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Check play limit if maxPlayCount is enforced
      if (maxPlayCount > 0 && playCount >= maxPlayCount) {
        alert(`Bạn đã đạt giới hạn nghe tối đa ${maxPlayCount} lần cho câu hỏi này.`);
        return;
      }

      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
        setHasError(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayCount((prev) => prev + 1);
    if (onEnded) onEnded();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatAudioTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-[#24085A] to-[#1a0642] rounded-2xl p-4 sm:p-5 text-white shadow-md space-y-3 border border-purple-900/40 select-none">
      <audio
        ref={audioRef}
        src={normalizedSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={() => setHasError(true)}
        preload="metadata"
      />

      <div className="flex items-center justify-between gap-4">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#CC1C01] hover:bg-[#b01801] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Title & Progress Bar Container */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between text-xs text-purple-200 font-medium">
            <span className="truncate font-semibold text-white">
              {title || 'Audio Recording'}
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              {maxPlayCount > 0 && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-purple-200 border border-white/10">
                  Lượt nghe: {playCount}/{maxPlayCount}
                </span>
              )}
              <span>
                {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
              </span>
            </div>
          </div>

          {/* Seeker Slider */}
          <div className="relative flex items-center group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-purple-950/80 rounded-lg appearance-none cursor-pointer accent-[#CC1C01] z-10 opacity-80 group-hover:opacity-100 transition-opacity"
            />
            {/* Filled Progress Bar Overlay */}
            <div
              className="absolute left-0 h-2 bg-gradient-to-r from-red-600 to-[#CC1C01] rounded-lg pointer-events-none"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {hasError && (
        <div className="text-xs text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-500/30 flex items-center gap-2">
          <span>⚠️ Không thể phát file âm thanh ({normalizedSrc}). Hãy kiểm tra lại file audio.</span>
        </div>
      )}
    </div>
  );
}
