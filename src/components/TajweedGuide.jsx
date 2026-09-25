import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Volume2, Info, ArrowRight } from 'lucide-react';

const TAJWEED_RULES = [
  {
    id: 'ghunnah',
    name: 'Ghunnah (غُنَّة)',
    colorName: 'Emerald Green',
    colorHex: '#10B981',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    dotBg: 'bg-emerald-500',
    description: 'Nasal sound produced from the deep nasal cavity for 2 counts on Noon or Meem with Shaddah (نّ / مّ).',
    letters: ['نّ', 'مّ'],
    examples: [
      { ar: 'إِنَّ ٱللَّهَ', en: 'Inna Allaha', note: 'Noon Mushaddadah' },
      { ar: 'ثُمَّ كَلَّا', en: 'Thumma Kalla', note: 'Meem Mushaddadah' }
    ]
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (قَلْقَلَة)',
    colorName: 'Royal Blue',
    colorHex: '#3B82F6',
    badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
    dotBg: 'bg-blue-500',
    description: 'Echoing or bouncing sound produced when one of the five Qalqalah letters carries a Sukoon (سكون) or at pause (Waqf).',
    letters: ['ق', 'ط', 'ب', 'ج', 'د'],
    mnemonic: 'قُطْبُ جَدٍّ (Qutbu Jaddin)',
    examples: [
      { ar: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', en: 'Qul huwa Allahu Ahad', note: 'Daal at Waqf (Echoing)' },
      { ar: 'فِى جِيدِهَا حَبْلٌ', en: 'Fee jeediha hablun', note: 'Baa with Sukoon' }
    ]
  },
  {
    id: 'madd',
    name: 'Madd (مَدّ)',
    colorName: 'Ruby Crimson',
    colorHex: '#EF4444',
    badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    dotBg: 'bg-rose-500',
    description: 'Prolongation of the sound of the vowel letters (Alif, Waw, Yaa) from 2 up to 4, 5, or 6 rhythmic counts.',
    letters: ['ا', 'و', 'ي'],
    examples: [
      { ar: 'جَآءَ نَصْرُ ٱللَّهِ', en: 'Jaaa\'a nasru Allahi', note: 'Madd Muttasil (4-5 counts)' },
      { ar: 'وَلَا ٱلضَّآلِّينَ', en: 'Wa la ad-daaalleen', note: 'Madd Laazim (6 counts)' }
    ]
  },
  {
    id: 'ikhfa',
    name: 'Ikhfa (إِخْفَاء)',
    colorName: 'Warm Amber / Gold',
    colorHex: '#F59E0B',
    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    dotBg: 'bg-amber-500',
    description: 'Concealment: pronouncing Noon Saakinah (نْ) or Tanween halfway between Izhar and Idgham with Ghunnah.',
    letters: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'],
    examples: [
      { ar: 'مِن قَبْلُ', en: 'Min qablu', note: 'Concealed Noon before Qaaf' },
      { ar: 'عَذَابٌ قَرِيبٌ', en: 'Adhaabun qareeb', note: 'Tanween before Qaaf' }
    ]
  },
  {
    id: 'idgham',
    name: 'Idgham (إِدْغَام)',
    colorName: 'Amethyst Purple',
    colorHex: '#8B5CF6',
    badgeBg: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    dotBg: 'bg-purple-500',
    description: 'Merging of Noon Saakinah or Tanween into the subsequent letter of "Yarmaloon". With or without Ghunnah.',
    letters: ['ي', 'ر', 'م', 'ل', 'و', 'ن'],
    mnemonic: 'يَرْمَلُونَ (Yarmaloon)',
    examples: [
      { ar: 'مَن يَقُولُ', en: 'May-yaqoolu', note: 'With Ghunnah (ي)' },
      { ar: 'مِن رَّبِّهِمْ', en: 'Mir-rabbihim', note: 'Without Ghunnah (ر)' }
    ]
  },
  {
    id: 'iqlab',
    name: 'Iqlab (إِقْلَاب)',
    colorName: 'Cyan / Teal',
    colorHex: '#06B6D4',
    badgeBg: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30',
    dotBg: 'bg-cyan-500',
    description: 'Turning Noon Saakinah or Tanween into a concealed Meem (م) when followed by the letter Baa (ب) with Ghunnah.',
    letters: ['ب'],
    examples: [
      { ar: 'مِنۢ بَعْدِ', en: 'Mim-ba\'di', note: 'Noon turned into Meem' },
      { ar: 'عَلِيمٌۢ بِذَاتِ', en: 'Aleemum-bidhati', note: 'Tanween turned into Meem' }
    ]
  }
];

export default function TajweedGuide() {
  const [selectedRule, setSelectedRule] = useState(TAJWEED_RULES[0]);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5EFE4] via-[#FAF7F2] to-[#ECE2CF] border border-[#E4D9C5] p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7D3B] text-[11px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-[#C5A059]" />
            <span>Sacred Recitation Rules</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2B2317] tracking-tight">
            Tajweed Color-Coded Rules Guide
          </h2>
          <p className="text-xs sm:text-sm text-[#6E624E] leading-relaxed">
            Master authentic Quranic phonetics. Each color highlights essential vocalizations such as Ghunnah, Qalqalah, and Madd.
          </p>
        </div>
      </div>

      {/* Rules Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {TAJWEED_RULES.map((rule) => {
          const isSelected = selectedRule.id === rule.id;
          return (
            <motion.div
              key={rule.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRule(rule)}
              className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                isSelected ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20' : 'border-[#E8DFC8] hover:border-[#C5A059]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border font-mono ${rule.badgeBg}`}>
                    {rule.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#6E624E] font-medium font-mono">
                    <span className={`w-2.5 h-2.5 rounded-full ${rule.dotBg}`} />
                    <span>{rule.colorName}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6E624E] leading-relaxed mb-4">
                  {rule.description}
                </p>

                {/* Letters Badge List */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {rule.letters.map((char, idx) => (
                    <span
                      key={idx}
                      className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] font-arabic font-bold text-sm text-[#2C2416] flex items-center justify-center shadow-2xs"
                      dir="rtl"
                    >
                      {char}
                    </span>
                  ))}
                  {rule.mnemonic && (
                    <span className="self-center px-2 py-1 text-[10px] font-mono text-[#9E7D3B] bg-[#C5A059]/10 rounded-lg">
                      {rule.mnemonic}
                    </span>
                  )}
                </div>
              </div>

              {/* Examples Box */}
              <div className="pt-3 border-t border-[#E8DFC8]/60 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-[#9E7D3B] tracking-wider block">
                  Quranic Examples:
                </span>
                {rule.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]/70 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#2C2416]">{ex.en}</p>
                      <span className="text-[10px] text-[#6E624E]">{ex.note}</span>
                    </div>
                    <span
                      className="font-arabic text-base font-bold select-all"
                      style={{ color: rule.colorHex }}
                      dir="rtl"
                    >
                      {ex.ar}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}