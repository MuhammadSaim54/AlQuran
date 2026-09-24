import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Bookmark, Play, BookOpen, Headphones, X } from 'lucide-react';

import noreenImg from '../assets/images/noreen.jpg';
import sudaisImg from '../assets/images/sudais.jpg';
import alafasyImg from '../assets/images/alafasy.jpg';
import maherImg from '../assets/images/maher.jpg';
import basitImg from '../assets/images/basit.jpg';

export const RECITERS_LIST = [
  {
    id: 'noreen',
    name: 'Sheikh Noreen Muhammad Siddig',
    sub: 'Traditional Sudanese Maqam',
    photo: noreenImg,
    getAudioUrl: (num) => {
      const padded = num.toString().padStart(3, '0');
      return `https://archive.org/download/noreen-mohamed-siddiq/${padded}.mp3`;
    }
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    sub: 'Chief Imam of Masjid Al-Haram, Makkah',
    photo: sudaisImg,
    // 100% Verified Direct High-Speed Stream for Sheikh Sudais
    getAudioUrl: (num) => {
      const padded = num.toString().padStart(3, '0');
      return `https://server11.mp3quran.net/sds/${padded}.mp3`;
    }
  },
  {
    id: 'maher',
    name: 'Maher Al-Muaiqly',
    sub: 'Esteemed Imam of Masjid Al-Haram',
    photo: maherImg,
    getAudioUrl: (num) => {
      const padded = num.toString().padStart(3, '0');
      return `https://download.quranicaudio.com/quran/maher_256/${padded}.mp3`;
    }
  },
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    sub: 'World-Renowned Melodic Murattal',
    photo: alafasyImg,
    getAudioUrl: (num) => `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`
  },
  {
    id: 'basit',
    name: 'Abdul Basit Abdul Samad',
    sub: 'Golden Era Legendary Egyptian Murattal',
    photo: basitImg,
    getAudioUrl: (num) => `https://cdn.islamic.network/quran/audio-surah/128/ar.abdulbasitmurattal/${num}.mp3`
  }
];

const SurahCard = React.memo(function SurahCard({ 
  surah, 
  onCardClick, 
  isBookmarked, 
  onToggleBookmark 
}) {
  const handleBookmarkClick = useCallback((e) => {
    e.stopPropagation();
    if (onToggleBookmark) onToggleBookmark(surah);
  }, [onToggleBookmark, surah]);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onCardClick(surah)}
      className="p-4 sm:p-5 rounded-2xl bg-white/85 border border-gold/25 shadow-sm hover:shadow-md hover:border-gold transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[90px] w-full"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gold/15 text-gold-dark font-extrabold flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
          {surah.number}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm sm:text-base text-earth-text leading-tight truncate">
            {surah.englishName}
          </h4>
          <p className="text-[11px] sm:text-xs text-earth-muted mt-0.5 leading-tight truncate">
            {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0 pl-2">
        <div className="text-right">
          <span className="font-arabic text-lg sm:text-xl font-bold text-earth-text block leading-tight">
            {surah.name}
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-earth-muted font-mono block mt-0.5">
            {surah.revelationType}
          </span>
        </div>

        <button
          onClick={handleBookmarkClick}
          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
            isBookmarked 
              ? 'text-gold-dark bg-gold/20' 
              : 'text-earth-muted hover:text-gold-dark hover:bg-gold/10'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-gold-dark stroke-gold-dark' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
});

function SurahListComponent({ 
  bookmarkedIds = [], 
  onToggleBookmark, 
  onPlayTrack,
  onModalStateChange
}) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [dialogView, setDialogView] = useState('options');

  useEffect(() => {
    let isMounted = true;
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.code === 200) {
          setSurahs(data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch surahs:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredSurahs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return surahs;
    return surahs.filter((s) =>
      s.englishName.toLowerCase().includes(query) ||
      s.name.includes(query) ||
      s.number.toString() === query
    );
  }, [surahs, searchQuery]);

  const openSurahAction = useCallback((surah) => {
    setSelectedSurah(surah);
    setDialogView('options');
    if (onModalStateChange) onModalStateChange(true);
  }, [onModalStateChange]);

  const closeSurahAction = useCallback(() => {
    setSelectedSurah(null);
    if (onModalStateChange) onModalStateChange(false);
  }, [onModalStateChange]);

  const handleSelectReciter = useCallback((reciter) => {
    if (!selectedSurah) return;
    const audioUrl = reciter.getAudioUrl(selectedSurah.number);

    if (onPlayTrack) {
      onPlayTrack({
        surahNumber: selectedSurah.number,
        surahName: selectedSurah.englishName,
        arabicName: selectedSurah.name,
        reciterName: reciter.name,
        reciterId: reciter.id,
        reciterImage: reciter.photo,
        audioUrl: audioUrl
      });
    }
    closeSurahAction();
  }, [selectedSurah, onPlayTrack, closeSurahAction]);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div className="relative w-full">
        <Search className="w-5 h-5 text-earth-muted absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Surah name, number, or translation..."
          className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl bg-white/90 border border-gold/30 text-xs sm:text-base text-earth-text placeholder-earth-muted/70 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 shadow-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gold-dark gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-semibold text-earth-muted">Loading Surah Directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
          {filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.number}
              surah={surah}
              onCardClick={openSurahAction}
              isBookmarked={bookmarkedIds.includes(surah.number)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}

      {/* Surah Action Selection Modal */}
      <AnimatePresence>
        {selectedSurah && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-cream-light border border-gold/40 shadow-2xl rounded-3xl p-6 sm:p-7 max-w-md w-full relative space-y-5 text-earth-text"
            >
              <button
                onClick={closeSurahAction}
                className="absolute top-4 right-4 p-2 rounded-xl text-earth-muted hover:text-earth-text hover:bg-gold/15 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                  Surah {selectedSurah.number} • {selectedSurah.revelationType}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-earth-text">{selectedSurah.englishName}</h3>
                <p className="font-arabic text-lg sm:text-xl font-bold text-gold-dark">{selectedSurah.name}</p>
                <p className="text-xs text-earth-muted">
                  {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Ayahs
                </p>
              </div>

              {dialogView === 'options' && (
                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  <button
                    onClick={() => setDialogView('reading')}
                    className="p-4 rounded-2xl bg-white border border-gold/30 hover:border-gold hover:shadow-md transition-all flex flex-col items-center gap-2.5 text-center cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gold/15 group-hover:bg-gold group-hover:text-white text-gold-dark flex items-center justify-center transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold block text-earth-text">Read Surah</span>
                      <span className="text-[10px] text-earth-muted block mt-0.5">Verses & Translation</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setDialogView('reciters')}
                    className="p-4 rounded-2xl bg-gold text-white hover:bg-gold-dark shadow-md shadow-gold/20 transition-all flex flex-col items-center gap-2.5 text-center cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center transition-colors">
                      <Headphones className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">Listen Recitation</span>
                      <span className="text-[10px] text-white/80 block mt-0.5">Select Qari</span>
                    </div>
                  </button>
                </div>
              )}

              {dialogView === 'reciters' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-earth-muted">Select Qari:</span>
                    <button 
                      onClick={() => setDialogView('options')}
                      className="text-xs text-gold-dark font-bold hover:underline cursor-pointer"
                    >
                      Back
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {RECITERS_LIST.map((reciter) => (
                      <button
                        key={reciter.id}
                        onClick={() => handleSelectReciter(reciter)}
                        className="w-full p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all text-left flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={reciter.photo} 
                            alt={reciter.name} 
                            className="w-10 h-10 rounded-xl object-cover border border-gold/30 flex-shrink-0" 
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs sm:text-sm text-earth-text truncate">{reciter.name}</h5>
                            <p className="text-[10px] text-earth-muted truncate">{reciter.sub}</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold-dark group-hover:bg-gold group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {dialogView === 'reading' && (
                <div className="space-y-3 pt-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-earth-muted">Chapter Overview:</span>
                    <button 
                      onClick={() => setDialogView('options')}
                      className="text-xs text-gold-dark font-bold hover:underline cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-gold/20 space-y-2 text-xs leading-relaxed text-earth-text">
                    <p><strong>English Translation:</strong> {selectedSurah.englishNameTranslation}</p>
                    <p><strong>Total Verses:</strong> {selectedSurah.numberOfAyahs} Ayahs</p>
                    <p><strong>Classification:</strong> {selectedSurah.revelationType} Revelation</p>
                  </div>
                  <button
                    onClick={() => setDialogView('reciters')}
                    className="w-full py-2.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Headphones className="w-4 h-4" /> Listen Audio for {selectedSurah.englishName}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(SurahListComponent);