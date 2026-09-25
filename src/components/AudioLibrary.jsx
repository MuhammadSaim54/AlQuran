import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Search, 
  Headphones, 
  Radio, 
  Sparkles, 
  Volume2, 
  Check, 
  Disc
} from 'lucide-react';
import { SURAH_METADATA } from './MushafViewer';

// Local asset image imports with safe CDN fallback
import noreenImg from '../assets/images/noreen.jpg';
import sudaisImg from '../assets/images/sudais.jpg';
import muaiqlyImg from '../assets/images/maher.jpg';
import alafasyImg from '../assets/images/alafasy.jpg';
import basitImg from '../assets/images/basit.jpg';

export const RECITERS_MASTER = [
  {
    id: 'noreen',
    name: 'Sheikh Noreen Muhammad Siddiq',
    sub: 'Traditional Sudanese Maqam',
    image: noreenImg || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    server: 'https://server10.mp3quran.net/nourin'
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    sub: 'Chief Imam of Masjid Al-Haram, Makkah',
    image: sudaisImg || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    server: 'https://server11.mp3quran.net/sds'
  },
  {
    id: 'muaiqly',
    name: 'Maher Al-Muaiqly',
    sub: 'Esteemed Imam of Masjid Al-Haram',
    image: muaiqlyImg || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    server: 'https://server12.mp3quran.net/maher'
  },
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    sub: 'World-Renowned Melodic Murattal',
    image: alafasyImg || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=400&q=80',
    server: 'https://server8.mp3quran.net/afs'
  },
  {
    id: 'abdulbasit',
    name: 'Abdul Basit Abdul Samad',
    sub: 'Golden Era Legendary Egyptian Murattal',
    image: basitImg || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    server: 'https://server7.mp3quran.net/basit'
  }
];

export const formatAudioUrl = (server, surahNum) => {
  const padded = surahNum.toString().padStart(3, '0');
  return `${server}/${padded}.mp3`;
};

export default function AudioLibrary({ onPlayTrack, currentTrack }) {
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSurah = useMemo(() => {
    return SURAH_METADATA.find(s => s.num === selectedSurahNum) || SURAH_METADATA[0];
  }, [selectedSurahNum]);

  const handlePlayReciter = (reciter) => {
    const audioUrl = formatAudioUrl(reciter.server, currentSurah.num);
    
    if (onPlayTrack) {
      onPlayTrack({
        surahNumber: currentSurah.num,
        surahName: currentSurah.name,
        arabicName: currentSurah.ar,
        reciterName: reciter.name,
        reciterId: reciter.id,
        reciterImage: reciter.image,
        reciterServer: reciter.server,
        audioUrl: audioUrl
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#F5EFE4] via-[#FAF7F2] to-[#ECE2CF] border border-[#E4D9C5] p-5 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7D3B] text-[11px] font-mono font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>Sacred Studio Recitations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#2B2317] tracking-tight">
            World-Renowned Quran Audio
          </h2>
          <p className="text-xs sm:text-sm text-[#6E624E] leading-relaxed">
            Experience high-fidelity full Surah recitations with legendary Qaris across Egyptian, Sudanese, and Hijazi Maqamat.
          </p>
        </div>
      </div>

      {/* Reciters Cards Grid (Matching Exact Screenshot Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECITERS_MASTER.map((reciter) => {
          const isThisPlaying = 
            currentTrack?.reciterId === reciter.id && 
            currentTrack?.surahNumber === currentSurah.num;

          return (
            <div
              key={reciter.id}
              className={`p-5 rounded-3xl bg-white border transition-all flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md ${
                isThisPlaying 
                  ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 bg-[#FAF7F2]/60' 
                  : 'border-[#E8DFC8] hover:border-[#C5A059]'
              }`}
            >
              {/* Reciter Info */}
              <div className="flex items-center gap-3.5">
                <img
                  src={reciter.image}
                  alt={reciter.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E4D9C5] shadow-xs flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-[#2C2416] truncate">
                    {reciter.name}
                  </h4>
                  <p className="text-[11px] text-[#6E624E] truncate mt-0.5 font-medium">
                    {reciter.sub}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[9.5px] font-mono text-[#9E7D3B]">
                    Studio Audio
                  </span>
                </div>
              </div>

              {/* Bottom Card Action: Selected Surah & Listen Now Button */}
              <div className="pt-3 border-t border-[#E8DFC8]/60 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-mono font-bold text-[#A8987E] tracking-wider block">
                    SELECTED SURAH
                  </span>
                  <span className="text-xs font-bold text-[#2C2416] truncate block">
                    Surah {currentSurah.name} ({currentSurah.ar})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayReciter(reciter)}
                  className="px-4 py-2 rounded-2xl bg-[#C5A059] hover:bg-[#9E7D3B] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Choose Surah Directory */}
      <div className="space-y-4 pt-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC8] pb-3">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-[#9E7D3B]" />
            <h3 className="font-extrabold text-sm sm:text-base text-[#2C2416]">
              Choose Surah to Recite
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#9E7D3B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapter..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] text-xs outline-none focus:border-[#C5A059] font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {SURAH_METADATA.filter(s => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.num.toString() === searchQuery ||
            s.ar.includes(searchQuery)
          ).map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setSelectedSurahNum(s.num)}
              className={`p-2.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                selectedSurahNum === s.num
                  ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
                  : 'bg-white hover:bg-[#FAF7F2] border-[#E8DFC8] text-[#2C2416]'
              }`}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-mono opacity-80 block">#{s.num}</span>
                <span className="text-xs font-bold truncate block">{s.name}</span>
              </div>
              <span className="font-arabic text-xs font-bold flex-shrink-0" dir="rtl">{s.ar}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}