import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Layers, CornerDownLeft, Sparkles, X } from 'lucide-react';
import { SURAH_METADATA } from './MushafViewer';
import { JUZ_LIST } from '../data/juzData';

export default function SpotlightJump({ isOpen, onClose, onJumpToPage, onSelectSurah }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const isNumeric = /^\d+$/.test(q);
    const numVal = parseInt(q, 10);

    const results = [];

    // Direct page match
    if (isNumeric && numVal >= 1 && numVal <= 604) {
      results.push({
        type: 'page',
        title: `Jump to Page ${numVal}`,
        subtitle: `Mushaf 16-Line Original Page ${numVal} of 604`,
        page: numVal
      });
    }

    // Surah matches
    SURAH_METADATA.forEach(s => {
      if (
        s.num.toString() === q ||
        s.name.toLowerCase().includes(q) ||
        s.ar.includes(q)
      ) {
        results.push({
          type: 'surah',
          title: `Surah ${s.name} (${s.ar})`,
          subtitle: `Chapter #${s.num} • Starts at Page ${s.start}`,
          surahNum: s.num,
          page: s.start
        });
      }
    });

    // Juz matches
    JUZ_LIST.forEach(j => {
      if (
        j.id.toString() === q ||
        j.englishName.toLowerCase().includes(q) ||
        j.name.includes(q)
      ) {
        results.push({
          type: 'juz',
          title: `Para ${j.id}: ${j.englishName} (${j.name})`,
          subtitle: `Starts at ${j.startSurah} • Page ${j.startPage}`,
          page: j.startPage
        });
      }
    });

    return results.slice(0, 7);
  }, [query]);

  const handleExecute = (item) => {
    if (item.type === 'page' || item.type === 'juz') {
      onJumpToPage(item.page);
    } else if (item.type === 'surah') {
      onJumpToPage(item.page);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-xl bg-[#FAF7F2] border-2 border-[#C5A059]/40 shadow-2xl rounded-3xl overflow-hidden text-[#2C2416]"
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#E8DFC8] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#9E7D3B]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                handleExecute(searchResults[0]);
              }
              if (e.key === 'Escape') {
                onClose();
              }
            }}
            placeholder="Type page number (1-604), Surah name, or Para..."
            className="w-full bg-transparent text-sm sm:text-base text-[#2C2416] placeholder-[#6E624E]/60 outline-none font-medium"
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#F2ECE1] text-[#6E624E]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1.5">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleExecute(item)}
                className="w-full p-3 rounded-2xl bg-white hover:bg-[#F2ECE1] border border-[#E8DFC8] hover:border-[#C5A059] flex items-center justify-between transition-all text-left cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 text-[#9E7D3B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                    {item.type === 'page' ? <Book className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-[#2C2416] truncate">{item.title}</h5>
                    <p className="text-[10px] sm:text-[11px] text-[#6E624E] truncate">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#9E7D3B] font-mono opacity-80 group-hover:opacity-100 flex-shrink-0">
                  <span>Jump</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          ) : query ? (
            <div className="py-10 text-center text-xs text-[#6E624E]">
              No direct matches found. Try entering a page number like <strong className="text-[#9E7D3B]">293</strong> or <strong className="text-[#9E7D3B]">Yaseen</strong>.
            </div>
          ) : (
            <div className="py-6 px-4 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9E7D3B]">
                Quick Jump Shortcuts:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => { setQuery('1'); }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] text-[#2C2416] cursor-pointer"
                >
                  Page 1 (Al-Faatiha)
                </button>
                <button
                  onClick={() => { setQuery('Kahf'); }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] text-[#2C2416] cursor-pointer"
                >
                  Surah Al-Kahf
                </button>
                <button
                  onClick={() => { setQuery('Yaseen'); }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] text-[#2C2416] cursor-pointer"
                >
                  Surah Yaseen
                </button>
                <button
                  onClick={() => { setQuery('Para 30'); }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] text-[#2C2416] cursor-pointer"
                >
                  Juz Amma (Para 30)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Helper */}
        <div className="p-3 bg-[#F2ECE1]/60 border-t border-[#E8DFC8] flex items-center justify-between text-[10px] font-mono text-[#6E624E]">
          <span>Press ESC to exit</span>
          <span>Tip: Press <strong>Ctrl + K</strong> anywhere</span>
        </div>
      </motion.div>
    </div>
  );
}