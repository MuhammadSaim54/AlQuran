import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Search, ChevronDown } from 'lucide-react';
import { RECITERS_LIST } from './SurahList';

export default React.memo(function AudioLibrary({ onPlayRecitation, surahs = [] }) {
  const [searchReciter, setSearchReciter] = useState('');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [surahSearchQuery, setSurahSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredReciters = useMemo(() => {
    return RECITERS_LIST.filter(r =>
      r.name.toLowerCase().includes(searchReciter.toLowerCase()) ||
      r.sub.toLowerCase().includes(searchReciter.toLowerCase())
    );
  }, [searchReciter]);

  const currentSelectedSurah = useMemo(() => {
    return surahs.find(s => s.number === selectedSurahNumber) || {
      number: 1,
      englishName: 'Al-Fatihah',
      name: 'الفاتحة',
      englishNameTranslation: 'The Opening'
    };
  }, [surahs, selectedSurahNumber]);

  const filteredSurahsList = useMemo(() => {
    if (!surahSearchQuery.trim()) return surahs;
    const q = surahSearchQuery.toLowerCase();
    return surahs.filter(s =>
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      s.number.toString() === q.trim()
    );
  }, [surahs, surahSearchQuery]);

  const handlePlayReciter = (reciter) => {
    const audioUrl = reciter.getAudioUrl(currentSelectedSurah.number);
    onPlayRecitation({
      surahNumber: currentSelectedSurah.number,
      surahName: currentSelectedSurah.englishName,
      arabicName: currentSelectedSurah.name,
      reciterName: reciter.name,
      reciterId: reciter.id,
      reciterImage: reciter.photo,
      audioUrl: audioUrl
    });
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="p-5 sm:p-7 rounded-3xl bg-white/85 border border-gold/30 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-earth-text">World-Renowned Qaris</h2>
            <p className="text-xs sm:text-sm text-earth-muted mt-0.5">
              Select any Surah and listen to authentic studio recitations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="relative" ref={dropdownRef}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-muted block mb-1">
                Selected Surah:
              </span>
              
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-72 px-4 py-2.5 rounded-2xl bg-white border border-gold/30 hover:border-gold shadow-sm flex items-center justify-between gap-2 transition-all cursor-pointer h-11"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-gold/15 text-gold-dark font-extrabold text-[11px] flex items-center justify-center flex-shrink-0">
                    {currentSelectedSurah.number}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-earth-text truncate">
                    {currentSelectedSurah.englishName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="font-arabic text-xs font-bold text-gold-dark">
                    {currentSelectedSurah.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-earth-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-white rounded-2xl border border-gold/30 shadow-2xl p-3 z-50 space-y-2 backdrop-blur-md"
                  >
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-earth-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={surahSearchQuery}
                        onChange={(e) => setSurahSearchQuery(e.target.value)}
                        placeholder="Search Surah name or number..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-cream/70 border border-gold/25 text-xs outline-none focus:border-gold"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                      {filteredSurahsList.map((s) => {
                        const isSelected = s.number === selectedSurahNumber;
                        return (
                          <button
                            key={s.number}
                            onClick={() => {
                              setSelectedSurahNumber(s.number);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-gold text-white font-bold shadow-sm' 
                                : 'hover:bg-gold/10 text-earth-text'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/25 text-white' : 'bg-gold/15 text-gold-dark'}`}>
                                {s.number}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs truncate font-medium">{s.englishName}</p>
                                <p className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-earth-muted'}`}>
                                  {s.englishNameTranslation}
                                </p>
                              </div>
                            </div>
                            <span className={`font-arabic text-xs font-bold ${isSelected ? 'text-white' : 'text-gold-dark'}`}>
                              {s.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-full sm:w-60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-muted block mb-1">
                Filter Qari:
              </span>
              <div className="relative">
                <Search className="w-4 h-4 text-earth-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchReciter}
                  onChange={(e) => setSearchReciter(e.target.value)}
                  placeholder="Search Qari..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gold/30 text-xs sm:text-sm outline-none focus:border-gold shadow-sm h-11"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredReciters.map((reciter) => (
          <motion.div
            key={reciter.id}
            whileHover={{ y: -3 }}
            className="p-5 sm:p-6 rounded-3xl bg-white/85 border border-gold/25 shadow-sm hover:shadow-md hover:border-gold transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={reciter.photo}
                alt={reciter.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-gold/30 shadow-md flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-base sm:text-lg text-earth-text leading-tight truncate">
                  {reciter.name}
                </h3>
                <p className="text-xs text-earth-muted mt-1 leading-snug">
                  {reciter.sub}
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold-dark border border-gold/25">
                  Studio Audio
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gold/15 flex items-center justify-between gap-2">
              <div className="min-w-0 text-left">
                <span className="text-[10px] uppercase font-bold text-earth-muted block truncate">Selected Surah</span>
                <span className="text-xs font-extrabold text-gold-dark truncate block">
                  Surah {currentSelectedSurah.englishName} ({currentSelectedSurah.name})
                </span>
              </div>

              <button
                onClick={() => handlePlayReciter(reciter)}
                className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-bold shadow-md shadow-gold/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 flex-shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Listen Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});