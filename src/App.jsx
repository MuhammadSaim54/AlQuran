import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  BookOpen, 
  Compass, 
  Bookmark, 
  Layers, 
  Headphones, 
  Sparkles, 
  ArrowRight, 
  Radio, 
  Share2, 
  Check, 
  Play,
  RotateCcw,
  BookMarked,
  Search,
  BookCheck,
  Download
} from 'lucide-react';

import SurahListComponent, { RECITERS_LIST } from './components/SurahList';
import JuzList from './components/JuzList';
import AudioLibrary from './components/AudioLibrary';
import AudioPlayer from './components/AudioPlayer';
import BookmarksView from './components/BookmarksView';
import QiblaCompass from './components/QiblaCompass';
import OnboardingLanding from './components/OnboardingLanding';
import MushafViewer, { getSurahInfoByPage } from './components/MushafViewer';
import SpotlightJump from './components/SpotlightJump';
import TajweedGuide from './components/TajweedGuide';

const DAILY_AYAHS = [
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Unquestionably, by the remembrance of Allah hearts are assured.",
    surah: "Ar-Ra'd",
    ayahRef: "13:28"
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    surah: "Ash-Sharh",
    ayahRef: "94:5-6"
  },
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
    translation: "And when My servants ask you concerning Me, indeed I am near.",
    surah: "Al-Baqara",
    ayahRef: "2:186"
  },
  {
    arabic: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ",
    translation: "And rely upon the Ever-Living who does not die.",
    surah: "Al-Furqaan",
    ayahRef: "25:58"
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and save us from the punishment of the Fire.",
    surah: "Al-Baqara",
    ayahRef: "2:201"
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Indeed, Allah is with the patient.",
    surah: "Al-Baqara",
    ayahRef: "2:153"
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
    surah: "Aal-i-Imraan",
    ayahRef: "3:173"
  }
];

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('alquran_has_onboarded') === 'true';
  });

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'surahs' | 'juz' | 'tajweed' | 'audio' | 'bookmarks' | 'qibla'
  const [copiedAyat, setCopiedAyat] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [targetResumePage, setTargetResumePage] = useState(null);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Persistent Last Read State
  const [lastReadSession, setLastReadSession] = useState(() => {
    try {
      const saved = localStorage.getItem('alquran_last_read');
      if (saved) return JSON.parse(saved);
      const initial = getSurahInfoByPage(1);
      return {
        page: 1,
        surahNumber: initial.num,
        surahName: initial.name,
        arabicName: initial.ar,
        timestamp: Date.now()
      };
    } catch {
      return { page: 1, surahNumber: 1, surahName: "Al-Faatiha", arabicName: "الفاتحة", timestamp: Date.now() };
    }
  });

  const [bookmarkedSurahs, setBookmarkedSurahs] = useState(() => {
    try {
      const saved = localStorage.getItem('alquran_surah_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Global Ctrl + K / Cmd + K Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const todayAyat = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
  }, []);

  const handleToggleBookmark = useCallback((surah) => {
    setBookmarkedSurahs((prev) => {
      const exists = prev.some((s) => s.number === surah.number);
      const updated = exists 
        ? prev.filter((s) => s.number !== surah.number) 
        : [...prev, surah];
      try {
        localStorage.setItem('alquran_surah_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.error('LocalStorage error:', e);
      }
      return updated;
    });
  }, []);

  const bookmarkedIds = useMemo(() => {
    return bookmarkedSurahs.map((s) => s.number);
  }, [bookmarkedSurahs]);

  const handlePlayTrack = useCallback((trackData) => {
    setCurrentTrack(trackData);
  }, []);

  const handleCloseAudio = useCallback(() => {
    setCurrentTrack(null);
  }, []);

  const handleShareAyat = () => {
    const text = `"${todayAyat.arabic}"\n${todayAyat.translation} - [Surah ${todayAyat.surah} ${todayAyat.ayahRef}]`;
    navigator.clipboard.writeText(text);
    setCopiedAyat(true);
    setTimeout(() => setCopiedAyat(false), 2000);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('alquran_has_onboarded', 'true');
    setHasOnboarded(true);
  };

  const handleTriggerResume = (pageToLoad) => {
    const pg = pageToLoad || lastReadSession?.page || 1;
    setTargetResumePage(pg);
    setActiveTab('directMushaf');
  };

  if (!hasOnboarded) {
    return <OnboardingLanding onComplete={handleCompleteOnboarding} />;
  }

  const readPercentage = Math.min(100, Math.max(1, Math.round(((lastReadSession?.page || 1) / 604) * 100)));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2416] flex flex-col font-sans selection:bg-[#C5A059]/20 selection:text-[#9E7D3B]">
      
      {/* Top Navbar: Clean 4 Tabs - No Squeeze on 768px */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/70 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-[#F2ECE1] border border-[#E4D9C5] flex items-center justify-center text-[#9E7D3B] group-hover:scale-105 transition-transform shadow-xs">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif font-black text-base sm:text-xl text-[#2B2317] tracking-tight leading-none whitespace-nowrap">
                AL QURAN
              </h1>
              <span className="text-[8.5px] sm:text-[9.5px] uppercase font-mono tracking-[0.16em] text-[#9E7D3B] font-extrabold mt-1 whitespace-nowrap">
                SPIRITUAL COMPANION
              </span>
            </div>
          </div>

          {/* Clean 4 Desktop/Tablet Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#F2ECE1]/80 p-1.5 rounded-2xl border border-[#E4D9C5] flex-shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'home' 
                  ? 'bg-white text-[#9E7D3B] shadow-xs' 
                  : 'text-[#6E624E] hover:text-[#2C2416]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('surahs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'surahs' 
                  ? 'bg-white text-[#9E7D3B] shadow-xs' 
                  : 'text-[#6E624E] hover:text-[#2C2416]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Surahs</span>
            </button>

            <button
              onClick={() => setActiveTab('juz')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'juz' 
                  ? 'bg-white text-[#9E7D3B] shadow-xs' 
                  : 'text-[#6E624E] hover:text-[#2C2416]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Paras</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'audio' 
                  ? 'bg-white text-[#9E7D3B] shadow-xs' 
                  : 'text-[#6E624E] hover:text-[#2C2416]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Audio</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'bookmarks' 
                  ? 'bg-white text-[#9E7D3B] shadow-xs' 
                  : 'text-[#6E624E] hover:text-[#2C2416]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Saved</span>
              {bookmarkedSurahs.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C5A059] text-white text-[9px] flex items-center justify-center font-mono">
                  {bookmarkedSurahs.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {deferredPrompt && (
              <button
                onClick={handleInstallApp}
                className="px-2.5 sm:px-3 py-2 rounded-2xl bg-[#C5A059] hover:bg-[#9E7D3B] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Install App"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            <button
              onClick={() => setIsSpotlightOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#F2ECE1] hover:bg-[#E8DFC8] border border-[#E4D9C5] text-[#9E7D3B] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Search and Jump (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setActiveTab('qibla')}
              className="px-2.5 sm:px-3.5 py-2 rounded-2xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#9E7D3B] border border-[#C5A059]/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-2xs flex-shrink-0"
              title="Qibla Direction"
            >
              <Compass className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xl:inline whitespace-nowrap">Qibla Direction</span>
              <span className="hidden sm:inline xl:hidden whitespace-nowrap">Qibla</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-8 py-5 sm:py-7">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Grand Hero */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#F5EFE4] via-[#FAF7F2] to-[#ECE2CF] border border-[#E4D9C5] p-5 sm:p-10 shadow-sm">
              <div 
                className="absolute right-3 sm:right-10 -bottom-10 sm:-bottom-8 font-arabic text-8xl sm:text-[160px] text-[#C5A059]/10 select-none pointer-events-none font-bold leading-none"
                dir="rtl"
              >
                القرآن
              </div>

              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/35 text-[#9E7D3B] text-[11px] font-mono font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 fill-[#C5A059]" />
                  <span>The Noble Quran Online</span>
                </div>

                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#2B2317] tracking-tight leading-[1.18]">
                  Read, Listen & Explore the Holy Quran
                </h2>

                <p className="text-xs sm:text-base text-[#6E624E] leading-relaxed max-w-xl">
                  Immerse yourself in authentic 16-Line Indo-Pak Mushaf folios, crystal-clear studio audio recitations by world-renowned Qaris, and seamless chapter navigation.
                </p>

                {/* Hero Action Buttons - Responsive Row / Grid (Image 2 Fix) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2 max-w-xl">
                  <button 
                    onClick={() => setActiveTab('surahs')}
                    className="w-full py-3 px-4 rounded-2xl bg-[#C5A059] hover:bg-[#9E7D3B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#C5A059]/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 flex-shrink-0" /> 
                    <span>Browse Surahs</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('juz')}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#F2ECE1] text-[#2C2416] border border-[#E4D9C5] text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-[#9E7D3B] flex-shrink-0" /> 
                    <span>Open 30 Paras</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('tajweed')}
                    className="w-full py-3 px-4 rounded-2xl bg-[#F2ECE1] hover:bg-[#E8DFC8] text-[#9E7D3B] border border-[#E4D9C5] text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <BookCheck className="w-4 h-4 text-[#9E7D3B] flex-shrink-0" /> 
                    <span>Tajweed Rules</span>
                  </button>
                </div>
              </div>
            </div>

            {/* FULLY RESPONSIVE LAST READ CARD (Image 3 Fix: No Cuts) */}
            <div className="w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#211A12] via-[#2A2218] to-[#1C160F] border border-[#C5A059]/40 p-4 sm:p-6 shadow-md text-[#FAF7F2]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#382C1E] border border-[#C5A059]/50 flex items-center justify-center text-[#F7E7B4] flex-shrink-0 shadow-xs">
                    <BookMarked className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#C5A059]">
                        Last Read Session
                      </span>
                      <span className="text-[10px] text-[#A69986] font-mono whitespace-nowrap">
                        • Page {lastReadSession?.page || 1} of 604 ({readPercentage}%)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                      <h4 className="font-bold text-base sm:text-lg text-white">
                        {lastReadSession?.surahName || "Al-Faatiha"}
                      </h4>
                      <span className="font-arabic text-base sm:text-lg font-bold text-[#C5A059]" dir="rtl">
                        ({lastReadSession?.arabicName || "الفاتحة"})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => handleTriggerResume(lastReadSession?.page || 1)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#9E7D3B] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4 flex-shrink-0" />
                    <span>Resume Page {lastReadSession?.page || 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                </div>

              </div>

              {/* Progress Line */}
              <div className="mt-3.5 pt-2.5 border-t border-[#C5A059]/20 flex items-center gap-3 text-[10px] font-mono text-[#D4C3A3]">
                <span className="whitespace-nowrap">Al-Faatiha (1)</span>
                <div className="flex-1 h-1.5 bg-[#3B2F21] rounded-full overflow-hidden min-w-[60px]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#F7E7B4] rounded-full transition-all duration-300"
                    style={{ width: `${readPercentage}%` }}
                  />
                </div>
                <span className="whitespace-nowrap">An-Naas (604)</span>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              <div 
                onClick={() => setActiveTab('surahs')}
                className="p-5 rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] shadow-2xs hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#F2ECE1] text-[#9E7D3B] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#2C2416]">Surah Index</h3>
                <p className="text-xs text-[#6E624E] mt-0.5 font-medium">114 Chapters</p>
              </div>

              <div 
                onClick={() => setActiveTab('juz')}
                className="p-5 rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] shadow-2xs hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#F2ECE1] text-[#9E7D3B] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#2C2416]">Juz / Paras</h3>
                <p className="text-xs text-[#6E624E] mt-0.5 font-medium">30 Parts</p>
              </div>

              <div 
                onClick={() => setActiveTab('tajweed')}
                className="p-5 rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] shadow-2xs hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#F2ECE1] text-[#9E7D3B] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-xs">
                  <BookCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#2C2416]">Tajweed Guide</h3>
                <p className="text-xs text-[#6E624E] mt-0.5 font-medium">Color-Coded Qawaid</p>
              </div>

              <div 
                onClick={() => setActiveTab('bookmarks')}
                className="p-5 rounded-3xl bg-white border border-[#E8DFC8] hover:border-[#C5A059] shadow-2xs hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#F2ECE1] text-[#9E7D3B] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-xs">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#2C2416]">Bookmarks</h3>
                <p className="text-xs text-[#6E624E] mt-0.5 font-medium">{bookmarkedSurahs.length} Saved</p>
              </div>
            </div>

            {/* Daily Ayat */}
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-white via-[#FCFAF6] to-[#F5ECE0] border-2 border-[#C5A059]/40 p-6 sm:p-9 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C5A059]/20 pb-4">
                <div className="flex items-center gap-2 text-[#9E7D3B]">
                  <Sparkles className="w-4 h-4 fill-[#C5A059]" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase">
                    Ayat of the Day • Daily Inspiration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#9E7D3B] text-[11px] font-mono font-bold border border-[#C5A059]/30">
                    Surah {todayAyat.surah} • {todayAyat.ayahRef}
                  </span>
                  <button
                    onClick={handleShareAyat}
                    className="p-1.5 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#E4D9C5] text-[#9E7D3B] transition-colors cursor-pointer"
                    title="Copy Ayat"
                  >
                    {copiedAyat ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="my-6 text-center space-y-4">
                <p 
                  className="font-arabic text-2xl sm:text-4xl text-[#2B2317] font-black leading-relaxed tracking-normal select-text"
                  dir="rtl"
                >
                  {todayAyat.arabic}
                </p>
                <p className="text-xs sm:text-base text-[#6E624E] italic font-serif max-w-2xl mx-auto leading-relaxed">
                  "{todayAyat.translation}"
                </p>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={() => setActiveTab('surahs')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9E7D3B] hover:text-[#2C2416] transition-colors cursor-pointer"
                >
                  <span>Read Full Chapter in Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Famous Qaris Showcase */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2B2317] tracking-tight flex items-center gap-2">
                    <Radio className="w-5 h-5 text-[#9E7D3B]" />
                    <span>Listen Famous Qaris</span>
                  </h3>
                  <p className="text-xs text-[#6E624E] mt-0.5">
                    Studio-recorded Murattal and Maqamat by world's most revered Quranic reciters.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('audio')}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#9E7D3B] hover:underline cursor-pointer"
                >
                  <span>Open Audio Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {RECITERS_LIST.map((qari) => {
                  const isThisActive = currentTrack?.reciterId === qari.id;
                  return (
                    <div
                      key={qari.id}
                      onClick={() => {
                        handlePlayTrack({
                          surahNumber: 1,
                          surahName: "Al-Faatiha",
                          arabicName: "الفاتحة",
                          reciterName: qari.name,
                          reciterId: qari.id,
                          reciterImage: qari.photo,
                          audioUrl: qari.getAudioUrl(1)
                        });
                      }}
                      className={`p-3.5 sm:p-4 rounded-3xl bg-white border transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs hover:shadow-md ${
                        isThisActive ? 'border-[#C5A059] bg-[#FAF7F2]' : 'border-[#E8DFC8] hover:border-[#C5A059]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={qari.photo} 
                          alt={qari.name} 
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E4D9C5] group-hover:border-[#C5A059] transition-colors shadow-2xs flex-shrink-0" 
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-[#2C2416] group-hover:text-[#9E7D3B] transition-colors truncate">
                            {qari.name}
                          </h4>
                          <p className="text-[10px] text-[#6E624E] truncate mt-0.5">
                            {qari.sub}
                          </p>
                        </div>
                      </div>

                      <button
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-xs ${
                          isThisActive
                            ? 'bg-[#C5A059] text-white'
                            : 'bg-[#C5A059]/15 text-[#9E7D3B] group-hover:bg-[#C5A059] group-hover:text-white'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* DIRECT 1-TAP RESUME ROUTE */}
        {activeTab === 'directMushaf' && (
          <div className="space-y-4">
            <MushafViewer
              initialPageOverride={targetResumePage || lastReadSession?.page || 1}
              onBack={() => setActiveTab('home')}
              onPageUpdate={(updated) => setLastReadSession(updated)}
            />
          </div>
        )}

        {/* TAB 2: SURAHS */}
        {activeTab === 'surahs' && (
          <SurahListComponent
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onPlayTrack={handlePlayTrack}
          />
        )}

        {/* TAB 3: JUZ / PARAS */}
        {activeTab === 'juz' && (
          <div className="space-y-4">
            <JuzList onBackToHome={() => setActiveTab('home')} />
          </div>
        )}

        {/* TAB 4: TAJWEED GUIDE */}
        {activeTab === 'tajweed' && (
          <TajweedGuide />
        )}

        {/* TAB 5: AUDIO LIBRARY */}
        {activeTab === 'audio' && (
          <AudioLibrary 
            onPlayTrack={handlePlayTrack}
            currentTrack={currentTrack}
          />
        )}

        {/* TAB 6: BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <BookmarksView 
            bookmarks={bookmarkedSurahs}
            onToggleBookmark={handleToggleBookmark}
            onSelectSurah={() => setActiveTab('surahs')}
            onOpenPage={(pg) => handleTriggerResume(pg)}
          />
        )}

        {/* TAB 7: QIBLA */}
        {activeTab === 'qibla' && (
          <QiblaCompass />
        )}

      </main>

      {/* Universal Spotlight Jump Modal */}
      <SpotlightJump
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onJumpToPage={(pg) => handleTriggerResume(pg)}
        onSelectSurah={(surahNum) => {
          const s = getSurahInfoByPage(surahNum);
          handleTriggerResume(s.start);
        }}
      />

      {/* Dedicated AudioPlayer Component */}
      {currentTrack && (
        <AudioPlayer
          track={currentTrack}
          currentTrack={currentTrack}
          onClose={handleCloseAudio}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <footer className="md:hidden sticky bottom-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFC8] px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'home' ? 'text-[#9E7D3B]' : 'text-[#6E624E]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('surahs')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'surahs' ? 'text-[#9E7D3B]' : 'text-[#6E624E]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Surahs</span>
        </button>

        <button
          onClick={() => setActiveTab('juz')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'juz' ? 'text-[#9E7D3B]' : 'text-[#6E624E]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Paras</span>
        </button>

        <button
          onClick={() => setIsSpotlightOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#9E7D3B]"
        >
          <Search className="w-4 h-4" />
          <span>Jump</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'bookmarks' ? 'text-[#9E7D3B]' : 'text-[#6E624E]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
        </button>
      </footer>
    </div>
  );
}