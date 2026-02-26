
import React from 'react';
import { Language } from '../App';

interface GiftCardsProps {
  lang: Language;
}

const GiftCards: React.FC<GiftCardsProps> = ({ lang }) => {
  const content = {
    en: {
      title: "Gift Cards",
      sub: "Share the memory",
      desc: "A Witdo gift card is more than a present; it's the promise of a preserved memory. Perfect for baby showers, full moons, or first birthdays.",
      optionsTitle: "Available Options",
      options: [
        { name: "The Duo Gift", value: "MOP 999", desc: "Covers a standard Duo collection session." },
        { name: "The Full Set Gift", value: "MOP 1,899", desc: "Covers a complete Full Set collection." },
        { name: "Custom Amount", value: "Flexible", desc: "Choose any amount to contribute towards a collection." }
      ],
      howTo: "How to Purchase",
      steps: [
        "Contact us via WeChat or Instagram",
        "Select your desired gift card value",
        "Receive a digital or physical premium gift card",
        "The recipient can book their session at their convenience"
      ],
      cta: "Purchase via WeChat"
    },
    zh: {
      title: "禮品卡",
      sub: "分享珍貴回憶",
      desc: "Witdo 禮品卡不僅是一份禮物，更是一份永恆回憶的承諾。非常適合百日宴、滿月禮或週歲生日。",
      optionsTitle: "可選方案",
      options: [
        { name: "一手一腳禮品卡", value: "MOP 999", desc: "涵蓋標準「一手一腳」系列製作。" },
        { name: "經典全套禮品卡", value: "MOP 1,899", desc: "涵蓋完整的「經典全套」系列製作。" },
        { name: "自定義金額", value: "彈性金額", desc: "自由選擇金額，用於抵扣任何系列作品。" }
      ],
      howTo: "如何購買",
      steps: [
        "通過微信或 Instagram 與我們聯繫",
        "選擇您想要的禮品卡面額",
        "獲取電子版或實體高級禮品卡",
        "收禮人可隨時預約製作時間"
      ],
      cta: "通過微信購買"
    }
  };

  const t = content[lang];

  const handleBookNow = () => {
    const wechatId = 'witdomacau2';
    navigator.clipboard.writeText(wechatId).then(() => {
      alert(lang === 'en' ? 'WeChat ID Copied: witdomacau2' : '微信 ID 已複製: witdomacau2');
    });
  };

  return (
    <div className="py-16 md:py-32 px-8 md:px-12 max-w-7xl mx-auto fade-in space-y-24">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-linen-200 pb-16">
        <div className="md:w-7/12 space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-300 block">
            {t.sub}
          </span>
          <h2 className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] serif italic text-linen-900 tracking-tight">
            {t.title}
          </h2>
        </div>
        <div className="md:w-4/12 md:pt-24">
          <p className="text-lg md:text-xl text-linen-800 font-light italic serif opacity-70 leading-relaxed">
            {t.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {t.options.map((opt, i) => (
          <div key={i} className="bg-linen-50 p-12 border border-linen-200/50 flex flex-col items-center text-center space-y-6">
            <h3 className="text-2xl serif italic text-linen-900">{opt.name}</h3>
            <div className="text-3xl font-light text-linen-900">{opt.value}</div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-linen-300 leading-relaxed">
              {opt.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 pt-16 border-t border-linen-200">
        <div className="space-y-12">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-linen-900">{t.howTo}</h3>
          <div className="space-y-8">
            {t.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6">
                <span className="text-[10px] font-bold text-linen-300">0{i + 1}</span>
                <p className="text-[11px] uppercase tracking-[0.2em] text-linen-800 font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center bg-linen-900 p-16 text-linen-50 text-center space-y-8">
          <p className="text-sm serif italic opacity-80">
            {lang === 'en' 
              ? "Ready to give the gift of a lifetime?" 
              : "準備好送出一份珍貴的禮物了嗎？"}
          </p>
          <button 
            onClick={handleBookNow}
            className="px-12 py-4 border border-linen-50/20 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-linen-50 hover:text-linen-900 transition-all"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
