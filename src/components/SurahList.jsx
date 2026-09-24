import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

// Memoized atomic card component prevents re-rendering all 114 items on search input changes
const SurahCard = React.memo(function SurahCard({ surah, onSelect }) {
  const handleClick = useCallback(() => {
    if (onSelect) onSelect(surah);
  }, [onSelect, surah]);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-gold/25 shadow-sm hover:shadow-md hover:border-gold transition-[border-color,box-shadow] cursor-pointer flex items-center justify-between gap-4 group min-h-[90px] will-change-transform"
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/15 text-gold-dark font-extrabold flex items-center justify-center text-sm group-hover:bg-gold group-hover:text-white transition-colors flex-shrink-0">
          {surah.number}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm sm:text-base text-earth-text group-hover:text-gold-dark transition-colors whitespace-nowrap">
            {surah.englishName}
          </h4>
          <p className="text-xs text-earth-muted whitespace-nowrap">
            {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 pl-2">
        <span className="font-arabic text-lg sm:text-2xl font-bold text-earth-text group-hover:text-gold-dark transition-colors block leading-tight">
          {surah.name}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-earth-muted font-mono block mt-0.5">
          {surah.revelationType}
        </span>
      </div>
    </motion.div>
  );
});

function SurahListComponent({ onSelectSurah }) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div className="relative w-full">
        <Search className="w-5 h-5 text-earth-muted absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Surah name, number, or translation..."
          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/90 border border-gold/30 text-sm sm:text-base text-earth-text placeholder-earth-muted/70 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 shadow-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gold-dark gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-semibold text-earth-muted">Loading Surah Directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.number}
              surah={surah}
              onSelect={onSelectSurah}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(SurahListComponent);