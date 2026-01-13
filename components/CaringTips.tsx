
import React from 'react';
import { Language } from '../App';

interface CaringTipsProps {
  lang: Language;
}

const tipsData = {
  en: {
    title: "Preserving Your Artwork",
    subtitle: "Professional maintenance guidelines for your handcrafted keepsakes.",
    guarantee: "Lifetime Quality Commitment",
    items: [
      { title: "Maintain Dryness", desc: "Ensure the display environment remains dry and well-ventilated to protect the integrity of the materials." },
      { title: "Do Not Disassemble", desc: "Avoid opening the frame yourself. Keeping the seal intact prevents oxidation and environmental damage." },
      { title: "Wall Mounting", desc: "If hanging on a wall, please ensure it is not mounted on gypsum/plasterboard surfaces for safety." },
      { title: "Photo Changes", desc: "Should you need to update the photograph inside, please book an appointment for professional handling at our studio." },
      { title: "Dusting Routine", desc: "For routine cleaning, a gentle sweep with a feather duster is sufficient to maintain the surface." },
      { title: "Surface Care", desc: "Do not use wet or dry cloths on the plexiglass; this causes scratches or water marks that diminish clarity." }
    ]
  },
  zh: {
    title: "藝術品保養指南",
    subtitle: "專業維護建議，確保您的珍貴回憶長久如新。",
    guarantee: "品質終身承諾",
    items: [
      { title: "環境乾爽", desc: "保持置放環境乾爽，避免潮濕影響作品與框架的保存狀態。" },
      { title: "切勿拆卸", desc: "儘可能不自行拆開框架，保持密封狀態可避免作品與空氣過度接觸。" },
      { title: "掛牆說明", desc: "如需掛牆展示，請務必留意勿掛於石膏板（隔牆板）上，以策安全。" },
      { title: "更換照片", desc: "如日後需要更換框架內的照片，請預約時間帶回本店，由專業人員為您處理。" },
      { title: "日常除塵", desc: "平日保養只需使用羽毛掃輕輕清掃表面塵埃即可，簡單且安全。" },
      { title: "玻璃清潔", desc: "不建議用乾/濕布抹有機玻璃表面，以免產生刮痕或水跡，影響美觀。" }
    ]
  }
};

const CaringTips: React.FC<CaringTipsProps> = ({ lang }) => {
  const current = tipsData[lang];
  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-linen-200 pb-12">
        <div className="max-w-xl space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-linen-300 block">Care & Maintenance</span>
          <h2 className="text-5xl md:text-7xl serif italic text-linen-900">{current.title}</h2>
          <p className="text-linen-800 font-light italic serif opacity-60">{current.subtitle}</p>
        </div>
        <div className="bg-linen-200/50 px-8 py-4 border-l-2 border-linen-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-900">{current.guarantee}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md: Batesville-cols-2 lg:grid-cols-3 gap-12">
        {current.items.map((tip, i) => (
          <div key={i} className="group space-y-6 p-2 transition-all">
            <div className="flex items-center gap-6">
              <span className="text-2xl serif italic text-linen-300 opacity-50 group-hover:opacity-100 transition-opacity">0{i+1}</span>
              <h3 className="text-xl text-linen-900 serif italic font-medium">{tip.title}</h3>
            </div>
            <p className="text-linen-800 text-sm leading-relaxed font-light italic serif opacity-70 pl-12 border-l border-linen-200 group-hover:border-linen-900 transition-all duration-700">
              {tip.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-linen-300">Est. 2016 Macau</p>
      </div>
    </div>
  );
};

export default CaringTips;
