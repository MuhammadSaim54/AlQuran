import React, { useState, useEffect } from 'react';
import { Bookmark, BookOpen, Layers, Trash2, ArrowRight } from 'lucide-react';

export default function BookmarksView({ 
  bookmarks = [], 
  onToggleBookmark, 
  onSelectSurah,
  onOpenPage 
}) {
  const [activeBookmarkTab, setActiveBookmarkTab] = useState('pages'); // default to ribbon pages
  const [savedPages, setSavedPages] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('alquran_page_bookmarks');
      setSavedPages(stored ? JSON.parse(stored) : []);
    } catch {
      setSavedPages([]);
    }
  }, []);

  const handleDeletePageBookmark = (pageToRemove) => {
    const updated = savedPages.filter(p => p.page !== pageToRemove);
    setSavedPages(updated);
    localStorage.setItem('alquran_page_bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC8] pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C2416] tracking-tight">
            Saved Bookmarks
          </h2>
          <p className="text-xs text-[#6E624E] mt-0.5">
            Quickly return to your saved chapters and bookmarked Mushaf pages.
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-[#F2ECE1] p-1.5 rounded-2xl border border-[#E4D9C5] self-start sm:self-auto">
          <button
            onClick={() => setActiveBookmarkTab('pages')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeBookmarkTab === 'pages'
                ? 'bg-white text-[#9E7D3B] shadow-xs'
                : 'text-[#6E624E] hover:text-[#2C2416]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mushaf Ribbons ({savedPages.length})</span>
          </button>

          <button
            onClick={() => setActiveBookmarkTab('surahs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeBookmarkTab === 'surahs'
                ? 'bg-white text-[#9E7D3B] shadow-xs'
                : 'text-[#6E624E] hover:text-[#2C2416]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Surahs ({bookmarks.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SAVED MUSHAF RIBBON PAGES (ROYAL CARDS) */}
      {activeBookmarkTab === 'pages' && (
        <div>
          {savedPages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DFC8] p-6 space-y-3">
              <BookOpen className="w-10 h-10 text-[#C5A059]/40 mx-auto" />
              <h4 className="font-bold text-base text-[#2C2416]">No Mushaf Ribbons Saved</h4>
              <p className="text-xs text-[#6E624E]">
                Open any page in the Mushaf and click the top ribbon bookmark icon to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5">
              {savedPages.map((item) => (
                <div
                  key={item.page}
                  onClick={() => onOpenPage && onOpenPage(item.page)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
                >
                  {/* Left: Medallion & Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-[#F2ECE1] border border-[#E4D9C5] text-[#9E7D3B] font-mono font-black flex items-center justify-center text-xs flex-shrink-0 group-hover:bg-[#C5A059] group-hover:text-white transition-colors shadow-2xs">
                      {item.page}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#2C2416] group-hover:text-[#9E7D3B] transition-colors truncate">
                          {item.surahName}
                        </h4>
                        <span className="font-arabic text-sm text-[#9E7D3B] font-bold flex-shrink-0" dir="rtl">
                          ({item.arabicName})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E624E] mt-0.5 font-mono">
                        Page {item.page} of 604
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Delete & Jump */}
                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePageBookmark(item.page);
                      }}
                      className="p-2 text-[#6E624E] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 text-[#9E7D3B] flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED SURAHS */}
      {activeBookmarkTab === 'surahs' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DFC8] p-6 space-y-3">
              <Bookmark className="w-10 h-10 text-[#C5A059]/40 mx-auto" />
              <h4 className="font-bold text-base text-[#2C2416]">No Surah Bookmarks</h4>
              <p className="text-xs text-[#6E624E]">
                Bookmark any Surah from the directory to review it later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5">
              {bookmarks.map((surah) => (
                <div
                  key={surah.number}
                  onClick={() => onSelectSurah(surah)}
                  className="p-5 rounded-2xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#9E7D3B] font-extrabold flex items-center justify-center text-xs flex-shrink-0 group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                      {surah.number}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#2C2416] truncate">{surah.englishName}</h4>
                      <p className="text-xs text-[#6E624E] truncate">{surah.englishNameTranslation}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(surah);
                    }}
                    className="p-2 text-[#9E7D3B] hover:bg-[#C5A059]/10 rounded-xl transition-colors cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Bookmark className="w-4 h-4 fill-[#C5A059]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}