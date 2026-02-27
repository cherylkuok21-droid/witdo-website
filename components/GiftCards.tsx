
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Language } from '../App';

interface GiftCardsProps {
  lang: Language;
}

const GiftCards: React.FC<GiftCardsProps> = ({ lang }) => {
  const [showToast, setShowToast] = useState(false);

  const content = {
    en: {
      title: "Gift Cards",
      sub: "Share the memory",
      desc: "A Witdo gift card is more than a present; it's the promise of a preserved memory. Perfect for baby showers, full moons, or first birthdays.",
      howTo: "How to Purchase",
      steps: [
        "Contact us via WeChat or Instagram",
        "Select your desired gift card value",
        "Receive a digital gift card",
        "The recipient can book their session at their convenience"
      ],
      cta: "Purchase via WeChat",
      copied: "ID Copied: witdomacau2"
    },
    zh: {
      title: "禮品卡",
      sub: "分享珍貴回憶",
      desc: "Witdo 禮品卡不僅是一份禮物，更是一份永恆回憶的承諾。非常適合百日宴、滿月禮或週歲生日。",
      howTo: "如何購買",
      steps: [
        "通過微信或 Instagram 與我們聯繫",
        "選擇您想要的禮品卡面額",
        "獲取電子版禮品卡",
        "收禮人可隨時預約製作時間"
      ],
      cta: "通過微信購買",
      copied: "ID 已複製: witdomacau2"
    }
  };

  const t = content[lang];

  const handleBookNow = () => {
    const wechatId = 'witdomacau2';
    navigator.clipboard.writeText(wechatId).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  return (
    <div className="py-16 md:py-32 px-8 md:px-12 max-w-7xl mx-auto fade-in space-y-24">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-linen-200 pb-16">
        <div className="md:w-7/12 space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-800 block">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 pt-16 border-t border-linen-200">
        <div className="space-y-12">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-linen-900">{t.howTo}</h3>
          <div className="space-y-8">
            {t.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6">
                <span className="text-[10px] font-bold text-linen-800">0{i + 1}</span>
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

      {/* Toast Notification */}
      {createPortal(
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] transition-all duration-500 ${showToast ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="bg-linen-900 text-linen-50 px-8 py-4 shadow-2xl flex flex-col items-center gap-2 border border-linen-800 w-[90vw] max-w-sm text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t.copied}</span>
            <span className="text-[9px] opacity-60 uppercase tracking-widest">{lang === 'en' ? 'Please add us on WeChat' : '請在微信中添加我們'}</span>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GiftCards;
