
import React from 'react';
import { Language } from '../App';

interface FAQProps {
  lang: Language;
}

const faqsData = {
  en: [
    { 
      q: "Is the materials safe for my baby?", 
      a: "Absolutely. We use professional molding powder manufactured in the UK, certified by both ASTM (USA) and the EU Product Safety Directive. The material is 99% natural seaweed-based alginate, which is non-toxic, hypoallergenic, and biodegradable, making it perfectly safe for newborns and the environment." 
    },
    { 
      q: "What is the best age for casting?", 
      a: "There is no age limit; it depends entirely on your preference. Most parents choose meaningful milestones such as 10 days old, 1 month, 2 months, or the 100-day celebration to capture those fleeting early details." 
    },
    { 
      q: "How long does the session take?", 
      a: "We typically schedule 30-60 minutes per appointment. The actual time depends on the baby's temperament and the complexity of the chosen collection, but we ensure a calm, unhurried environment." 
    },
    { 
      q: "When will my finished work be ready?", 
      a: "Due to the natural drying time of the high-density stone and our meticulous multi-layer hand-finishing process, completion typically takes 8 to 12 weeks." 
    },
  ],
  zh: [
    { 
      q: "材料安全嗎？", 
      a: "絕對安全。我們採用英國製造，且通過 ASTM (美國材料與試驗協會) 及 EU Product Safety Directive (歐盟商品安全指令) 認證的專業模粉。主要成份為 99% 天然海藻膠，無毒無污染，對皮膚極其溫和。使用後的膠體會自然分解，是既乾淨又環保的印模材料。" 
    },
    { 
      q: "寶寶最佳取模期是？", 
      a: "取模沒有任何年齡限制，主要按父母喜好選擇。通常父母會選擇寶寶出生十多天、滿月、兩個月或 100 日等具有紀念意義的日子進行製作。" 
    },
    { 
      q: "取模需時多久？", 
      a: "本館通常會為每個預約安排 30-60 分鐘。實際所需時間會視乎寶寶當下的狀態及實際製作情況而定，我們會確保過程在輕鬆、專業的氛圍下完成。" 
    },
    { 
      q: "成品何時可以取貨？", 
      a: "由於高品質石膏需要充足的自然乾燥時間，加上繁瑣的手工修整與上漆工藝，成品通常需要 8 到 12 週完成。" 
    },
  ]
};

const FAQ: React.FC<FAQProps> = ({ lang }) => {
  const t = {
    en: { 
      title: "Common Enquiries", 
      subtitle: "Frequently Asked Questions",
      contact: "For specific requests, please contact the studio directly."
    },
    zh: { 
      title: "常見問題", 
      subtitle: "解答您的疑問",
      contact: "如有特殊需求，請直接與工作室聯繫。"
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-24 py-12">
      <div className="text-center space-y-6">
        <span className="text-[11px] uppercase tracking-[0.8em] text-linen-300 font-bold block">{t[lang].subtitle}</span>
        <h2 className="text-6xl md:text-8xl text-linen-50 serif italic tracking-tighter">{t[lang].title}</h2>
        <div className="w-12 h-px bg-linen-50/20 mx-auto mt-8"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
        {faqsData[lang].map((f, i) => (
          <div key={i} className="group space-y-6 text-left">
            <div className="flex gap-6 items-start">
               <span className="text-linen-300 serif italic text-3xl opacity-40">0{i+1}</span>
               <div className="space-y-4">
                 <h4 className="text-2xl font-medium text-linen-50 serif italic leading-tight">{f.q}</h4>
                 <p className="text-linen-100/60 font-light leading-relaxed text-lg italic serif group-hover:text-linen-50 transition-colors duration-500">
                   {f.a}
                 </p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-linen-300 italic opacity-60">
          {t[lang].contact}
        </p>
      </div>
    </div>
  );
};

export default FAQ;
