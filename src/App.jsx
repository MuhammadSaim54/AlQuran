import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Compass, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Bookmark, 
  Headphones, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'surah', label: 'Surahs', icon: Layers },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'audio', label: 'Audio', icon: Headphones },
    { id: 'compass', label: 'Qibla', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-cream text-earth-text flex flex-col justify-between selection:bg-gold/30 antialiased">
      {/* Top Navbar */}
      <header className="w-full border-b border-gold/20 backdrop-blur-md bg-cream/90 sticky top-0 z-50">
        <div className="w-full max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16 py-3.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
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

          {/* Navigation Links for Large Tablets & Desktops (lg breakpoint taake 768px tablet par squeeze na ho) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 bg-cream-dark/60 p-1.5 rounded-2xl border border-gold/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-gold-dark shadow-sm border border-gold/30' 
                      : 'text-earth-muted hover:text-earth-text hover:bg-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Qibla Direction Button */}
          <button 
            onClick={() => setActiveTab('compass')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gold/15 hover:bg-gold/25 text-gold-dark font-bold text-xs sm:text-sm border border-gold/30 transition-all cursor-pointer shadow-sm flex-shrink-0"
          >
            <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline">Qibla Direction</span>
            <span className="sm:hidden">Qibla</span>
          </button>
        </div>
      </header>

      {/* Main Fluid Container (Mobile ke liye pb-24 taake bottom dock content ko na chupaye) */}
      <main className="flex-1 w-full max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10 pb-28 md:pb-12">
        <AnimatePresence mode="wait">
          {activeTab !== 'compass' ? (
            <motion.div
              key="home-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Responsive Hero Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                {/* Last Read Banner */}
                <div className="md:col-span-7 xl:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f5ede1] via-[#f9f3ea] to-[#eeddc7] border border-gold/30 p-6 sm:p-8 xl:p-10 shadow-lg shadow-gold/5 flex flex-col justify-between">
                  <div className="absolute right-4 sm:right-8 -bottom-8 opacity-10 pointer-events-none hidden md:block">
                    <BookOpen className="w-56 h-56 xl:w-72 xl:h-72 text-gold-dark" />
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
                        Ayah No. 11 • A source of light from one Friday to the next.
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                    <button className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-xs sm:text-sm shadow-md shadow-gold/25 transition-all flex items-center gap-2 cursor-pointer">
                      Resume Reading <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs sm:text-sm font-semibold text-earth-muted">
                      110 Ayahs • Makkiyah
                    </span>
                  </div>
                </div>

                {/* Ayat of the Day Card */}
                <div className="md:col-span-5 xl:col-span-4 rounded-3xl bg-white/75 border border-gold/25 p-6 sm:p-8 xl:p-10 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3">
                    <span className="text-[11px] sm:text-xs uppercase tracking-widest font-mono text-gold-dark font-bold">Daily Insight</span>
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-bold text-earth-text">Ayat of the Day</h3>
                    <p className="text-xs sm:text-sm xl:text-base text-earth-muted leading-relaxed italic">
                      "Indeed, with hardship [will be] ease."
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gold-dark">— Surah Ash-Sharh (94:6)</p>
                  </div>

                  <div className="pt-5 border-t border-gold/15 flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-earth-muted font-medium">Ready to explore more?</span>
                    <button className="flex items-center gap-1 text-xs sm:text-sm font-bold text-gold-dark hover:text-earth-text transition-colors">
                      Explore <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Universal Search Bar */}
              <div className="relative w-full">
                <Search className="w-5 h-5 text-earth-muted absolute left-5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search Surah by name, number, or translation..."
                  className="w-full pl-14 pr-6 py-3.5 sm:py-4 xl:py-5 rounded-2xl bg-white/80 border border-gold/30 text-sm sm:text-base xl:text-lg text-earth-text placeholder-earth-muted/80 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 shadow-sm transition-all"
                />
              </div>

              {/* Wide Responsive Action Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 xl:gap-6">
                {[
                  { title: 'Surah Index', count: '114 Surahs', icon: Layers },
                  { title: 'Juz / Paras', count: '30 Parts', icon: BookOpen },
                  { title: 'Saved Bookmarks', count: 'Saved Verses', icon: Bookmark },
                  { title: 'Tilawat Reciters', count: 'Audio Library', icon: Headphones },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div 
                      key={item.title}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 sm:p-6 rounded-2xl bg-white/80 border border-gold/25 shadow-sm hover:shadow-md hover:border-gold transition-all cursor-pointer flex flex-col justify-between min-h-[110px] sm:min-h-[140px]"
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
            </motion.div>
          ) : (
            <motion.div
              key="compass-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-16 text-center space-y-4 max-w-xl mx-auto"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gold/15 flex items-center justify-center text-gold-dark mb-4">
                <Compass className="w-10 h-10 animate-spin-slow" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-earth-text">Qibla Direction Compass</h2>
              <p className="text-sm text-earth-muted">
                Geolocation coordinates aur device sensors ko sync karke Qibla angle calculate kiya ja raha hai...
              </p>
              <button 
                onClick={() => setActiveTab('home')}
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Dock: Phone aur Tablet (iPad) dono par visible rahega jab tak screen 'lg' (1024px+) na ho */}
      <nav className="lg:hidden w-full border-t border-gold/20 bg-cream/95 backdrop-blur-md py-2.5 px-4 fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors ${
                  isActive ? 'text-gold-dark font-bold' : 'text-earth-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}