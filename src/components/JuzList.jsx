import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { JUZ_LIST } from '../data/juzData';
import MushafViewer from './MushafViewer';

export default function JuzList({ onBackToHome }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJuz, setSelectedJuz] = useState(null);

  const filteredJuz = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return JUZ_LIST;
    return JUZ_LIST.filter(juz => 
      juz.id.toString() === q ||
      juz.name.includes(q) ||
      juz.englishName.toLowerCase().includes(q) ||
      juz.startSurah.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleOpenJuz = useCallback((juz) => {
    setSelectedJuz(juz);
  }, []);

  const handleCloseJuz = useCallback(() => {
    setSelectedJuz(null);
  }, []);

  if (selectedJuz) {
    return (
      <div className="space-y-4 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-3.5 w-full">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gold/15 text-gold-dark font-extrabold flex items-center justify-center text-xs sm:text-sm font-mono flex-shrink-0">
              {selectedJuz.id}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h2 className="font-bold text-lg sm:text-2xl text-earth-text tracking-tight">
                  {selectedJuz.englishName}
                </h2>
                <span className="font-arabic text-lg sm:text-2xl text-gold-dark font-bold" dir="rtl">
                  ({selectedJuz.name})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-earth-muted">
                Starts at Surah {selectedJuz.startSurah} ({selectedJuz.startAyah}) • Page {selectedJuz.startPage}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-[11px] sm:text-xs font-bold uppercase tracking-wider font-mono border border-gold/30">
            JUZ {selectedJuz.id} OF 30
          </span>
        </div>

        <MushafViewer
          initialPageOverride={selectedJuz.startPage}
          onBack={handleCloseJuz}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* Search Input matching SurahList */}
      <div className="relative w-full">
        <Search className="w-5 h-5 text-earth-muted absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name (e.g. Alif-Laam-Meem), number, or Surah..."
          className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl bg-white/90 border border-gold/30 text-xs sm:text-base text-earth-text placeholder-earth-muted/70 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 shadow-sm transition-all"
        />
      </div>

      {/* 30 Paras Cards with Exact SurahCard Font & Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
        {filteredJuz.map((juz) => (
          <motion.div
            key={juz.id}
            layout="position"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenJuz(juz)}
            className="p-4 sm:p-5 rounded-2xl bg-white/85 border border-gold/25 shadow-sm hover:shadow-md hover:border-gold transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[90px] w-full group"
          >
            {/* Left: Medallion Number & Clean Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gold/15 text-gold-dark font-extrabold flex items-center justify-center text-xs sm:text-sm font-mono flex-shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                {juz.id}
              </div>
              <div className="min-w-0 flex-1">
                {/* Exact font styling from your SurahCard screenshot */}
                <h4 className="font-bold text-sm sm:text-base text-earth-text leading-tight truncate">
                  {juz.englishName}
                </h4>
                <p className="text-[11px] sm:text-xs text-earth-muted mt-0.5 leading-tight truncate">
                  Starts at: {juz.startSurah} ({juz.startAyah}) • Page {juz.startPage}
                </p>
              </div>
            </div>

            {/* Right: Traditional Arabic Calligraphy */}
            <div className="flex items-center gap-2.5 flex-shrink-0 pl-2">
              <div className="text-right">
                <span 
                  className="font-arabic text-lg sm:text-xl font-bold text-earth-text block leading-tight group-hover:text-gold-dark transition-colors"
                  dir="rtl"
                >
                  {juz.name}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-earth-muted font-mono block mt-0.5">
                  Part {juz.id}
                </span>
              </div>

              <div className="w-8 h-8 rounded-xl bg-gold/10 text-gold-dark flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}