import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  SkipForward, 
  SkipBack, 
  Music, 
  Loader2, 
  Repeat, 
  Repeat1, 
  UserCheck
} from 'lucide-react';
import { RECITERS_LIST } from './SurahList';

export default React.memo(function AudioPlayer({ 
  currentTrack, 
  onClose,
  onNext,
  onPrev,
  isLooping,
  setIsLooping,
  isAutoplay,
  setIsAutoplay,
  onChangeQari,
  isModalOpen = false
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQariPicker, setShowQariPicker] = useState(false);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
    if (audioRef.current) {
      const p = audioRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true))
         .catch((err) => {
           console.warn("User click required for playback:", err);
           setIsPlaying(false);
         });
      }
    }
  }, []);

  // Fix: Jab bhi Qari ya Surah change ho, audio clean reload ho kar auto-play ho
  useEffect(() => {
    if (!currentTrack?.audioUrl || !audioRef.current) return;
    
    setIsBuffering(true);
    setIsPlaying(false);
    
    audioRef.current.pause();
    audioRef.current.load();
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.warn("Playback waiting for interaction:", err);
          setIsBuffering(false);
        });
    }
  }, [currentTrack?.audioUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
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
      audioRef.current.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleTrackEnded = () => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else if (isAutoplay && onNext) {
      onNext();
    } else {
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      <AnimatePresence>
        {!isModalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-16 lg:bottom-4 left-2.5 right-2.5 sm:left-6 sm:right-6 lg:left-10 lg:right-10 z-40 max-w-[1400px] mx-auto bg-white/95 backdrop-blur-xl border border-gold/40 shadow-2xl rounded-3xl p-3 sm:p-4 text-earth-text will-change-transform"
          >
            <audio
              key={currentTrack.audioUrl}
              ref={audioRef}
              src={currentTrack.audioUrl}
              preload="auto"
              onCanPlay={handleCanPlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={() => {
                setIsBuffering(false);
                setIsPlaying(false);
              }}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onEnded={handleTrackEnded}
            />

            {/* Desktop 3-Column Layout & Mobile Stack */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
              
              {/* Left Column: Track Meta Details */}
              <div className="flex items-center justify-between w-full lg:w-1/4 lg:min-w-[260px] min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    onClick={() => setShowQariPicker(true)}
                    title="Switch Reciter"
                    className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-gold/30 bg-gold/15 flex-shrink-0 cursor-pointer shadow-sm group"
                  >
                    {currentTrack.reciterImage ? (
                      <img 
                        src={currentTrack.reciterImage} 
                        alt={currentTrack.reciterName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold-dark">
                        <Music className="w-5 h-5" />
                      </div>
                    )}
                    {isPlaying && (
                      <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>

                  <div className="min-w-0 text-left">
                    <h4 className="font-bold text-xs sm:text-sm text-earth-text truncate">
                      {currentTrack.surahName} {currentTrack.arabicName ? `(${currentTrack.arabicName})` : ''}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[10px] sm:text-xs text-gold-dark truncate font-semibold">
                        {currentTrack.reciterName}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowQariPicker(true)}
                        className="px-2 py-0.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-gold-dark text-[10px] font-bold transition-colors cursor-pointer border border-gold/25 flex-shrink-0"
                      >
                        Switch
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Only Close Button */}
                <button 
                  type="button"
                  onClick={onClose}
                  className="lg:hidden p-2 rounded-xl text-earth-muted hover:text-earth-text hover:bg-gold/10 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Center Column: Playback Controls & Seekbar */}
              <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
                  {/* Loop Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsLooping(!isLooping)}
                    title={isLooping ? "Loop Active" : "Loop Inactive"}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isLooping ? 'text-gold-dark bg-gold/20' : 'text-earth-muted hover:text-earth-text'
                    }`}
                  >
                    {isLooping ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </button>

                  {/* Previous Surah */}
                  <button 
                    type="button"
                    onClick={onPrev}
                    title="Previous Surah"
                    className="text-earth-muted hover:text-earth-text transition-colors cursor-pointer p-1.5 active:scale-90"
                  >
                    <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Play / Pause Main Button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gold hover:bg-gold-dark text-white flex items-center justify-center shadow-md shadow-gold/25 transition-transform active:scale-90 cursor-pointer"
                  >
                    {isBuffering ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  {/* Next Surah */}
                  <button 
                    type="button"
                    onClick={onNext}
                    title="Next Surah"
                    className="text-earth-muted hover:text-earth-text transition-colors cursor-pointer p-1.5 active:scale-90"
                  >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Autoplay Next */}
                  <button
                    type="button"
                    onClick={() => setIsAutoplay(!isAutoplay)}
                    title={isAutoplay ? "Autoplay Next (Active)" : "Autoplay (Off)"}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono transition-colors cursor-pointer border ${
                      isAutoplay 
                        ? 'bg-gold/20 border-gold/40 text-gold-dark' 
                        : 'border-gold/20 text-earth-muted hover:text-earth-text'
                    }`}
                  >
                    AUTO
                  </button>

                  {/* Volume Button & Slider Overlay */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      className={`p-2 rounded-xl transition-all cursor-pointer border ${
                        showVolumeSlider || isMuted
                          ? 'bg-gold text-white border-gold shadow-sm'
                          : 'bg-gold/10 text-gold-dark border-gold/25 hover:bg-gold/20'
                      }`}
                      title="Adjust Volume"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute bottom-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-3 p-3 bg-white/98 rounded-2xl shadow-xl border border-gold/30 flex items-center gap-2.5 z-50 min-w-[155px]"
                        >
                          <button type="button" onClick={toggleMute} className="text-gold-dark cursor-pointer">
                            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-amber-700" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1.5 bg-gold/25 rounded-lg appearance-none cursor-pointer accent-gold"
                          />
                          <span className="text-[10px] font-mono font-bold text-earth-muted">
                            {Math.round((isMuted ? 0 : volume) * 100)}%
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Seekbar Time & Range Input */}
                <div className="w-full flex items-center gap-2.5 text-[10px] sm:text-xs font-mono text-earth-muted px-1">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-gold/20 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Column: Desktop Action Buttons (Choose Qari & Close) */}
              <div className="hidden lg:flex items-center justify-end gap-3 w-1/4 lg:min-w-[260px]">
                <button
                  type="button"
                  onClick={() => setShowQariPicker(true)}
                  className="px-4 py-2 rounded-2xl bg-gold/15 hover:bg-gold/25 text-gold-dark text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-gold/30 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Choose Qari</span>
                </button>

                <button 
                  type="button"
                  onClick={onClose}
                  title="Close Player"
                  className="p-2 rounded-2xl text-earth-muted hover:text-earth-text hover:bg-gold/15 cursor-pointer transition-colors border border-transparent hover:border-gold/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch Qari Modal Centered */}
      <AnimatePresence>
        {showQariPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-cream-light border border-gold/40 shadow-2xl rounded-3xl p-5 sm:p-6 max-w-sm sm:max-w-md w-full space-y-4 text-earth-text relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-shrink-0">
                <div>
                  <h4 className="font-extrabold text-base text-earth-text">Switch Qari</h4>
                  <p className="text-xs text-earth-muted mt-0.5">Select a reciter for this Surah</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowQariPicker(false)} 
                  className="p-2 text-earth-muted hover:text-earth-text cursor-pointer rounded-xl hover:bg-gold/15 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                {RECITERS_LIST.map((reciter) => {
                  const isSelected = reciter.id === currentTrack.reciterId;
                  return (
                    <button
                      key={reciter.id}
                      type="button"
                      onClick={() => {
                        if (onChangeQari) onChangeQari(reciter);
                        setShowQariPicker(false);
                      }}
                      className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected 
                          ? 'bg-gold text-white font-bold border-gold shadow-md' 
                          : 'bg-white hover:bg-gold/10 border-gold/25'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={reciter.photo} 
                          alt={reciter.name} 
                          className="w-11 h-11 rounded-xl object-cover border border-gold/30 flex-shrink-0" 
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-xs sm:text-sm font-bold truncate">{reciter.name}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-white/85' : 'text-earth-muted'}`}>
                            {reciter.sub}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-gold-dark shadow-sm flex-shrink-0">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});