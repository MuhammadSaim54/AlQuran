import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Headphones, Layers, ArrowRight, Volume2 } from 'lucide-react';

const BISMILLAH_AUDIO_URL = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";

const SLIDES = [
  {
    badge: "Divine Revelation",
    arabicTitle: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    title: "The Holy Quran in Timeless Splendor",
    subtitle: "Turn pages of the authentic 16-Line Indo-Pak Mushaf, crafted with crisp typography and digital reverence.",
    icon: BookOpen
  },
  {
    badge: "Sacred Melodies",
    arabicTitle: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    title: "Echoes of the Master Reciters",
    subtitle: "Immerse in the melodious voices of revered Qaris with seamless audio streaming and recitation modes.",
    icon: Headphones
  },
  {
    badge: "Spiritual Path",
    arabicTitle: "هُدًى لِلْمُتَّقِينَ",
    title: "Your Sacred Daily Sanctuary",
    subtitle: "Instant access to all 30 Paras, 114 Surahs, bookmarks, and Qibla direction wherever you are.",
    icon: Layers
  }
];

export default function OnboardingLanding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioInstanceRef = useRef(null);

  // Background silent preloading taaki click karte hi instant bina delay baje
  useEffect(() => {
    const audio = new Audio();
    audio.src = BISMILLAH_AUDIO_URL;
    audio.preload = "auto";
    audio.load();
    audioInstanceRef.current = audio;

    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }
    };
  }, []);

  const triggerLaunch = () => {
    setIsLoading(true);

    const audio = audioInstanceRef.current || new Audio(BISMILLAH_AUDIO_URL);
    audio.currentTime = 0;
    audio.volume = 1;

    let hasCompleted = false;
    const finish = () => {
      if (!hasCompleted) {
        hasCompleted = true;
        onComplete();
      }
    };

    // Jaise hi Tilawat mukammal ho, app open ho jaye
    audio.onended = finish;

    audio.play().catch((err) => {
      console.warn("Audio autoplay blocked by browser:", err);
      // Fallback timer if autoplay is blocked
      setTimeout(finish, 3500);
    });

    // Safety fallback taaki screen stuck na ho
    setTimeout(finish, 5000);
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      triggerLaunch();
    }
  };

  const slide = SLIDES[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] text-[#2C2416] flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Background Watermark Accent */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-arabic text-[180px] sm:text-[260px] text-[#C5A059]/[0.04] pointer-events-none select-none font-bold leading-none whitespace-nowrap"
        dir="rtl"
      >
        القرآن الكريم
      </div>

      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[14px] bg-[#F2ECE1] border border-[#E4D9C5] flex items-center justify-center text-[#9E7D3B] shadow-2xs">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="font-serif font-black text-lg tracking-tight leading-none text-[#2B2317]">
              AL QURAN
            </h1>
            <span className="text-[9.5px] uppercase font-mono tracking-[0.18em] text-[#9E7D3B] font-extrabold block mt-0.5">
              SPIRITUAL COMPANION
            </span>
          </div>
        </div>

        {currentSlide < SLIDES.length - 1 && (
          <button
            onClick={triggerLaunch}
            className="text-xs font-mono font-bold tracking-widest uppercase text-[#9E7D3B] hover:text-[#2B2317] transition-colors cursor-pointer px-3 py-1.5 rounded-xl hover:bg-[#F2ECE1]"
          >
            Skip
          </button>
        )}
      </div>

      {/* Center Slide Stage */}
      <div className="max-w-2xl w-full mx-auto px-6 py-6 flex-1 flex flex-col justify-center items-center text-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 flex flex-col items-center max-w-xl"
          >
            {/* Islamic Medallion Illustration */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] bg-gradient-to-br from-[#F5ECE0] to-[#EAE0D0] border-2 border-[#C5A059]/40 shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-2 border border-[#C5A059]/30 rounded-[24px] border-dashed" />
                <IconComponent className="w-12 h-12 text-[#9E7D3B] stroke-[1.7]" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>

            {/* Arabic Script Sub-Header */}
            <p className="font-arabic text-xl sm:text-2xl text-[#9E7D3B] font-bold leading-normal tracking-wide" dir="rtl">
              {slide.arabicTitle}
            </p>

            {/* Slide Title with Luxury Serif Typography */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#2B2317] tracking-tight leading-[1.25]">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E624E] leading-relaxed max-w-md mx-auto">
                {slide.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="max-w-md w-full mx-auto px-6 pb-12 z-10 space-y-6">
        <div className="flex justify-center items-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide 
                  ? 'w-8 bg-[#C5A059]' 
                  : 'w-2 bg-[#E4D9C5]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#9E7D3B] hover:brightness-105 text-white font-bold text-sm shadow-xl shadow-[#C5A059]/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Majestic Calligraphy Loader Synchronized with Bismillah */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-[#14110E] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <motion.div 
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-96 h-96 bg-[#C5A059] rounded-full blur-[110px] pointer-events-none" 
            />

            <div className="relative flex flex-col items-center space-y-8 z-10 max-w-lg w-full">
              <div className="relative p-6 sm:p-8 rounded-[36px] bg-[#1C1813]/80 border border-[#C5A059]/30 shadow-2xl backdrop-blur-md w-full flex flex-col items-center">
                
                <svg 
                  viewBox="0 0 500 160" 
                  className="w-full max-w-[360px] h-auto overflow-visible"
                >
                  <defs>
                    <linearGradient id="goldCalligraphyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C5A059" />
                      <stop offset="50%" stopColor="#F7E7B4" />
                      <stop offset="100%" stopColor="#9E7D3B" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    d="M 40 120 Q 250 145 460 120"
                    fill="none"
                    stroke="url(#goldCalligraphyGlow)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />

                  <motion.text
                    x="50%"
                    y="95"
                    textAnchor="middle"
                    className="font-arabic font-bold text-[62px] sm:text-[70px] select-none"
                    style={{ fill: "url(#goldCalligraphyGlow)" }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2.0, delay: 0.2, ease: "easeOut" }}
                  >
                    الْقُرْآنُ الْكَرِيمُ
                  </motion.text>
                </svg>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="space-y-2 mt-4"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/25 text-[#C5A059]">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-xs font-arabic font-bold">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A69986] font-medium tracking-wider">
                    Entering The Divine Sanctuary...
                  </p>
                </motion.div>

              </div>

              <div className="w-48 h-1 bg-[#2C2416] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#9E7D3B] to-[#F7E7B4]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.8, ease: "easeInOut" }}
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}