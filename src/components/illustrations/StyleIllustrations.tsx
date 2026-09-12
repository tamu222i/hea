import React from 'react';
import { StyleTypeId } from '../../domain/models/StyleTypes';

interface StyleIllustrationProps {
  typeId: StyleTypeId;
  className?: string;
}

export const StyleIllustration: React.FC<StyleIllustrationProps> = ({ typeId, className = 'w-36 h-36' }) => {
  switch (typeId) {
    case StyleTypeId.POP_SPORTY:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-100 via-yellow-100 to-sky-100 shadow-inner border border-amber-200 ${className}`}>
          {/* Pop Sporty Girl illustration with Onion Ponytail & Cap */}
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#FEF08A" fillOpacity="0.4" />
            <circle cx="160" cy="40" r="14" fill="#38BDF8" fillOpacity="0.6" />
            <circle cx="35" cy="150" r="10" fill="#F97316" fillOpacity="0.5" />
            {/* Sparkles */}
            <path d="M150 70L153 78L161 81L153 84L150 92L147 84L139 81L147 78Z" fill="#FBBF24" />
            <path d="M40 50L42 55L47 57L42 59L40 64L38 59L33 57L38 55Z" fill="#38BDF8" />
            
            {/* Hair base (Brown/Caramel) */}
            <ellipse cx="100" cy="108" rx="44" ry="46" fill="#854D0E" />
            
            {/* Onion Ponytail - Bubble 1, 2, 3 */}
            <path d="M135 60 C145 45, 170 50, 165 68 C160 80, 140 75, 135 60 Z" fill="#9A3412" />
            <ellipse cx="156" cy="62" rx="14" ry="12" fill="#B45309" />
            <ellipse cx="168" cy="85" rx="12" ry="10" fill="#B45309" />
            <ellipse cx="174" cy="106" rx="9" ry="8" fill="#B45309" />
            {/* Colorful Bands */}
            <rect x="156" y="72" width="10" height="4" rx="2" fill="#0284C7" transform="rotate(15 156 72)" />
            <rect x="166" y="94" width="8" height="4" rx="2" fill="#F59E0B" transform="rotate(15 166 94)" />
            
            {/* Face */}
            <ellipse cx="100" cy="112" rx="34" ry="34" fill="#FED7AA" />
            {/* Cheeks */}
            <circle cx="82" cy="120" r="6" fill="#F43F5E" fillOpacity="0.4" />
            <circle cx="118" cy="120" r="6" fill="#F43F5E" fillOpacity="0.4" />
            {/* Happy Eyes */}
            <path d="M80 110 Q86 103 92 110" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
            <path d="M108 110 Q114 103 120 110" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
            {/* Big Smile */}
            <path d="M92 124 Q100 135 108 124" fill="#DC2626" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Sporty Bangs & Cap visor */}
            <path d="M72 90 Q100 78 128 90 Q118 102 108 95 Q98 104 88 95 Z" fill="#B45309" />
            <path d="M68 82 Q100 68 132 82 Q145 74 125 64 Q95 60 70 70 Z" fill="#0284C7" />
            <circle cx="100" cy="74" r="4" fill="#FBBF24" />

            {/* Sporty Clothes collar */}
            <path d="M80 144 Q100 152 120 144 L138 185 Q100 195 62 185 Z" fill="#FACC15" />
            <path d="M88 147 L100 162 L112 147" stroke="#1E293B" strokeWidth="3" fill="none" />
          </svg>
        </div>
      );

    case StyleTypeId.SWEET_GIRLY:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 shadow-inner border border-pink-200 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#FCE7F3" fillOpacity="0.5" />
            {/* Floating Hearts & Ribbons */}
            <path d="M35 50 C35 45, 45 40, 48 48 C51 40, 61 45, 61 50 C61 60, 48 68, 48 68 C48 68, 35 60, 35 50 Z" fill="#F472B6" fillOpacity="0.6" />
            <path d="M150 140 C150 136, 158 132, 160 138 C162 132, 170 136, 170 140 C170 148, 160 154, 160 154 C160 154, 150 148, 150 140 Z" fill="#C084FC" fillOpacity="0.6" />
            
            {/* Long Wavy Hair (Soft Honey Brown) */}
            <path d="M60 90 C50 130, 45 170, 70 190 C80 160, 75 120, 75 100 Z" fill="#78350F" />
            <path d="M140 90 C150 130, 155 170, 130 190 C120 160, 125 120, 125 100 Z" fill="#78350F" />
            
            {/* Kururinpa twists */}
            <ellipse cx="68" cy="102" rx="9" ry="14" fill="#92400E" transform="rotate(20 68 102)" />
            <ellipse cx="132" cy="102" rx="9" ry="14" fill="#92400E" transform="rotate(-20 132 102)" />
            {/* Ribbons */}
            <path d="M66 94 L58 88 L68 88 L66 94 Z" fill="#EC4899" />
            <path d="M134 94 L142 88 L132 88 L134 94 Z" fill="#EC4899" />
            <circle cx="66" cy="94" r="3" fill="#FDF2F8" />
            <circle cx="134" cy="94" r="3" fill="#FDF2F8" />

            {/* Face */}
            <ellipse cx="100" cy="112" rx="33" ry="33" fill="#FED7AA" />
            {/* Cheeks */}
            <circle cx="83" cy="122" r="7" fill="#FB7185" fillOpacity="0.4" />
            <circle cx="117" cy="122" r="7" fill="#FB7185" fillOpacity="0.4" />
            {/* Cute anime twinkling eyes */}
            <ellipse cx="86" cy="112" rx="5" ry="6" fill="#451A03" />
            <ellipse cx="114" cy="112" rx="5" ry="6" fill="#451A03" />
            <circle cx="84" cy="110" r="2" fill="#FFFFFF" />
            <circle cx="112" cy="110" r="2" fill="#FFFFFF" />
            {/* Gentle smile */}
            <path d="M95 125 Q100 130 105 125" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Soft Bangs */}
            <path d="M72 90 Q100 82 128 90 C122 102, 108 100, 100 96 C92 100, 78 102, 72 90 Z" fill="#92400E" />

            {/* Ruffled Collar & Dress */}
            <path d="M80 144 Q100 152 120 144 L142 185 Q100 195 58 185 Z" fill="#F472B6" />
            <path d="M75 145 C85 152, 95 145, 100 152 C105 145, 115 152, 125 145" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M98 152 L94 162 L106 162 Z" fill="#A855F7" />
          </svg>
        </div>
      );

    case StyleTypeId.COOL_CASUAL:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100 shadow-inner border border-slate-200 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#E2E8F0" fillOpacity="0.4" />
            {/* Modern geometric sparkles */}
            <rect x="150" y="45" width="12" height="12" rx="3" fill="#0EA5E9" fillOpacity="0.5" transform="rotate(45 150 45)" />
            <rect x="35" y="135" width="10" height="10" rx="2" fill="#1E293B" fillOpacity="0.4" transform="rotate(45 35 135)" />
            
            {/* Sleek Short/Bob Dark Hair */}
            <path d="M64 96 C60 120, 65 145, 76 156 C80 135, 78 115, 76 96 Z" fill="#0F172A" />
            <path d="M136 96 C140 120, 135 145, 124 156 C120 135, 122 115, 124 96 Z" fill="#0F172A" />
            
            {/* Face */}
            <ellipse cx="100" cy="112" rx="33" ry="33" fill="#FED7AA" />
            {/* Cheeks subtle */}
            <circle cx="83" cy="122" r="5" fill="#FB7185" fillOpacity="0.25" />
            <circle cx="117" cy="122" r="5" fill="#FB7185" fillOpacity="0.25" />
            {/* Smart, sharp eyes */}
            <path d="M80 111 L91 110" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="87" cy="113" r="3.5" fill="#0F172A" />
            <path d="M120 111 L109 110" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="113" cy="113" r="3.5" fill="#0F172A" />
            {/* Cool confident smile */}
            <path d="M95 126 Q102 130 108 126" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Straight modern bangs */}
            <path d="M68 90 Q100 82 132 90 C125 100, 108 98, 100 96 C92 98, 75 100, 68 90 Z" fill="#1E293B" />
            
            {/* Gold Cross Hairpin */}
            <line x1="68" y1="96" x2="80" y2="108" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="96" x2="68" y2="108" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

            {/* Street Style Hoodie / Bomber */}
            <path d="M76 144 Q100 152 124 144 L145 185 Q100 195 55 185 Z" fill="#1E3A8A" />
            {/* Inner White Tee */}
            <path d="M88 147 Q100 156 112 147 L114 185 L86 185 Z" fill="#FFFFFF" />
            {/* Zip Line */}
            <line x1="100" y1="156" x2="100" y2="185" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
          </svg>
        </div>
      );

    case StyleTypeId.NATURAL_PURE:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-50 via-lime-50 to-amber-50 shadow-inner border border-emerald-200 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#ECFDF5" fillOpacity="0.5" />
            {/* Leaves & Nature touches */}
            <path d="M42 45 C42 45, 52 42, 55 52 C55 52, 45 55, 42 45 Z" fill="#65A30D" fillOpacity="0.6" />
            <path d="M152 135 C152 135, 162 132, 165 142 C165 142, 155 145, 152 135 Z" fill="#84CC16" fillOpacity="0.6" />
            
            {/* Soft Side Braid Hair (Chestnut) */}
            <path d="M68 92 C60 120, 65 150, 75 180 C82 178, 80 150, 78 120 Z" fill="#5F370E" />
            {/* Braid links on right side */}
            <ellipse cx="128" cy="115" rx="8" ry="10" fill="#713F12" transform="rotate(15 128 115)" />
            <ellipse cx="132" cy="132" rx="8" ry="10" fill="#713F12" transform="rotate(15 132 132)" />
            <ellipse cx="136" cy="149" rx="7" ry="9" fill="#713F12" transform="rotate(15 136 149)" />
            <ellipse cx="140" cy="164" rx="5" ry="7" fill="#713F12" transform="rotate(15 140 164)" />
            {/* Natural Linen Hair Band */}
            <rect x="136" y="170" width="8" height="4" rx="2" fill="#D97706" />

            {/* Face */}
            <ellipse cx="100" cy="112" rx="33" ry="33" fill="#FED7AA" />
            {/* Cheeks */}
            <circle cx="83" cy="122" r="6" fill="#F87171" fillOpacity="0.35" />
            <circle cx="117" cy="122" r="6" fill="#F87171" fillOpacity="0.35" />
            {/* Kind gentle eyes */}
            <ellipse cx="86" cy="112" rx="4.5" ry="5" fill="#451A03" />
            <ellipse cx="114" cy="112" rx="4.5" ry="5" fill="#451A03" />
            <circle cx="85" cy="110" r="1.5" fill="#FFFFFF" />
            <circle cx="113" cy="110" r="1.5" fill="#FFFFFF" />
            {/* Warm, gentle smile */}
            <path d="M94 125 Q100 131 106 125" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Natural Airy Bangs */}
            <path d="M72 88 Q100 80 128 88 C120 98, 108 96, 100 93 C92 96, 80 98, 72 88 Z" fill="#713F12" />

            {/* Linen Blouse & Salopette */}
            <path d="M78 144 Q100 150 122 144 L142 185 Q100 195 58 185 Z" fill="#FEF3C7" />
            {/* Green Salopette Straps */}
            <rect x="80" y="148" width="10" height="37" fill="#65A30D" />
            <rect x="110" y="148" width="10" height="37" fill="#65A30D" />
            <circle cx="85" cy="155" r="2.5" fill="#F59E0B" />
            <circle cx="115" cy="155" r="2.5" fill="#F59E0B" />
          </svg>
        </div>
      );

    case StyleTypeId.TRENDY_IDOL:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-fuchsia-100 via-purple-50 to-pink-100 shadow-inner border border-purple-200 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#F3E8FF" fillOpacity="0.5" />
            <path d="M152 50 L155 58 L163 61 L155 64 L152 72 L149 64 L141 61 L149 58 Z" fill="#A855F7" />
            <path d="M38 135 L40 140 L45 142 L40 144 L38 149 L36 144 L31 142 L36 140 Z" fill="#EC4899" />
            
            <circle cx="68" cy="68" r="16" fill="#6B21A8" />
            <circle cx="132" cy="68" r="16" fill="#6B21A8" />
            <circle cx="68" cy="68" r="10" fill="#9333EA" />
            <circle cx="132" cy="68" r="10" fill="#9333EA" />
            <path d="M62 62 C62 59, 66 56, 68 61 C70 56, 74 59, 74 62 C74 67, 68 71, 68 71 C68 71, 62 67, 62 62 Z" fill="#F43F5E" />
            <path d="M126 62 C126 59, 130 56, 132 61 C134 56, 138 59, 138 62 C138 67, 132 71, 132 71 C132 71, 126 67, 126 62 Z" fill="#F43F5E" />

            <ellipse cx="100" cy="108" rx="42" ry="44" fill="#581C87" />
            <ellipse cx="100" cy="112" rx="33" ry="33" fill="#FED7AA" />
            <circle cx="83" cy="122" r="6.5" fill="#EC4899" fillOpacity="0.4" />
            <circle cx="117" cy="122" r="6.5" fill="#EC4899" fillOpacity="0.4" />
            <ellipse cx="114" cy="112" rx="5.5" ry="6.5" fill="#2E1065" />
            <circle cx="113" cy="110" r="2" fill="#FFFFFF" />
            <path d="M80 112 Q86 106 92 112" stroke="#2E1065" strokeWidth="3" strokeLinecap="round" />
            <path d="M93 124 Q100 134 107 124 Z" fill="#E11D48" stroke="#2E1065" strokeWidth="2" />
            <path d="M72 90 Q100 82 128 90 C120 100, 108 97, 100 95 C92 97, 80 100, 72 90 Z" fill="#7E22CE" />
            <path d="M76 144 Q100 152 124 144 L145 185 Q100 195 55 185 Z" fill="#9333EA" />
            <path d="M88 147 L100 165 L112 147" fill="#FFFFFF" />
            <path d="M97 155 L100 162 L103 155 Z" fill="#F43F5E" />
          </svg>
        </div>
      );

    case StyleTypeId.SECRET_UNICORN:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-100 to-sky-200 shadow-xl border-2 border-amber-300 animate-pulse ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#FDF2F8" fillOpacity="0.6" />
            <polygon points="100,18 108,60 92,60" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
            <ellipse cx="100" cy="112" rx="46" ry="46" fill="#F472B6" />
            <ellipse cx="100" cy="114" rx="34" ry="34" fill="#FEF3C7" />
            <circle cx="82" cy="120" r="6" fill="#F43F5E" fillOpacity="0.4" />
            <circle cx="118" cy="120" r="6" fill="#F43F5E" fillOpacity="0.4" />
            <ellipse cx="85" cy="112" rx="5" ry="6" fill="#4A044E" />
            <circle cx="84" cy="110" r="2" fill="#FFFFFF" />
            <ellipse cx="115" cy="112" rx="5" ry="6" fill="#4A044E" />
            <circle cx="114" cy="110" r="2" fill="#FFFFFF" />
            <path d="M94 125 Q100 132 106 125" stroke="#4A044E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M60 70 Q40 50 20 80 Q50 90 65 85 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <path d="M140 70 Q160 50 180 80 Q150 90 135 85 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <text x="100" y="185" textAnchor="middle" fontSize="14" fontWeight="900" fill="#BE185D">🦄 UNICORN</text>
          </svg>
        </div>
      );

    case StyleTypeId.SECRET_MAGICAL:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 shadow-xl border-2 border-pink-400 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#FFF1F2" fillOpacity="0.6" />
            <path d="M100 25 L106 42 L124 42 L110 52 L115 69 L100 58 L85 69 L90 52 L76 42 L94 42 Z" fill="#F43F5E" />
            <ellipse cx="100" cy="110" rx="42" ry="44" fill="#FB7185" />
            <ellipse cx="100" cy="112" rx="33" ry="33" fill="#FED7AA" />
            <ellipse cx="85" cy="112" rx="5" ry="6" fill="#881337" />
            <circle cx="84" cy="110" r="2" fill="#FFFFFF" />
            <ellipse cx="115" cy="112" rx="5" ry="6" fill="#881337" />
            <circle cx="114" cy="110" r="2" fill="#FFFFFF" />
            <path d="M93 124 Q100 134 107 124 Z" fill="#E11D48" />
            <text x="100" y="185" textAnchor="middle" fontSize="13" fontWeight="900" fill="#E11D48">💖 MAGICAL GIRL</text>
          </svg>
        </div>
      );

    case StyleTypeId.SECRET_CYBER:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-cyan-300 via-slate-900 to-emerald-300 shadow-xl border-2 border-cyan-400 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#090D16" />
            <circle cx="100" cy="100" r="75" stroke="#00F0FF" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            <ellipse cx="100" cy="108" rx="40" ry="42" fill="#00F0FF" fillOpacity="0.4" />
            <ellipse cx="100" cy="110" rx="32" ry="32" fill="#FEF3C7" />
            <rect x="74" y="105" width="52" height="14" rx="4" fill="#00F0FF" fillOpacity="0.8" />
            <text x="100" y="116" textAnchor="middle" fontSize="10" fontWeight="900" fill="#090D16">CYBER</text>
            <text x="100" y="180" textAnchor="middle" fontSize="12" fontWeight="900" fill="#00F0FF">⚡ CYBER FAIRY</text>
          </svg>
        </div>
      );

    case StyleTypeId.SECRET_PHARAOH:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-300 via-yellow-100 to-blue-900 shadow-xl border-2 border-amber-400 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="#FEF9C3" fillOpacity="0.5" />
            <path d="M60 50 L140 50 L160 140 L140 160 L60 160 L40 140 Z" fill="#1E3A8A" />
            <rect x="65" y="60" width="70" height="8" fill="#FACC15" />
            <rect x="65" y="80" width="70" height="8" fill="#FACC15" />
            <ellipse cx="100" cy="110" rx="30" ry="32" fill="#FED7AA" />
            <path d="M82 110 L94 110" stroke="#0F172A" strokeWidth="3" />
            <path d="M106 110 L118 110" stroke="#0F172A" strokeWidth="3" />
            <text x="100" y="182" textAnchor="middle" fontSize="12" fontWeight="900" fill="#B45309">👑 PHARAOH</text>
          </svg>
        </div>
      );

    case StyleTypeId.SECRET_COSMIC:
      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-950 to-pink-900 shadow-xl border-2 border-purple-400 ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#0B0F19" />
            <ellipse cx="100" cy="100" rx="75" ry="35" stroke="#D946EF" strokeWidth="2" transform="rotate(-25 100 100)" fill="none" />
            <circle cx="100" cy="100" r="30" fill="#8B5CF6" />
            <circle cx="88" cy="94" r="4" fill="#FFFFFF" />
            <text x="100" y="180" textAnchor="middle" fontSize="12" fontWeight="900" fill="#E879F9">🌌 COSMIC GALAXY</text>
          </svg>
        </div>
      );

    default:
      // Dynamic avatar for all other 100 styles!
      const isSporty = typeId.startsWith('sporty_');
      const isGirly = typeId.startsWith('girly_');
      const isCool = typeId.startsWith('cool_');
      const isNatural = typeId.startsWith('natural_');
      const isTrendy = typeId.startsWith('trendy_');
      const isClassic = typeId.startsWith('classic_');
      const isSubcul = typeId.startsWith('subcul_');
      const isAnimal = typeId.startsWith('animal_');
      const isNature = typeId.startsWith('nature_');
      const isFantasy = typeId.startsWith('fantasy_');

      const bgGradient = isGirly || isTrendy
        ? 'from-pink-100 via-rose-50 to-purple-100 border-pink-200'
        : isCool || isSubcul
        ? 'from-slate-100 via-sky-50 to-indigo-100 border-indigo-200'
        : isNatural || isNature
        ? 'from-emerald-50 via-teal-50 to-amber-50 border-emerald-200'
        : isClassic
        ? 'from-amber-50 via-stone-50 to-orange-50 border-amber-200'
        : isAnimal
        ? 'from-yellow-100 via-amber-50 to-orange-100 border-yellow-200'
        : isFantasy
        ? 'from-purple-100 via-fuchsia-50 to-cyan-100 border-purple-200'
        : 'from-amber-100 via-yellow-100 to-sky-100 border-amber-200';

      const hairColor = isGirly ? '#BE185D' : isCool ? '#1E293B' : isNatural ? '#78350F' : isFantasy ? '#7C3AED' : isAnimal ? '#B45309' : '#854D0E';

      return (
        <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br ${bgGradient} shadow-inner border ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" fill="#FFFFFF" fillOpacity="0.6" />
            <ellipse cx="100" cy="108" rx="44" ry="46" fill={hairColor} />
            <ellipse cx="100" cy="112" rx="34" ry="34" fill="#FED7AA" />
            <circle cx="82" cy="120" r="6" fill="#F43F5E" fillOpacity="0.3" />
            <circle cx="118" cy="120" r="6" fill="#F43F5E" fillOpacity="0.3" />
            <ellipse cx="85" cy="112" rx="5" ry="6" fill="#1E293B" />
            <circle cx="84" cy="110" r="2" fill="#FFFFFF" />
            <ellipse cx="115" cy="112" rx="5" ry="6" fill="#1E293B" />
            <circle cx="114" cy="110" r="2" fill="#FFFFFF" />
            <path d="M93 124 Q100 133 107 124" fill="#E11D48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M72 90 Q100 80 128 90 Q118 100 100 95 Q82 100 72 90 Z" fill={hairColor} />
            <path d="M78 144 Q100 152 122 144 L140 185 Q100 195 60 185 Z" fill={isGirly ? '#F472B6' : isCool ? '#38BDF8' : isNatural ? '#34D399' : '#FBBF24'} />
          </svg>
        </div>
      );
  }
};

