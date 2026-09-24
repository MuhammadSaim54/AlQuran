import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkX, BookOpen, ChevronRight } from 'lucide-react';

export default React.memo(function BookmarksView({ bookmarks, onRemoveBookmark, onNavigateToSurah }) {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-gold/15 text-gold-dark flex items-center justify-center mx-auto shadow-sm">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-earth-text">No Saved Bookmarks Yet</h3>
        <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
          You can bookmark any Surah from the Surah Index to quickly resume your reading session here.
        </p>
        <button
          onClick={() => onNavigateToSurah && onNavigateToSurah()}
          className="px-6 py-3 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-xs shadow-md shadow-gold/25 transition-all cursor-pointer"
        >
          Browse Surahs Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-earth-text">Saved Bookmarks</h2>
          <p className="text-xs sm:text-sm text-earth-muted">Quick access to your pinned chapters and daily study verses.</p>
        </div>
        <span className="text-xs font-mono font-bold text-gold-dark bg-gold/15 px-3 py-1.5 rounded-xl border border-gold/25">
          {bookmarks.length} Saved
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {bookmarks.map((surah) => (
          <motion.div
            key={surah.number}
            whileHover={{ y: -3 }}
            className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-gold/30 shadow-sm flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gold/15 text-gold-dark font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                {surah.number}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm sm:text-base text-earth-text truncate">{surah.englishName}</h4>
                <p className="text-xs text-earth-muted truncate">
                  {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onRemoveBookmark(surah.number)}
                title="Remove Bookmark"
                className="p-2 rounded-xl text-earth-muted hover:text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <BookmarkX className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateToSurah && onNavigateToSurah(surah)}
                className="p-2 rounded-xl bg-gold/15 text-gold-dark hover:bg-gold hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});