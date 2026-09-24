import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  Bookmark, 
  Headphones, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import SurahList, { RECITERS_LIST } from './components/SurahList';
import QiblaCompass from './components/QiblaCompass';
import AudioPlayer from './components/AudioPlayer';
import AudioLibrary from './components/AudioLibrary';
import BookmarksView from './components/BookmarksView';

const FeaturedSurahCard = React.memo(function FeaturedSurahCard({ surah, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-4 sm:p-5 rounded-2xl bg-white/85 border border-gold/25 shadow-sm hover:border-gold transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[90px] w-full"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark font-extrabold flex items-center justify-center text-xs flex-shrink-0">
          {surah.number}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm sm:text-base text-earth-text leading-tight truncate">
            {surah.name}
          </h4>
          <p className="text-[11px] sm:text-xs text-earth-muted mt-0.5 leading-tight truncate">
            {surah.english} • {surah.ayahs} Ayahs
          </p>
        </div>
      </div>
      <span className="font-arabic text-lg sm:text-xl font-bold text-earth-text flex-shrink-0 pl-2">
        {surah.arabic}
      </span>
    </motion.div>
  );
});

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [surahs, setSurahs] = useState([]);
  const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
  
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('alquran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setSurahs(data.data);
        }
      })
      .catch((e) => console.error("Surahs fetch error:", e));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('alquran_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to sync bookmarks:', e);
    }
  }, [bookmarks]);

  const toggleBookmark = useCallback((surah) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.number === surah.number);
      if (exists) {
        return prev.filter((b) => b.number !== surah.number);
      } else {
        return [...prev, surah];
      }
    });
  }, []);

  const removeBookmark = useCallback((surahNumber) => {
    setBookmarks((prev) => prev.filter((b) => b.number !== surahNumber));
  }, []);

  const bookmarkedIds = useMemo(() => bookmarks.map((b) => b.number), [bookmarks]);

  const navItems = useMemo(() => [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'surah', label: 'Surahs', icon: Layers },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, badge: bookmarks.length || null },
    { id: 'audio', label: 'Audio', icon: Headphones },
    { id: 'compass', label: 'Qibla', icon: Compass },
  ], [bookmarks.length]);

  const featuredSurahs = useMemo(() => [
    { number: 1, name: "Al-Fatihah", english: "The Opening", ayahs: 7, arabic: "الفاتحة" },
    { number: 36, name: "Yaseen", english: "Ya-Seen", ayahs: 83, arabic: "يس" },
    { number: 55, name: "Ar-Rahman", english: "The Beneficent", ayahs: 78, arabic: "الرحمن" },
    { number: 67, name: "Al-Mulk", english: "The Sovereignty", ayahs: 30, arabic: "الملك" },
  ], []);

  const handleTabSwitch = useCallback((id) => {
    setActiveTab(id);
  }, []);

  const handlePlayTrack = useCallback((track) => {
    setCurrentTrack(track);
  }, []);

  const handleChangeQari = useCallback((newReciter) => {
    if (!currentTrack) return;
    const newUrl = newReciter.getAudioUrl(currentTrack.surahNumber);
    if (newUrl) {
      setCurrentTrack({
        ...currentTrack,
        reciterName: newReciter.name,
        reciterId: newReciter.id,
        reciterImage: newReciter.photo,
        audioUrl: newUrl
      });
    }
  }, [currentTrack]);

  const handleNextTrack = useCallback(() => {
    if (!currentTrack || !surahs.length) return;
    const currentNum = currentTrack.surahNumber;
    const nextNum = currentNum < 114 ? currentNum + 1 : 1;
    const nextSurah = surahs.find(s => s.number === nextNum);
    const reciter = RECITERS_LIST.find(r => r.id === currentTrack.reciterId) || RECITERS_LIST[0];

    if (nextSurah) {
      setCurrentTrack({
        surahNumber: nextSurah.number,
        surahName: nextSurah.englishName,
        arabicName: nextSurah.name,
        reciterName: reciter.name,
        reciterId: reciter.id,
        reciterImage: reciter.photo,
        audioUrl: reciter.getAudioUrl(nextSurah.number)
      });
    }
  }, [currentTrack, surahs]);

  const handlePrevTrack = useCallback(() => {
    if (!currentTrack || !surahs.length) return;
    const currentNum = currentTrack.surahNumber;
    const prevNum = currentNum > 1 ? currentNum - 1 : 114;
    const prevSurah = surahs.find(s => s.number === prevNum);
    const reciter = RECITERS_LIST.find(r => r.id === currentTrack.reciterId) || RECITERS_LIST[0];

    if (prevSurah) {
      setCurrentTrack({
        surahNumber: prevSurah.number,
        surahName: prevSurah.englishName,
        arabicName: prevSurah.name,
        reciterName: reciter.name,
        reciterId: reciter.id,
        reciterImage: reciter.photo,
        audioUrl: reciter.getAudioUrl(prevSurah.number)
      });
    }
  }, [currentTrack, surahs]);

  return (
    <div className="min-h-screen bg-cream text-earth-text flex flex-col justify-between selection:bg-gold/30 antialiased overflow-x-hidden">
      {/* Top Navbar */}
      <header className="w-full border-b border-gold/20 backdrop-blur-md bg-cream/90 sticky top-0 z-30">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 cursor-pointer" onClick={() => handleTabSwitch('home')}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white shadow-md shadow-gold/20 flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-earth-text uppercase font-sans leading-none">
                Al <span className="text-gold-dark">Quran</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-earth-muted font-mono tracking-widest mt-0.5 sm:mt-1">SPIRITUAL COMPANION</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 bg-cream-dark/60 p-1.5 rounded-2xl border border-gold/20 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSwitch(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs xl:text-sm font-bold transition-colors cursor-pointer z-10 ${
                    isActive ? 'text-gold-dark' : 'text-earth-muted hover:text-earth-text'
                  }`}
                >
                  <Icon className="w-4 h-4 z-10" />
                  <span className="z-10">{item.label}</span>
                  {item.badge ? (
                    <span className="z-10 px-1.5 py-0.2 rounded-full text-[10px] bg-gold text-white font-mono">
                      {item.badge}
                    </span>
                  ) : null}

                  {isActive && (
                    <motion.div
                      layoutId="desktopActivePill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gold/30 z-0"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => handleTabSwitch('compass')}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gold/15 hover:bg-gold/25 text-gold-dark font-bold text-xs sm:text-sm border border-gold/30 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Qibla Direction</span>
              <span className="sm:hidden">Qibla</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 pb-44 lg:pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="space-y-6 sm:space-y-8 lg:space-y-10"
            >
              {/* Hero Banner Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                <div className="md:col-span-7 xl:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f5ede1] via-[#f9f3ea] to-[#eeddc7] border border-gold/30 p-6 sm:p-8 xl:p-10 shadow-lg shadow-gold/5 flex flex-col justify-between min-h-[220px]">
                  <div className="absolute right-4 sm:right-8 -bottom-8 opacity-10 pointer-events-none hidden md:block">
                    <BookOpen className="w-64 h-64 xl:w-80 xl:h-80 text-gold-dark" />
                  </div>

                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gold/20 text-gold-dark text-xs sm:text-sm font-bold tracking-wide">
                      <Sparkles className="w-3.5 h-3.5" /> Continue Reading
                    </span>
                    <div>
                      <h2 className="text-2xl sm:text-3xl xl:text-5xl font-extrabold text-earth-text tracking-tight">
                        Surah Al-Kahf
                      </h2>
                      <p className="text-xs sm:text-sm xl:text-base text-earth-muted mt-2 max-w-xl">
                        Ayah No. 11 • A divine light guiding from one Friday to the next.
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                    <button 
                      onClick={() => handleTabSwitch('surah')}
                      className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-xs sm:text-sm shadow-md shadow-gold/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      Browse Surahs <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-earth-muted">
                      110 Ayahs • Makkiyah
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5 xl:col-span-4 rounded-3xl bg-white/75 border border-gold/25 p-6 sm:p-8 xl:p-10 flex flex-col justify-between shadow-sm min-h-[220px]">
                  <div className="space-y-3">
                    <span className="text-[11px] sm:text-xs uppercase tracking-widest font-mono text-gold-dark font-bold">Daily Insight</span>
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-bold text-earth-text">Ayat of the Day</h3>
                    <p className="text-xs sm:text-sm xl:text-base text-earth-muted leading-relaxed italic">
                      "Indeed, with hardship [will be] ease."
                    </p>
                    <p className="text-xs font-semibold text-gold-dark">— Surah Ash-Sharh (94:6)</p>
                  </div>

                  <div className="pt-5 border-t border-gold/15 flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-earth-muted font-medium">Ready to explore more?</span>
                    <button 
                      onClick={() => handleTabSwitch('surah')}
                      className="flex items-center gap-1 text-xs sm:text-sm font-bold text-gold-dark hover:text-earth-text transition-colors cursor-pointer"
                    >
                      Explore <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Category Cards */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 xl:gap-6">
                {[
                  { title: 'Surah Index', count: '114 Surahs', icon: Layers, tab: 'surah' },
                  { title: 'Juz / Paras', count: '30 Parts', icon: BookOpen, tab: 'surah' },
                  { title: 'Saved Bookmarks', count: `${bookmarks.length} Verses`, icon: Bookmark, tab: 'bookmarks' },
                  { title: 'Tilawat Reciters', count: 'Audio Library', icon: Headphones, tab: 'audio' },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div 
                      key={item.title}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTabSwitch(item.tab)}
                      className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-gold/25 shadow-sm hover:shadow-md hover:border-gold transition-all cursor-pointer flex flex-col justify-between min-h-[120px] sm:min-h-[145px]"
                    >
                      <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark mb-3">
                        <ItemIcon className="w-5 h-5 xl:w-6 xl:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base xl:text-lg text-earth-text">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-earth-muted mt-0.5">{item.count}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Frequently Recited Surahs */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-earth-text tracking-tight">Frequently Recited Surahs</h3>
                    <p className="text-xs sm:text-sm text-earth-muted">Quick access to essential daily recitations.</p>
                  </div>
                  <button 
                    onClick={() => handleTabSwitch('surah')}
                    className="flex items-center gap-1 text-xs sm:text-sm font-bold text-gold-dark hover:text-earth-text transition-colors cursor-pointer"
                  >
                    View All 114 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                  {featuredSurahs.map((surah) => (
                    <FeaturedSurahCard
                      key={surah.number}
                      surah={surah}
                      onClick={() => handleTabSwitch('surah')}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'surah' && (
            <motion.div
              key="surah"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-3xl font-extrabold text-earth-text">Surah Index</h2>
                <span className="text-xs sm:text-sm font-semibold text-earth-muted font-mono">114 Chapters</span>
              </div>
              <SurahList 
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
                onPlayTrack={handlePlayTrack}
                onModalStateChange={(isOpen) => setIsSurahModalOpen(isOpen)}
              />
            </motion.div>
          )}

          {activeTab === 'compass' && (
            <motion.div
              key="compass"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <QiblaCompass />
            </motion.div>
          )}

          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <BookmarksView 
                bookmarks={bookmarks}
                onRemoveBookmark={removeBookmark}
                onNavigateToSurah={() => handleTabSwitch('surah')}
              />
            </motion.div>
          )}

          {activeTab === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <AudioLibrary 
                surahs={surahs}
                onPlayRecitation={(track) => setCurrentTrack(track)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Global Floating Audio Player with Modal Collapsing State */}
      <AudioPlayer 
        currentTrack={currentTrack}
        onClose={() => setCurrentTrack(null)}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
        isAutoplay={isAutoplay}
        setIsAutoplay={setIsAutoplay}
        onChangeQari={handleChangeQari}
        isModalOpen={isSurahModalOpen}
      />

      {/* Mobile Bottom Dock */}
      <nav className="lg:hidden w-full border-t border-gold/20 bg-cream/95 backdrop-blur-md py-2 px-3 fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => handleTabSwitch(item.id)}
                className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-semibold cursor-pointer transition-colors ${
                  isActive ? 'text-gold-dark font-bold' : 'text-earth-muted'
                }`}
              >
                <Icon className="w-5 h-5 z-10" />
                <span className="z-10">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="mobileActivePill"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className="absolute inset-0 bg-gold/15 rounded-xl border border-gold/30 z-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}