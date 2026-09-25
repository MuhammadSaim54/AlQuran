import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  SkipForward, 
  SkipBack, 
  Loader2,
  ChevronUp,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { RECITERS_MASTER, formatAudioUrl } from './AudioLibrary';
import { SURAH_METADATA } from './MushafViewer';

export default function AudioPlayer({ track, currentTrack, onClose, onTrackChange }) {
  const initialTrack = track || currentTrack;

  const [activeReciterId, setActiveReciterId] = useState(initialTrack?.reciterId || 'noreen');
  const [activeSurahNum, setActiveSurahNum] = useState(initialTrack?.surahNumber || 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showQariDropdown, setShowQariDropdown] = useState(false);

  const audioRef = useRef(null);

  // Sync when prop updates
  useEffect(() => {
    if (initialTrack) {
      if (initialTrack.reciterId) setActiveReciterId(initialTrack.reciterId);
      if (initialTrack.surahNumber) setActiveSurahNum(initialTrack.surahNumber);
    }
  }, [initialTrack]);

  const currentReciter = useMemo(() => {
    return RECITERS_MASTER.find(r => r.id === activeReciterId) || RECITERS_MASTER[0];
  }, [activeReciterId]);

  const currentSurah = useMemo(() => {
    return SURAH_METADATA.find(s => s.num === activeSurahNum) || SURAH_METADATA[0];
  }, [activeSurahNum]);

  const audioSrc = useMemo(() => {
    return formatAudioUrl(currentReciter.server, currentSurah.num);
  }, [currentReciter, currentSurah]);

  // HARD SWITCH EFFECT: Whenever Qari or Surah changes, force-play fresh audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setIsPlaying(false);
    audio.pause();
    audio.src = audioSrc;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn("Playback stream waiting for user interaction:", err);
          setIsLoading(false);
        });
    }
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleNextSurah = () => {
    if (activeSurahNum < 114) {
      setActiveSurahNum(prev => prev + 1);
    }
  };

  const handlePrevSurah = () => {
    if (activeSurahNum > 1) {
      setActiveSurahNum(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C1813]/98 backdrop-blur-xl border-t border-[#C5A059]/40 text-[#FAF7F2] p-3 sm:px-8 sm:py-3.5 shadow-2xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNextSurah}
        onError={() => setIsLoading(false)}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Active Reciter & Interactive Switcher */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={currentReciter.image}
                alt={currentReciter.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border border-[#C5A059]/60 shadow-xs"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-[#C5A059]" />
                </div>
              )}
            </div>

            <div className="min-w-0 relative">
              <div className="flex items-baseline gap-2">
                <h4 className="font-bold text-sm text-white truncate">
                  {currentSurah.name}
                </h4>
                <span className="font-arabic text-sm text-[#C5A059]" dir="rtl">
                  {currentSurah.ar}
                </span>
              </div>

              {/* Clickable Qari Switch Button */}
              <button
                type="button"
                onClick={() => setShowQariDropdown(prev => !prev)}
                className="flex items-center gap-1 text-[11px] text-[#C5A059] hover:underline font-mono mt-0.5 cursor-pointer"
              >
                <span>{currentReciter.name}</span>
                {showQariDropdown ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>

              {/* Instant Qari Switch Popup */}
              {showQariDropdown && (
                <div className="absolute bottom-11 left-0 w-64 bg-[#262018] border border-[#C5A059]/50 shadow-2xl rounded-2xl p-2 z-50 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#A8987E] px-2 block">
                    Switch Reciter
                  </span>
                  {RECITERS_MASTER.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setActiveReciterId(r.id);
                        setShowQariDropdown(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        r.id === activeReciterId
                          ? 'bg-[#C5A059] text-[#17120A] font-bold'
                          : 'text-[#FAF7F2] hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{r.name}</span>
                      {r.id === activeReciterId && <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 text-[#A8987E] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Controls & Timeline */}
        <div className="flex flex-col items-center gap-1.5 w-full md:max-w-lg">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePrevSurah}
              disabled={activeSurahNum <= 1}
              className="p-1.5 text-[#A8987E] hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous Surah"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#C5A059] hover:bg-[#D4AF65] text-[#17120A] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNextSurah}
              disabled={activeSurahNum >= 114}
              className="p-1.5 text-[#A8987E] hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next Surah"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Timeline */}
          <div className="flex items-center gap-2.5 w-full text-[11px] font-mono text-[#A8987E]">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Dismiss */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 text-[#A8987E] hover:text-white cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>

          <div className="w-[1px] h-5 bg-white/20 mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-[#A8987E] hover:text-white cursor-pointer"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}