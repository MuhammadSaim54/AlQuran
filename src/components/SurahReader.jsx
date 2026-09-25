import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Bookmark,
  Volume2
} from 'lucide-react';

export default function SurahReader({ 
  surahNumber, 
  onBack
}) {
  const [loading, setLoading] = useState(true);
  const [surahData, setSurahData] = useState(null);
  const [englishData, setEnglishData] = useState(null);
  const [arabicFontSize, setArabicFontSize] = useState(28);
  const [copiedAyah, setCopiedAyah] = useState(null);
  const [activeAyahNumber, setActiveAyahNumber] = useState(null);
  
  const audioRef = useRef(null);

  const [savedAyahs, setSavedAyahs] = useState(() => {
    try {
      const saved = localStorage.getItem('alquran_ayah_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const stopAndResetAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    setActiveAyahNumber(null);
  }, []);

  useEffect(() => {
    return () => {
      stopAndResetAudio();
    };
  }, [stopAndResetAudio, surahNumber]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`).then(res => res.json()),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`).then(res => res.json())
    ])
      .then(([arabicRes, englishRes]) => {
        if (isMounted) {
          if (arabicRes.code === 200 && englishRes.code === 200) {
            setSurahData(arabicRes.data);
            setEnglishData(englishRes.data);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load Surah reader content:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [surahNumber]);

  const handlePlayAyah = useCallback((globalAyahNumber, ayahInSurah) => {
    if (activeAyahNumber === ayahInSurah) {
      stopAndResetAudio();
      return;
    }

    stopAndResetAudio();

    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.play()
      .then(() => {
        setActiveAyahNumber(ayahInSurah);
      })
      .catch((err) => {
        console.warn("Playback error:", err);
        stopAndResetAudio();
      });

    audio.onended = () => {
      stopAndResetAudio();
    };

    audio.onerror = () => {
      stopAndResetAudio();
    };
  }, [activeAyahNumber, stopAndResetAudio]);

  const toggleAyahBookmark = useCallback((ayahKey) => {
    setSavedAyahs((prev) => {
      const exists = prev.includes(ayahKey);
      const updated = exists ? prev.filter(k => k !== ayahKey) : [...prev, ayahKey];
      try {
        localStorage.setItem('alquran_ayah_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.error("LocalStorage error:", e);
      }
      return updated;
    });
  }, []);

  const copyAyahText = useCallback((text, translation, ayahNum) => {
    const formatted = `"${text}"\n\n${translation}\n[Surah ${surahNumber}:${ayahNum}]`;
    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedAyah(ayahNum);
      setTimeout(() => setCopiedAyah(null), 2000);
    });
  }, [surahNumber]);

  const showBismillah = useMemo(() => {
    return surahNumber !== 9 && surahNumber !== 1;
  }, [surahNumber]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-28 px-1 sm:px-4">
      {/* Top Header */}
      <div className="sticky top-16 z-20 backdrop-blur-xl bg-cream/95 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-3xl border border-gold/30 shadow-md flex items-center justify-between gap-2 w-full">
        <button
          onClick={() => {
            stopAndResetAudio();
            onBack();
          }}
          className="w-9 h-9 sm:w-auto sm:px-3.5 sm:py-2 rounded-2xl bg-white border border-gold/30 hover:border-gold hover:bg-gold/10 text-earth-text text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Surah List</span>
        </button>

        <div className="text-center min-w-0 flex-1 px-1">
          <h3 className="font-extrabold text-xs sm:text-base text-earth-text truncate leading-tight">
            {surahData?.englishName || 'Surah'} {surahData?.name ? `(${surahData.name})` : ''}
          </h3>
          <p className="text-[10px] sm:text-xs text-earth-muted truncate mt-0.5">
            {surahData?.englishNameTranslation} • {surahData?.numberOfAyahs} Ayahs
          </p>
        </div>

        {/* Font Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-white border border-gold/30 p-1 rounded-2xl shadow-sm flex-shrink-0">
          <button
            onClick={() => setArabicFontSize(prev => Math.max(prev - 2, 20))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl hover:bg-gold/15 text-gold-dark font-extrabold text-xs flex items-center justify-center cursor-pointer transition-colors"
            title="A-"
          >
            A-
          </button>
          <div className="w-px h-3.5 bg-gold/25" />
          <button
            onClick={() => setArabicFontSize(prev => Math.min(prev + 2, 42))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl hover:bg-gold/15 text-gold-dark font-extrabold text-xs sm:text-sm flex items-center justify-center cursor-pointer transition-colors"
            title="A+"
          >
            A+
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-gold-dark gap-3">
          <Loader2 className="w-9 h-9 animate-spin" />
          <p className="text-sm font-semibold text-earth-muted">Loading Ayahs & Translations...</p>
        </div>
      ) : surahData && englishData ? (
        <div className="space-y-4 sm:space-y-6">
          {showBismillah && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-5 sm:py-7 px-4 rounded-3xl bg-white/70 border border-gold/25 shadow-sm text-center"
            >
              <p className="font-arabic text-2xl sm:text-3xl font-bold text-gold-dark leading-loose" dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
              <p className="text-[11px] sm:text-xs text-earth-muted mt-1 italic">
                In the name of Allah, the Entirely Merciful, the Especially Merciful.
              </p>
            </motion.div>
          )}

          {/* Ayahs Stream */}
          <div className="space-y-3 sm:space-y-4">
            {surahData.ayahs.map((ayah, idx) => {
              const ayahEnglish = englishData.ayahs[idx]?.text || '';
              const ayahKey = `${surahNumber}:${ayah.numberInSurah}`;
              const isBookmarked = savedAyahs.includes(ayahKey);
              const isPlaying = activeAyahNumber === ayah.numberInSurah;

              return (
                <motion.div
                  key={ayah.number}
                  layout="position"
                  className={`p-4 sm:p-6 rounded-3xl border transition-all duration-300 space-y-3 ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-gold/20 via-white to-gold/15 border-gold shadow-lg ring-2 ring-gold/40' 
                      : 'bg-white/85 border-gold/20 shadow-sm hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-gold/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-extrabold text-xs flex items-center justify-center font-mono transition-colors ${
                        isPlaying ? 'bg-gold text-white shadow-sm' : 'bg-gold/15 text-gold-dark'
                      }`}>
                        {ayah.numberInSurah}
                      </span>
                      {isPlaying && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gold-dark uppercase tracking-wider animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" /> Playing
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => copyAyahText(ayah.text, ayahEnglish, ayah.numberInSurah)}
                        title="Copy Verse"
                        className="p-1.5 sm:p-2 rounded-xl text-earth-muted hover:text-earth-text hover:bg-gold/10 transition-colors cursor-pointer"
                      >
                        {copiedAyah === ayah.numberInSurah ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => toggleAyahBookmark(ayahKey)}
                        title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                        className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                          isBookmarked 
                            ? 'text-gold-dark bg-gold/20' 
                            : 'text-earth-muted hover:text-gold-dark hover:bg-gold/10'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-gold-dark stroke-gold-dark' : ''}`} />
                      </button>

                      <button
                        onClick={() => handlePlayAyah(ayah.number, ayah.numberInSurah)}
                        title={isPlaying ? "Pause Ayah" : "Play Ayah"}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isPlaying 
                            ? 'bg-gold text-white shadow-md shadow-gold/30' 
                            : 'bg-gold/15 text-gold-dark hover:bg-gold/25'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Proper RTL Arabic Text (Natural Correct Order) */}
                  <div className="text-right pt-1" dir="rtl">
                    <p 
                      className={`font-arabic font-bold leading-[2.4] sm:leading-[2.6] tracking-normal transition-colors duration-300 ${
                        isPlaying 
                          ? 'text-gold-dark font-black drop-shadow-sm' 
                          : 'text-earth-text'
                      }`}
                      style={{ fontSize: `${arabicFontSize}px` }}
                    >
                      {ayah.text}
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="pt-1 text-left">
                    <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                      isPlaying ? 'text-earth-text font-medium' : 'text-earth-muted'
                    }`}>
                      {ayahEnglish}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}