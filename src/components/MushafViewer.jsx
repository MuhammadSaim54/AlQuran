import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Loader2, 
  Maximize2, 
  Minimize2, 
  Bookmark, 
  Check, 
  Palette, 
  BookCheck, 
  X
} from 'lucide-react';

export const SURAH_METADATA = [
  { num: 1, name: "Al-Faatiha", ar: "الفاتحة", start: 1 },
  { num: 2, name: "Al-Baqara", ar: "البقرة", start: 2 },
  { num: 3, name: "Aal-i-Imraan", ar: "آل عمران", start: 50 },
  { num: 4, name: "An-Nisaa", ar: "النساء", start: 77 },
  { num: 5, name: "Al-Maaida", ar: "المائدة", start: 106 },
  { num: 6, name: "Al-An'aam", ar: "الأنعام", start: 128 },
  { num: 7, name: "Al-A'raaf", ar: "الأعراف", start: 151 },
  { num: 8, name: "Al-Anfaal", ar: "الأنفال", start: 177 },
  { num: 9, name: "At-Tawba", ar: "التوبة", start: 187 },
  { num: 10, name: "Yunus", ar: "يونس", start: 208 },
  { num: 11, name: "Hud", ar: "هود", start: 221 },
  { num: 12, name: "Yusuf", ar: "يوسف", start: 235 },
  { num: 13, name: "Ar-Ra'd", ar: "الرعد", start: 249 },
  { num: 14, name: "Ibrahim", ar: "إبراهيم", start: 255 },
  { num: 15, name: "Al-Hijr", ar: "الحجر", start: 262 },
  { num: 16, name: "An-Nahl", ar: "النحل", start: 267 },
  { num: 17, name: "Al-Israa", ar: "الإسراء", start: 282 },
  { num: 18, name: "Al-Kahf", ar: "الكهف", start: 293 },
  { num: 19, name: "Maryam", ar: "مريم", start: 305 },
  { num: 20, name: "Taa-Haa", ar: "طه", start: 312 },
  { num: 21, name: "Al-Anbiyaa", ar: "الأنبياء", start: 322 },
  { num: 22, name: "Al-Hajj", ar: "الحج", start: 332 },
  { num: 23, name: "Al-Mu'minoon", ar: "المؤمنون", start: 342 },
  { num: 24, name: "An-Noor", ar: "النور", start: 350 },
  { num: 25, name: "Al-Furqaan", ar: "الفرقان", start: 359 },
  { num: 26, name: "Ash-Shu'araa", ar: "الشعراء", start: 367 },
  { num: 27, name: "An-Naml", ar: "النمل", start: 377 },
  { num: 28, name: "Al-Qasas", ar: "القصص", start: 385 },
  { num: 29, name: "Al-Ankaboot", ar: "العنكبوت", start: 396 },
  { num: 30, name: "Ar-Room", ar: "الروم", start: 404 },
  { num: 31, name: "Luqman", ar: "لقمان", start: 411 },
  { num: 32, name: "As-Sajda", ar: "السجدة", start: 415 },
  { num: 33, name: "Al-Ahzaab", ar: "الأحزاب", start: 418 },
  { num: 34, name: "Saba", ar: "سبأ", start: 428 },
  { num: 35, name: "Faatir", ar: "فاطر", start: 434 },
  { num: 36, name: "Yaseen", ar: "يس", start: 440 },
  { num: 37, name: "As-Saaffaat", ar: "الصافات", start: 446 },
  { num: 38, name: "Saad", ar: "ص", start: 453 },
  { num: 39, name: "Az-Zumar", ar: "الزمر", start: 458 },
  { num: 40, name: "Ghafir", ar: "غافر", start: 467 },
  { num: 41, name: "Fussilat", ar: "فصلت", start: 477 },
  { num: 42, name: "Ash-Shura", ar: "الشورى", start: 483 },
  { num: 43, name: "Az-Zukhruf", ar: "الزخرف", start: 489 },
  { num: 44, name: "Ad-Dukhaan", ar: "الدخان", start: 496 },
  { num: 45, name: "Al-Jaathiya", ar: "الجاثية", start: 499 },
  { num: 46, name: "Al-Ahqaaf", ar: "الأحقاف", start: 502 },
  { num: 47, name: "Muhammad", ar: "محمد", start: 507 },
  { num: 48, name: "Al-Fath", ar: "الفتح", start: 511 },
  { num: 49, name: "Al-Hujuraat", ar: "الحجرات", start: 515 },
  { num: 50, name: "Qaaf", ar: "ق", start: 518 },
  { num: 51, name: "Adh-Dhaariyaat", ar: "الذاريات", start: 520 },
  { num: 52, name: "At-Toor", ar: "الطور", start: 523 },
  { num: 53, name: "An-Najm", ar: "النجم", start: 526 },
  { num: 54, name: "Al-Qamar", ar: "القمر", start: 528 },
  { num: 55, name: "Ar-Rahmaan", ar: "الرحمن", start: 531 },
  { num: 56, name: "Al-Waaqia", ar: "الواقعة", start: 534 },
  { num: 57, name: "Al-Hadeed", ar: "الحديد", start: 537 },
  { num: 58, name: "Al-Mujaadila", ar: "المجادلة", start: 542 },
  { num: 59, name: "Al-Hashr", ar: "الحشر", start: 545 },
  { num: 60, name: "Al-Mumtahana", ar: "الممتحنة", start: 549 },
  { num: 61, name: "As-Saff", ar: "الصف", start: 551 },
  { num: 62, name: "Al-Jumu'a", ar: "الجمعة", start: 553 },
  { num: 63, name: "Al-Munaafiqoon", ar: "المنافقون", start: 554 },
  { num: 64, name: "At-Taghaabun", ar: "التغابن", start: 556 },
  { num: 65, name: "At-Talaaq", ar: "الطلاق", start: 558 },
  { num: 66, name: "At-Tahreem", ar: "التحريم", start: 560 },
  { num: 67, name: "Al-Mulk", ar: "الملك", start: 562 },
  { num: 68, name: "Al-Qalam", ar: "القلم", start: 564 },
  { num: 69, name: "Al-Haaqqa", ar: "الحاقة", start: 566 },
  { num: 70, name: "Al-Ma'aarij", ar: "المعارج", start: 568 },
  { num: 71, name: "Nooh", ar: "نوح", start: 570 },
  { num: 72, name: "Al-Jinn", ar: "الجن", start: 572 },
  { num: 73, name: "Al-Muzzammil", ar: "المزمل", start: 574 },
  { num: 74, name: "Al-Muddaththir", ar: "المدثر", start: 575 },
  { num: 75, name: "Al-Qiyaama", ar: "القيامة", start: 577 },
  { num: 76, name: "Al-Insaan", ar: "الإنسان", start: 578 },
  { num: 77, name: "Al-Mursalaat", ar: "المرسلات", start: 580 },
  { num: 78, name: "An-Naba", ar: "النبأ", start: 582 },
  { num: 79, name: "An-Naazi'aat", ar: "النازعات", start: 583 },
  { num: 80, name: "Abasa", ar: "عبس", start: 585 },
  { num: 81, name: "At-Takweer", ar: "التكوير", start: 586 },
  { num: 82, name: "Al-Infitaar", ar: "الانفطار", start: 587 },
  { num: 83, name: "Al-Mutaffifeen", ar: "المطففين", start: 587 },
  { num: 84, name: "Al-Inshiqaaq", ar: "الانشقاق", start: 589 },
  { num: 85, name: "Al-Burooj", ar: "البروج", start: 590 },
  { num: 86, name: "At-Taariq", ar: "الطارق", start: 591 },
  { num: 87, name: "Al-A'laa", ar: "الأعلى", start: 591 },
  { num: 88, name: "Al-Ghaashiya", ar: "الغاشية", start: 592 },
  { num: 89, name: "Al-Fajr", ar: "الفجر", start: 593 },
  { num: 90, name: "Al-Balad", ar: "البلد", start: 594 },
  { num: 91, name: "Ash-Shams", ar: "الشمس", start: 595 },
  { num: 92, name: "Al-Layl", ar: "الليل", start: 595 },
  { num: 93, name: "Ad-Duhaa", ar: "الضحى", start: 596 },
  { num: 94, name: "Ash-Sharh", ar: "الشرح", start: 596 },
  { num: 95, name: "At-Teen", ar: "التين", start: 597 },
  { num: 96, name: "Al-Alaq", ar: "العلق", start: 597 },
  { num: 97, name: "Al-Qadr", ar: "القدر", start: 598 },
  { num: 98, name: "Al-Bayyina", ar: "البينة", start: 598 },
  { num: 99, name: "Az-Zalzala", ar: "الزلزلة", start: 599 },
  { num: 100, name: "Al-Aadiyaat", ar: "العاديات", start: 599 },
  { num: 101, name: "Al-Qaari'a", ar: "القارعة", start: 600 },
  { num: 102, name: "At-Takaathur", ar: "التكاثر", start: 600 },
  { num: 103, name: "Al-Asr", ar: "العصر", start: 601 },
  { num: 104, name: "Al-Humaza", ar: "الهمزة", start: 601 },
  { num: 105, name: "Al-Feel", ar: "الفيل", start: 601 },
  { num: 106, name: "Quraysh", ar: "قريش", start: 602 },
  { num: 107, name: "Al-Maa'oon", ar: "الماعون", start: 602 },
  { num: 108, name: "Al-Kawthar", ar: "الكوثر", start: 602 },
  { num: 109, name: "Al-Kaafiroon", ar: "الكافرون", start: 603 },
  { num: 110, name: "An-Nasr", ar: "النصر", start: 603 },
  { num: 111, name: "Al-Masad", ar: "المسد", start: 603 },
  { num: 112, name: "Al-Ikhlaas", ar: "الإخلاص", start: 604 },
  { num: 113, name: "Al-Falaq", ar: "الفلق", start: 604 },
  { num: 114, name: "An-Naas", ar: "الناس", start: 604 }
];

export const getSurahInfoByPage = (page) => {
  const sorted = [...SURAH_METADATA].sort((a, b) => b.start - a.start);
  const found = sorted.find(s => page >= s.start);
  return found || SURAH_METADATA[0];
};

const getPageUrl = (page) => {
  const padded = page.toString().padStart(3, '0');
  return `https://raw.githubusercontent.com/GovarJabbar/Quran-PNG/master/${padded}.png`;
};

// Accurate Tajweed Parser: Clean, Vibrant High-Fidelity Colors
export function parseTajweedMarkup(rawText) {
  if (!rawText) return '';
  let str = rawText;

  // 1. Silent / Hamzatul Wasl -> Subdued Grey
  str = str.replace(/\[[hsl](?::\d+)?\[([^\]]+)\]/g, '<span style="color:#94A3B8;">$1</span>');

  // 2. Ghunnah -> Vibrant Emerald Green
  str = str.replace(/\[g(?::\d+)?\[([^\]]+)\]/g, '<span style="color:#15803D;font-weight:700;">$1</span>');

  // 3. Qalqalah -> Royal Sky Blue
  str = str.replace(/\[q(?::\d+)?\[([^\]]+)\]/g, '<span style="color:#1D4ED8;font-weight:700;">$1</span>');

  // 4. Madd (Prolongation) -> Vivid Crimson Red
  str = str.replace(/\[[ompn](?::\d+)?\[([^\]]+)\]/g, '<span style="color:#DC2626;font-weight:700;">$1</span>');

  // 5. Ikhfa -> Deep Warm Amber
  str = str.replace(/\[[fc](?::\d+)?\[([^\]]+)\]/g, '<span style="color:#D97706;font-weight:700;">$1</span>');

  // 6. Idgham -> Deep Amethyst Purple
  str = str.replace(/\[[waudb](?::\d+)?\[([^\]]+)\]/g, '<span style="color:#7E22CE;font-weight:700;">$1</span>');

  // 7. Iqlab -> Dark Teal / Cyan
  str = str.replace(/\[i(?::\d+)?\[([^\]]+)\]/g, '<span style="color:#0E7490;font-weight:700;">$1</span>');

  // 8. Safely Strip Any Remaining Raw Brackets
  str = str.replace(/\[[a-z](?::\d+)?\[/g, '').replace(/\]/g, '');

  return str;
}

const THEMES = {
  original: {
    name: "Classic White",
    bg: "bg-white",
    filter: "contrast-[1.18] brightness-[0.99]",
    cardBorder: "border-[#C5A059]/35"
  },
  sepia: {
    name: "Vintage Sepia",
    bg: "bg-[#F3EAD8]",
    filter: "contrast-[1.2] sepia-[0.32] brightness-[0.95]",
    cardBorder: "border-[#9E7D3B]/45"
  },
  midnight: {
    name: "Midnight Dark",
    bg: "bg-[#12100E]",
    filter: "invert-[0.92] hue-rotate-[185deg] contrast-[1.3] brightness-[1.05]",
    cardBorder: "border-[#C5A059]/60"
  }
};

const cachedPages = new Set();
const tajweedCache = new Map();

export default function MushafViewer({ 
  surahNumber = 1, 
  initialPageOverride, 
  onBack, 
  onPageUpdate 
}) {
  const initialPage = useMemo(() => {
    if (initialPageOverride) return Number(initialPageOverride);
    const s = SURAH_METADATA.find(item => item.num === Number(surahNumber));
    return s ? s.start : 1;
  }, [surahNumber, initialPageOverride]);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputPage, setInputPage] = useState(initialPage.toString());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Tajweed Mode Toggle
  const [isTajweedMode, setIsTajweedMode] = useState(() => {
    return localStorage.getItem('alquran_tajweed_mode') === 'true';
  });

  const [tajweedAyahs, setTajweedAyahs] = useState([]);
  const [tajweedLoading, setTajweedLoading] = useState(false);

  const [currentThemeKey, setCurrentThemeKey] = useState(() => {
    return localStorage.getItem('alquran_mushaf_theme') || 'original';
  });

  const [imageLoading, setImageLoading] = useState(!cachedPages.has(initialPage));

  const [bookmarkedPages, setBookmarkedPages] = useState(() => {
    try {
      const saved = localStorage.getItem('alquran_page_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isCurrentPageBookmarked = useMemo(() => {
    return bookmarkedPages.some(p => p.page === currentPage);
  }, [bookmarkedPages, currentPage]);

  const containerRef = useRef(null);
  const activeTheme = THEMES[currentThemeKey] || THEMES.original;

  const handleSelectTheme = (key) => {
    setCurrentThemeKey(key);
    localStorage.setItem('alquran_mushaf_theme', key);
  };

  const handleToggleTajweed = () => {
    const nextVal = !isTajweedMode;
    setIsTajweedMode(nextVal);
    localStorage.setItem('alquran_tajweed_mode', nextVal.toString());
    showToast(nextVal ? "Tajweed Color Overlay Activated" : "16-Line Indo-Pak Mushaf Mode");
  };

  useEffect(() => {
    setCurrentPage(initialPage);
    setInputPage(initialPage.toString());
  }, [initialPage]);

  // Indo-Pak Mushaf Folio Preloader
  useEffect(() => {
    const img = new Image();
    img.src = getPageUrl(currentPage);
    img.onload = () => {
      cachedPages.add(currentPage);
      setImageLoading(false);
    };

    for (let i = 1; i <= 3; i++) {
      if (currentPage + i <= 604) {
        const next = new Image();
        next.src = getPageUrl(currentPage + i);
        next.onload = () => cachedPages.add(currentPage + i);
      }
    }
  }, [currentPage]);

  // Fetch & Parse Tajweed Data
  useEffect(() => {
    if (isTajweedMode) {
      if (tajweedCache.has(currentPage)) {
        setTajweedAyahs(tajweedCache.get(currentPage));
        setTajweedLoading(false);
      } else {
        setTajweedLoading(true);
        fetch(`https://api.alquran.cloud/v1/page/${currentPage}/quran-tajweed`)
          .then(res => res.json())
          .then(json => {
            if (json && json.data && json.data.ayahs) {
              const parsed = json.data.ayahs.map(a => ({
                ...a,
                parsedHtml: parseTajweedMarkup(a.text)
              }));
              tajweedCache.set(currentPage, parsed);
              setTajweedAyahs(parsed);
            }
            setTajweedLoading(false);
          })
          .catch(err => {
            console.warn("Tajweed API fetch error:", err);
            setTajweedLoading(false);
          });
      }
    }
  }, [currentPage, isTajweedMode]);

  // Persistent Safe Tracker
  useEffect(() => {
    setInputPage(currentPage.toString());
    try {
      const info = getSurahInfoByPage(currentPage);
      const trackerPayload = {
        page: currentPage,
        surahNumber: info.num,
        surahName: info.name,
        arabicName: info.ar,
        timestamp: Date.now()
      };
      localStorage.setItem('alquran_last_read', JSON.stringify(trackerPayload));
      if (onPageUpdate) onPageUpdate(trackerPayload);
    } catch (e) {
      console.warn("Storage sync failed:", e);
    }
  }, [currentPage, onPageUpdate]);

  const togglePageBookmark = () => {
    const info = getSurahInfoByPage(currentPage);
    setBookmarkedPages(prev => {
      const exists = prev.some(p => p.page === currentPage);
      let updated;
      if (exists) {
        updated = prev.filter(p => p.page !== currentPage);
        showToast(`Removed Page ${currentPage}`);
      } else {
        const newBookmark = {
          page: currentPage,
          surahName: info.name,
          arabicName: info.ar,
          surahNumber: info.num,
          savedAt: Date.now()
        };
        updated = [newBookmark, ...prev];
        showToast(`Page ${currentPage} Bookmarked!`);
      }
      localStorage.setItem('alquran_page_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const switchPage = useCallback((num) => {
    const target = Math.max(1, Math.min(604, num));
    setImageLoading(true);
    setZoomLevel(1);
    setCurrentPage(target);
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPage < 604) switchPage(currentPage + 1);
  }, [currentPage, switchPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) switchPage(currentPage - 1);
  }, [currentPage, switchPage]);

  const handleDragEnd = (event, info) => {
    if (zoomLevel > 1) return;
    const swipeThreshold = 50;
    const swipeVelocity = 350;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -swipeThreshold || velocity < -swipeVelocity) {
      handleNextPage();
    } else if (offset > swipeThreshold || velocity > swipeVelocity) {
      handlePrevPage();
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(inputPage, 10);
    if (!isNaN(val) && val >= 1 && val <= 604) {
      switchPage(val);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    setShowAppearanceModal(false);
  };

  const dragBoundary = useMemo(() => {
    return Math.max(0, (zoomLevel - 1) * 550);
  }, [zoomLevel]);

  const activeSurahDetails = useMemo(() => {
    return getSurahInfoByPage(currentPage);
  }, [currentPage]);

  return (
    <div 
      ref={containerRef}
      className={`w-full flex flex-col justify-between transition-all select-none ${
        isFullscreen 
          ? `fixed inset-0 z-50 ${currentThemeKey === 'midnight' ? 'bg-[#0B0907]' : 'bg-[#FAF7F2]'} p-2 sm:p-3 overflow-hidden h-screen` 
          : 'space-y-3 sm:space-y-4 pb-24 px-1 sm:px-3 w-full max-w-7xl mx-auto'
      }`}
    >
      {/* Luxury Arabic Font & Calligraphy System */}
      <style>{`
        /* Authentic Quranic Font - Amiri Quran & Scheherazade New */
        .quran-traditional-script {
          font-family: 'Amiri Quran', 'Scheherazade New', 'Amiri', 'Traditional Arabic', serif;
          font-size: clamp(1.4rem, 1.25rem + 1.2vw, 2.45rem);
          line-height: clamp(3.0, 2.8 + 0.8vw, 3.8);
          letter-spacing: 0.02em;
          text-align: justify;
          text-align-last: center;
          direction: rtl;
        }

        /* Ayah Badge */
        .quran-ayah-badge {
          width: clamp(2rem, 1.75rem + 0.6vw, 2.6rem);
          height: clamp(2rem, 1.75rem + 0.6vw, 2.6rem);
          font-size: clamp(0.75rem, 0.7rem + 0.25vw, 0.95rem);
          font-family: ui-monospace, monospace;
        }

        /* Ultra-Slim Golden Frosted Scrollbar */
        .custom-tajweed-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(197, 160, 89, 0.45) transparent;
        }
        .custom-tajweed-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-tajweed-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-tajweed-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.4);
          border-radius: 9999px;
        }
        .custom-tajweed-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.8);
        }
      `}</style>

      {/* Top Status Bar: Responsive & Symmetrical */}
      <div className={`z-30 transition-all ${
        isFullscreen 
          ? `${currentThemeKey === 'midnight' ? 'bg-[#1C1814]/95 text-white border-[#C5A059]/40' : 'bg-white/95 text-[#2C2416] border-[#C5A059]/40'} backdrop-blur-xl border rounded-2xl px-2.5 sm:px-6 py-2 shadow-lg max-w-5xl mx-auto w-full` 
          : `${currentThemeKey === 'midnight' ? 'bg-[#1C1814]/95 text-white border-[#C5A059]/40' : 'bg-white/95 text-[#2C2416] border-[#C5A059]/30'} sticky top-16 backdrop-blur-xl px-2.5 sm:px-6 py-2 rounded-3xl border shadow-xs w-full max-w-5xl mx-auto`
      }`}>
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 w-full">
          
          <button
            onClick={() => {
              if (isFullscreen) setIsFullscreen(false);
              onBack();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF7F2] hover:bg-[#C5A059]/20 text-[#9E7D3B] border border-[#C5A059]/30 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90 flex-shrink-0"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Centered Page Jumper */}
          <form 
            onSubmit={handlePageSubmit}
            className={`flex items-center ${currentThemeKey === 'midnight' ? 'bg-[#29221B] border-[#C5A059]/50' : 'bg-[#FAF7F2] border-[#C5A059]/35'} border rounded-full px-2 sm:px-3 py-0.5 sm:py-1 shadow-2xs flex-shrink-0`}
          >
            <span className="text-[10px] sm:text-xs font-bold text-[#9E7D3B] font-mono mr-1">Page</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              onBlur={handlePageSubmit}
              className={`w-7 sm:w-11 text-center text-xs sm:text-sm font-black font-mono ${currentThemeKey === 'midnight' ? 'bg-[#1A140E] text-[#F7E7B4]' : 'bg-white text-[#9E7D3B]'} rounded-md border border-[#C5A059]/30 py-0.5 outline-none`}
            />
            <span className="text-[10px] sm:text-xs font-bold text-[#6E624E] font-mono ml-1">/ 604</span>
          </form>

          {/* Right Action Icons: Ribbon + Palette & Tajweed Settings */}
          <div className="relative flex-shrink-0 flex items-center gap-1 sm:gap-2">
            
            <button
              onClick={togglePageBookmark}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90 ${
                isCurrentPageBookmarked 
                  ? 'bg-[#C5A059] text-white border-[#C5A059]' 
                  : 'bg-[#FAF7F2] hover:bg-[#C5A059]/20 text-[#9E7D3B] border-[#C5A059]/30'
              }`}
              title={isCurrentPageBookmarked ? "Bookmark Saved" : "Bookmark this Page"}
            >
              <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCurrentPageBookmarked ? 'fill-white' : ''}`} />
            </button>

            {/* Reading Settings Icon */}
            <button
              onClick={() => setShowAppearanceModal(prev => !prev)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90 relative ${
                showAppearanceModal || isTajweedMode
                  ? 'bg-[#C5A059] text-white border-[#C5A059]' 
                  : 'bg-[#FAF7F2] hover:bg-[#C5A059]/20 text-[#9E7D3B] border-[#C5A059]/30'
              }`}
              title="Reading Appearance & Tajweed"
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {isTajweedMode && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
              )}
            </button>

            <AnimatePresence>
              {showAppearanceModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  className="absolute right-0 top-11 w-68 bg-white/98 backdrop-blur-xl border border-[#C5A059]/35 shadow-2xl rounded-3xl p-4 z-50 text-[#2C2416] space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9E7D3B]">
                      Reading Settings
                    </span>
                    <button 
                      onClick={() => setShowAppearanceModal(false)}
                      className="p-1 rounded-lg hover:bg-[#F2ECE1] text-[#6E624E]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1. Tajweed Rules Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <BookCheck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#2C2416]">Color Tajweed</span>
                        <span className="text-[10px] text-[#6E624E]">Colored recitation rules</span>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleTajweed}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isTajweedMode ? 'bg-[#10B981]' : 'bg-[#E8DFC8]'
                      }`}
                    >
                      <span 
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          isTajweedMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 2. Paper Tone Themes */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#6E624E]">
                      Paper Tone
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSelectTheme('original')}
                        className={`p-2 rounded-xl text-center border text-[11px] font-bold cursor-pointer transition-all ${
                          currentThemeKey === 'original' 
                            ? 'border-[#C5A059] bg-[#FAF7F2] text-[#9E7D3B]' 
                            : 'border-[#E8DFC8] bg-white text-[#6E624E]'
                        }`}
                      >
                        White
                      </button>
                      <button
                        onClick={() => handleSelectTheme('sepia')}
                        className={`p-2 rounded-xl text-center border text-[11px] font-bold cursor-pointer transition-all ${
                          currentThemeKey === 'sepia' 
                            ? 'border-[#C5A059] bg-[#F3EAD8] text-[#9E7D3B]' 
                            : 'border-[#E8DFC8] bg-[#F3EAD8]/60 text-[#6E624E]'
                        }`}
                      >
                        Sepia
                      </button>
                      <button
                        onClick={() => handleSelectTheme('midnight')}
                        className={`p-2 rounded-xl text-center border text-[11px] font-bold cursor-pointer transition-all ${
                          currentThemeKey === 'midnight' 
                            ? 'border-[#C5A059] bg-[#16120D] text-white' 
                            : 'border-[#E8DFC8] bg-[#16120D] text-gray-400'
                        }`}
                      >
                        Midnight
                      </button>
                    </div>
                  </div>

                  {/* 3. Zoom Controls */}
                  <div className="pt-2 border-t border-[#E8DFC8] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 1))}
                        className="p-1.5 rounded-lg hover:bg-[#F2ECE1] text-[#9E7D3B]"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono font-bold text-[#6E624E] px-1">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <button
                        onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                        className="p-1.5 rounded-lg hover:bg-[#F2ECE1] text-[#9E7D3B]"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-lg hover:bg-[#F2ECE1] text-[#9E7D3B] flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      <span>{isFullscreen ? "Exit" : "Expand"}</span>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Floating Bookmark Pill Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1C1813]/95 border border-[#C5A059]/60 shadow-xl text-white text-xs font-mono flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Quran Canvas */}
      <div className={`w-full flex-1 flex justify-center items-center overflow-hidden ${
        isFullscreen ? 'my-1' : 'my-2'
      }`}>
        <div 
          className={`w-full ${activeTheme.bg} rounded-3xl border-2 ${activeTheme.cardBorder} shadow-xl relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
            isFullscreen 
              ? 'h-[calc(100vh-140px)] max-w-6xl p-2 sm:p-5' 
              : 'h-[75vh] md:h-[82vh] lg:h-[88vh] max-w-5xl xl:max-w-6xl p-2 sm:p-6'
          }`}
        >
          {isCurrentPageBookmarked && (
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              className="absolute top-0 right-6 sm:right-10 z-20 w-5 sm:w-6 h-12 sm:h-16 bg-gradient-to-b from-[#C5A059] to-[#9E7D3B] shadow-md rounded-b-md flex items-end justify-center pb-1.5"
            >
              <div className="w-2 h-2 rounded-full bg-[#F7E7B4]" />
            </motion.div>
          )}

          {/* Loader */}
          {(isTajweedMode ? tajweedLoading : imageLoading) && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${currentThemeKey === 'midnight' ? 'bg-[#12100E]/95' : 'bg-white/95'} backdrop-blur-xs z-20 gap-3 text-[#9E7D3B]`}>
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-xs sm:text-sm font-bold text-[#6E624E]">
                {isTajweedMode ? `Applying Tajweed Rules to Page ${currentPage}...` : `Opening Page ${currentPage}...`}
              </p>
            </div>
          )}

          {/* Viewport */}
          <motion.div
            key={`${currentPage}-${isTajweedMode}`}
            drag={zoomLevel > 1 ? true : "x"}
            dragConstraints={
              zoomLevel > 1 
                ? { left: -dragBoundary, right: dragBoundary, top: -dragBoundary, bottom: dragBoundary }
                : { left: 0, right: 0, top: 0, bottom: 0 }
            }
            dragElastic={zoomLevel > 1 ? 0.08 : 0.25}
            onDragEnd={handleDragEnd}
            animate={{ scale: zoomLevel, x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`w-full h-full flex justify-center items-center origin-center ${
              zoomLevel > 1 
                ? 'cursor-grab active:cursor-grabbing' 
                : 'cursor-grab active:cursor-grabbing touch-pan-y'
            }`}
          >
            {/* VIEW 1: AUTHENTIC SACRED CALLIGRAPHY TAJWEED (AMIRI QURAN ENGINE) */}
            {isTajweedMode ? (
              <div 
                className="w-full h-full max-w-full overflow-y-auto px-4 sm:px-10 lg:px-14 py-4 sm:py-6 flex flex-col justify-between select-text custom-tajweed-scrollbar"
                dir="rtl"
              >
                {/* Traditional Surah Header Bar */}
                <div className="border-b border-[#C5A059]/30 pb-2.5 mb-4 flex items-center justify-between text-xs sm:text-sm font-mono text-[#9E7D3B]">
                  <span className="font-arabic font-bold text-base sm:text-xl">سُورَةُ {activeSurahDetails.ar}</span>
                  <span className="text-[11px] sm:text-xs font-bold">صَفْحَة {currentPage}</span>
                </div>

                {/* Open, Crystal Clear, Elegant Quran Text */}
                <div className="flex-1 flex flex-col justify-center py-2 px-1 sm:px-2">
                  <p className="text-[#1C160F] quran-traditional-script select-text">
                    {tajweedAyahs.map((ayah) => (
                      <React.Fragment key={ayah.number}>
                        <span 
                          dangerouslySetInnerHTML={{ __html: ayah.parsedHtml }}
                          className="mx-0.5 inline"
                        />
                        <span className="inline-flex items-center justify-center quran-ayah-badge rounded-full bg-[#C5A059]/15 text-[#9E7D3B] font-bold mx-1.5 sm:mx-2 border border-[#C5A059]/40 select-none align-middle shadow-2xs">
                          {ayah.numberInSurah}
                        </span>
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t border-[#C5A059]/30 pt-2.5 mt-4 flex items-center justify-between text-[11px] sm:text-xs font-mono text-[#6E624E]">
                  <span>Juz {activeSurahDetails.num}</span>
                  <span className="text-[#9E7D3B] font-bold">Page {currentPage} of 604</span>
                </div>
              </div>
            ) : (
              /* VIEW 2: ORIGINAL 16-LINE INDO-PAK MUSHAF */
              <div className="relative h-full flex items-center justify-center">
                <img
                  src={getPageUrl(currentPage)}
                  alt={`Quran Page ${currentPage}`}
                  onLoad={() => setImageLoading(false)}
                  draggable={false}
                  className={`h-full w-auto max-w-full object-contain filter ${activeTheme.filter} drop-shadow-sm select-none pointer-events-none transition-all duration-300`}
                  style={{
                    imageRendering: '-webkit-optimize-contrast'
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Floating Bottom Quick Tajweed Rule Legend Bar: 100% Mobile Overflow Proof */}
      {isTajweedMode && (
        <div className="max-w-5xl mx-auto w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/95 backdrop-blur-md border border-[#C5A059]/40 rounded-2xl flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-1 text-[9.5px] sm:text-[11px] font-mono font-bold text-[#2C2416] shadow-sm">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-600 shadow-2xs" />
            <span>Ghunnah</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-600 shadow-2xs" />
            <span>Qalqalah</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-600 shadow-2xs" />
            <span>Madd</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-600 shadow-2xs" />
            <span>Ikhfa</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-purple-600 shadow-2xs" />
            <span>Idgham</span>
          </div>
        </div>
      )}

      {/* Bottom Paging Controller */}
      <div className={`transition-all max-w-5xl mx-auto w-full ${
        isFullscreen 
          ? `${currentThemeKey === 'midnight' ? 'bg-[#1C1814]/95 text-white border-[#C5A059]/40' : 'bg-white/95 text-[#2C2416] border-[#C5A059]/40'} backdrop-blur-xl border rounded-2xl p-2 sm:px-6 shadow-lg flex items-center justify-between gap-3` 
          : `${currentThemeKey === 'midnight' ? 'bg-[#1C1814]/95 text-white border-[#C5A059]/40' : 'bg-white/95 text-[#2C2416] border-[#C5A059]/30'} flex items-center justify-between gap-3 sm:gap-6 p-2 sm:p-3 border rounded-2xl shadow-xs`
      }`}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="px-3.5 sm:px-5 py-2 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 disabled:opacity-40 text-[#9E7D3B] text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev ({currentPage > 1 ? currentPage - 1 : 1})</span>
        </button>

        <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-md justify-center px-1">
          <input
            type="range"
            min="1"
            max="604"
            value={currentPage}
            onChange={(e) => switchPage(parseInt(e.target.value, 10))}
            className="w-full h-1.5 sm:h-2 bg-[#C5A059]/25 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
          />
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= 604}
          className="px-3.5 sm:px-5 py-2 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 disabled:opacity-40 text-[#9E7D3B] text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 active:scale-95"
        >
          <span>Next ({currentPage < 604 ? currentPage + 1 : 604})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}