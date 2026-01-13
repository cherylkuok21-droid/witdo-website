
import React from 'react';
import { Language, Page, Category } from '../App';

interface PricingProps {
  lang: Language;
  setCurrentPage: (p: Page) => void;
  navigateToDesigns: (c: Category) => void;
}

const Pricing: React.FC<PricingProps> = ({ lang, setCurrentPage, navigateToDesigns }) => {
  const content = {
    en: {
      title: "Collections",
      subtitle: "Fine art that preserves a lifetime of memories.",
      footer: "Custom frames and additional cast combinations available upon request.",
      viewDesigns: "View Designs",
      tiers: [
        { id: 'duo' as Category, name: 'The Duo', price: '999', prefix: 'From MOP ', suffix: '', features: ['Choice of 2 Casts', 'Professional Life-casting Session', 'Authentic Solid Wood Frame', 'Acid Etched Metal Name Plate'] },
        { id: 'full' as Category, name: 'The Full Set', price: '1,899', prefix: 'From MOP ', suffix: '', features: ['Complete 4-Piece Set', 'Extended Casting Session', 'Authentic Solid Wood Frame', 'Acid Etched Metal Name Plate', '136 Archival Acid-Free Colors'] },
        { id: 'legacy' as Category, name: 'The Kinship', price: '1,499', prefix: 'From MOP ', suffix: '', features: ['Custom Group Posing', 'Large Format Display', 'Private Consultation', 'Authentic Solid Wood Frame', 'Acid Etched Metal Name Plate', '136 Archival Acid-Free Colors'] }
      ]
    },
    zh: {
      title: "Collections",
      subtitle: "值得一生珍藏的藝術品。",
      footer: "另提供多樣化相框選擇與客製化鑄模組合，歡迎諮詢。",
      viewDesigns: "查看設計",
      tiers: [
        { id: 'duo' as Category, name: '一手一腳', price: '999', prefix: 'MOP ', suffix: ' 起', features: ['精選 2 件作品組合', '專業生命翻模課程', '天然原木工藝相框', '手工酸蝕金屬名牌'] },
        { id: 'full' as Category, name: '經典全套', price: '1,899', prefix: 'MOP ', suffix: ' 起', features: ['完整 4 件作品組合', '深度取模製作時長', '天然原木工藝相框', '手工酸蝕金屬名牌', '136 色檔案級無酸襯紙'] },
        { id: 'legacy' as Category, name: '親情系列', price: '1,499', prefix: 'MOP ', suffix: ' 起', features: ['客製化團體動態造型', '大尺寸藝術展示型裝裱', '一對一私人設計諮詢', '天然原木工藝相框', '手工酸蝕金屬名牌', '136 色檔案級無酸襯紙'] }
      ]
    }
  };

  const current = content[lang];

  return (
    <div className="space-y-24 bg-linen-100">
      <div className="text-center space-y-6">
        <h2 
          className="text-6xl md:text-9xl italic text-linen-900 tracking-tighter" 
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
        >
          {current.title}
        </h2>
        <p className="text-xl text-linen-800 font-light italic serif opacity-70">{current.subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {current.tiers.map((tier, i) => (
          <div key={i} className="bg-linen-50 p-12 py-16 border border-linen-200/50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-700 group min-h-[620px]">
            <h3 
              className="text-4xl mb-8 italic text-linen-900 tracking-tighter" 
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
            >
              {tier.name}
            </h3>
            
            <div className="text-linen-900 mb-10 tracking-tight flex items-baseline">
              <span className="text-xs uppercase tracking-widest opacity-60 mr-1 font-bold">{tier.prefix}</span>
              <span className="text-3xl font-light">{tier.price}</span>
              <span className="text-xs uppercase tracking-widest opacity-60 ml-1 font-bold">{tier.suffix}</span>
            </div>
            
            <div className="h-px w-12 bg-linen-200 mb-12 group-hover:w-full transition-all duration-700"></div>
            
            <ul className="space-y-6 mb-12 flex-grow text-[10px] uppercase tracking-[0.3em] text-linen-800 font-medium leading-relaxed">
              {tier.features.map((f, j) => (
                <li key={j} className="opacity-70 group-hover:opacity-100 transition-opacity">
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => navigateToDesigns(tier.id)}
              className="w-full bg-linen-900 text-linen-50 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all shadow-md active:scale-95 mt-auto"
            >
              {current.viewDesigns}
            </button>
          </div>
        ))}
      </div>
      <p className="text-center text-linen-300 text-[10px] uppercase tracking-[0.5em] font-medium">
        {current.footer}
      </p>
    </div>
  );
};

export default Pricing;
