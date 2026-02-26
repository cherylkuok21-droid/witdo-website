
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, Category } from '../App';

interface DesignsProps {
  lang: Language;
  initialCategory: Category;
}

interface DesignItem {
  url: string;
  category: Category;
  id: string;
  priceEn: string;
  priceZh: string;
}

const DESIGNS_DATA: DesignItem[] = [
  // The Duo Collection Images
  { url: 'https://lh3.googleusercontent.com/d/1-CIgeNFVymkK0O2On_T_1qt7hkjUijg_', category: 'duo', id: 'D01', priceEn: 'MOP 1,299', priceZh: 'MOP 1,299' },
  { url: 'https://lh3.googleusercontent.com/d/11FyuWBHemNridv0lsqORpexBB6pIc0qW', category: 'duo', id: 'D02', priceEn: 'MOP 1,299', priceZh: 'MOP 1,299' },
  { url: 'https://lh3.googleusercontent.com/d/17Og4VzmT1c3DS9cgkFnkKYFERzVJBLDM', category: 'duo', id: 'D03', priceEn: 'MOP 999', priceZh: 'MOP 999' },
  { url: 'https://lh3.googleusercontent.com/d/1JGRYQu9B1OBpiiwj0Czx5xq1B3OC74G3', category: 'duo', id: 'D04', priceEn: 'MOP 1,299', priceZh: 'MOP 1,299' },
  { url: 'https://lh3.googleusercontent.com/d/1eGlgEbsMcKOGHMMPbsHLp3vdJPIQz1Tl', category: 'duo', id: 'D05', priceEn: 'MOP 1,299', priceZh: 'MOP 1,299' },
  { url: 'https://lh3.googleusercontent.com/d/1nkuIXYgQeS5MRiVNzbVmr6GwxHEsqiTG', category: 'duo', id: 'D06', priceEn: 'MOP 1,299', priceZh: 'MOP 1,299' },
  { url: 'https://lh3.googleusercontent.com/d/1wtYarkM8voQ_3EaOXHESVW1-TbXN6012', category: 'duo', id: 'D07', priceEn: 'MOP 1,299', priceZh: 'MOP 1,299' },
  
  // The Full Set Collection Images
  { url: 'https://lh3.googleusercontent.com/d/15CLoAbIZXfr7KCsVQ2qjk0L9j_DK9qKK', category: 'full', id: 'F01', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },
  { url: 'https://lh3.googleusercontent.com/d/1FGtWSnV1YrdwCuq6OaXyn5XNFqfr0XNo', category: 'full', id: 'F02', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },
  { url: 'https://lh3.googleusercontent.com/d/1Fx4DlwX8AH75s-B7Bxk2o_G7GhNucp2A', category: 'full', id: 'F03', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },
  { url: 'https://lh3.googleusercontent.com/d/1RnA1jemJCm8lW5NjyV-MNDEY6-VADvBo', category: 'full', id: 'F04', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },
  { url: 'https://lh3.googleusercontent.com/d/1h79e8QjpQmPczJKF6ZX4-re-kBSFj8c-', category: 'full', id: 'F05', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },
  { url: 'https://lh3.googleusercontent.com/d/1wsRmsn_EiLc7kjpMfTZSt88JHZQDYcCu', category: 'full', id: 'F06', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },
  { url: 'https://lh3.googleusercontent.com/d/1ysIkek6_48Sh5XCIOv8VOrJiUN8JTI81', category: 'full', id: 'F07', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },

  // The Kinship Collection Images
  { url: 'https://lh3.googleusercontent.com/d/163YvvSqhwwV05XStie-Nd3GCYHIVy5py', category: 'legacy', id: 'L01', priceEn: 'MOP 2,799', priceZh: 'MOP 2,799' },
  { url: 'https://lh3.googleusercontent.com/d/1GRPyERvuw0IGcoXAwNVb95vs9OZhxqyN', category: 'legacy', id: 'L02', priceEn: 'MOP 1,499', priceZh: 'MOP 1,499' },
  { url: 'https://lh3.googleusercontent.com/d/1GYXDqMuiQKxqq1EH5FkBJ13JHCP0SKSy', category: 'legacy', id: 'L03', priceEn: 'MOP 1,499', priceZh: 'MOP 1,499' },
  { url: 'https://lh3.googleusercontent.com/d/1IQUoMLcOzptyz18-5D-y7H0aO1n6nbfl', category: 'legacy', id: 'L04', priceEn: '', priceZh: '' },
  { url: 'https://lh3.googleusercontent.com/d/1PNjnwlmDJwHWgKbFlpJu-ajnWNHDCgzG', category: 'legacy', id: 'L05', priceEn: '', priceZh: '' },
  { url: 'https://lh3.googleusercontent.com/d/1l9KYeWHGR8_FiLJxkxjc2K5rUoP1y3xj', category: 'legacy', id: 'L06', priceEn: 'MOP 1,899', priceZh: 'MOP 1,899' },
  { url: 'https://lh3.googleusercontent.com/d/1vOkiZsC2nynI7-K93rY1uUzywCAy8pLI', category: 'legacy', id: 'L07', priceEn: 'MOP 2,799', priceZh: 'MOP 2,799' },
  { url: 'https://lh3.googleusercontent.com/d/1ylxzIvTtb_TPtc9YYL5Td6NBLdMCn5z-', category: 'legacy', id: 'L08', priceEn: 'MOP 2,799', priceZh: 'MOP 2,799' },
];

const Designs: React.FC<DesignsProps> = ({ lang, initialCategory }) => {
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const content = {
    en: {
      title: "Artwork Gallery",
      sub: "Design Collections",
      desc: "Every cast is a unique masterpiece, tailored to preserve the most delicate details of your family's connection.",
      categories: {
        duo: "The Duo",
        full: "Full Set",
        legacy: "The Kinship"
      },
      termsTitle: "Service Terms",
      terms: [
        "In-studio casting service",
        "Home service fees—please contact customer support",
        "Digital photo files must be provided by the client",
        "Completion in 8-12 weeks after casting & receipt of all details",
        "Delivery service available for an additional MOP 50",
        "Acid-free paper (136 colors) available for FULL SET only",
        "Quotes above apply to infants aged 0-1 year"
      ]
    },
    zh: {
      title: "作品集",
      sub: "設計系列",
      desc: "每一件作品都是獨一無二的傑作，旨在為您的孩子留存最初幾年最細膩的溫柔細節。",
      categories: {
        duo: "一手一腳",
        full: "經典全套",
        legacy: "親情系列"
      },
      termsTitle: "服務須知",
      terms: [
        "到店取模服務",
        "上門服務費用請向客服了解",
        "照片電子檔需由客人提供",
        "取模及資料齊全後約 8-12 星期可完成作品",
        "送貨服務另加收 MOP 50",
        "無酸卡紙 (136種色) 只供 FULL SET 選擇",
        "以上報價為 0-1 歲寶寶價格"
      ]
    }
  };

  const t = content[lang];
  const filteredDesigns = DESIGNS_DATA.filter(d => d.category === activeCategory);

  return (
    <div className="space-y-16 md:space-y-32">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-linen-200 pb-16">
        <div className="lg:w-7/12 space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-800 block">
            {t.sub}
          </span>
          <h2 className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] serif italic text-linen-900 tracking-tight">
            {t.title}
          </h2>
        </div>
        <div className="lg:w-4/12 lg:pt-24 space-y-8">
          <p className="text-lg md:text-xl text-linen-800 font-light italic serif opacity-70 leading-relaxed">
            {t.desc}
          </p>
        </div>
      </div>

      {/* Optimized Category Bar for Mobile */}
      <div className="relative border-b border-linen-200">
        <div className="flex overflow-x-auto no-scrollbar gap-8 md:gap-12 text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] pb-6 -mx-6 px-6 md:mx-0 md:px-0">
          {(Object.keys(t.categories) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category)}
              className={`transition-all relative py-2 whitespace-nowrap ${activeCategory === cat ? 'text-linen-900' : 'text-linen-800 hover:text-linen-900'}`}
            >
              {t.categories[cat as keyof typeof t.categories]}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-0 w-full h-px bg-linen-900"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Optimized Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-12 space-y-8 md:space-y-12">
        {filteredDesigns.map((design, i) => {
          const price = lang === 'en' ? design.priceEn : design.priceZh;
          return (
            <div 
              key={i}
              className="break-inside-avoid relative group bg-linen-50 rounded-sm overflow-hidden"
            >
              <div className="overflow-hidden border border-linen-200/50 shadow-sm transition-shadow duration-500 group-hover:shadow-xl relative">
                <img 
                  src={design.url} 
                  alt={`Witdo Design ${design.id}`} 
                  className="w-full h-auto block brightness-95 group-hover:scale-[1.02] transition-all duration-[1.5s] ease-out"
                  loading="lazy"
                />
                
                {/* Overlay only visible on hover (Desktop) or for context */}
                <div className="absolute inset-0 bg-gradient-to-t from-linen-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-linen-50/80">Edition {design.id}</span>
                    { price && (
                      <span className="text-lg serif italic text-linen-50">{price}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Detailed Mobile Meta */}
              <div className="mt-4 flex justify-between items-baseline px-2 pb-2">
                 <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-linen-800">#{design.id}</span>
                 { price && (
                   <span className="text-xs md:text-sm font-medium tracking-widest text-linen-900">{price}</span>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Section */}
      <div className="pt-20 md:pt-32 mt-12 border-t border-linen-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] md:tracking-[0.6em] text-linen-900 mb-6">
              {t.termsTitle}
            </h3>
            <div className="w-8 h-px bg-linen-900/20 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 px-4 md:px-0">
            {t.terms.map((term, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="w-px h-4 bg-linen-800 mt-1 shrink-0"></span>
                <p className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.15em] md:tracking-[0.2em] text-linen-800 leading-relaxed">
                  {term}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-20 md:py-32 border-t border-linen-200/50 px-6">
         <button 
            onClick={() => navigate('/studio')}
            className="inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] md:tracking-[0.6em] text-linen-900 hover:text-linen-300 transition-all underline underline-offset-[12px] md:underline-offset-[16px]"
         >
           {lang === 'en' ? 'Book Your Session' : '預約製作時間'}
         </button>
      </div>
      
      {/* Hide scrollbar utility for the category bar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Designs;
