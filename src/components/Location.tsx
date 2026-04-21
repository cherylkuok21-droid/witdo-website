
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface LocationProps {
  lang: Language;
}

const STUDIO_EXTERIOR = "https://lh3.googleusercontent.com/d/1CcekDByFaplKvyn2KkYCEJCq_92u7ovg";
const CARPARK_IMAGE = "https://lh3.googleusercontent.com/d/1x6-a34zXp0I5Zwwm4xDe8Oeh0p4o9xZx";

const Location: React.FC<LocationProps> = ({ lang }) => {
  const [showToast, setShowToast] = useState(false);

  const content = {
    en: {
      title: "Our Studio",
      sub: "Visit Us",
      addrLabel: "Address",
      hoursLabel: "Opening Hours",
      contactLabel: "Get In Touch",
      parkingLabel: "Parking",
      busLabel: "Bus Stop",
      address: "Rua do Alm. Sergio no.285, R/C\nMacau",
      hours: "Monday – Sunday: 11:30 – 20:00\nStrictly By Appointment",
      parking: "Open-air parking lot next to the Maritime School opposite (1-minute walk from the studio)",
      bus: "Bus stop in front of the studio: A-Ma Temple Station\n1, 2, 5, 6B, 10, 11, 18, 60, 61, 65, 16S, 21A, 26, 28B, 55, 71S, MT4, N3",
      btn: "Open in Google Maps",
      wechatLink: "Click to add WeChat for booking",
      copied: "ID Copied: witdomacau2"
    },
    zh: {
      title: "Our Studio",
      sub: "誠邀參觀",
      addrLabel: "詳細地址",
      hoursLabel: "營業時間",
      contactLabel: "聯繫資訊",
      parkingLabel: "停車地方",
      busLabel: "巴士站",
      address: "澳門河邊新街 285 號地下",
      hours: "週一至週日: 11:30 – 20:00\n僅限預約制",
      parking: "對面的航海學校旁有露天停車場 (距店1分鐘腳程)",
      bus: "店門口巴士站： 媽閣廟站\n1, 2, 5, 6B, 10, 11, 18, 60, 61, 65, 16S, 21A, 26, 28B, 55, 71S, MT4, N3",
      btn: "在 Google 地圖中開啟",
      wechatLink: "點我添加微信預約",
      copied: "ID 已複製: witdomacau2"
    }
  };

  const t = content[lang];

  const handleCopyWeChat = () => {
    const wechatId = 'witdomacau2';
    navigator.clipboard.writeText(wechatId).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Header Section */}
      <div className="space-y-6 md:space-y-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-300 block">
          {t.sub}
        </span>
        <h2 className="text-5xl md:text-8xl lg:text-9xl leading-[0.9] serif italic text-linen-900 tracking-tight">
          {t.title}
        </h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-24 items-start pt-12 md:pt-16 border-t border-linen-200/60">
        {/* Left Column: Visuals & Primary Info */}
        <div className="lg:col-span-7 space-y-12 md:space-y-16">
          {/* Studio Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/10] overflow-hidden bg-linen-200 rounded-sm"
          >
            <img 
              src={STUDIO_EXTERIOR}
              alt="Witdo Studio Facade" 
              className="w-full h-full object-cover grayscale-[0.2] hover:scale-105 transition-transform duration-[3s] ease-out"
            />
            <div className="absolute bottom-6 right-6 text-white text-[9px] font-bold uppercase tracking-[0.4em] mix-blend-difference">
              Exterior View
            </div>
          </motion.div>

          {/* Maps Link */}
          <div className="pt-2">
            <a 
              href="https://maps.app.goo.gl/KtUuz2c68sSbU43M7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-linen-900"
            >
              <span className="border-b border-linen-900 pb-1 group-hover:border-linen-300 transition-colors">
                {t.btn}
              </span>
              <span className="text-lg">→</span>
            </a>
          </div>

          {/* Address & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-12">
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">{t.addrLabel}</h4>
              <p className="text-lg md:text-xl text-linen-900 serif italic leading-relaxed whitespace-pre-line">
                {t.address}
              </p>
            </div>
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">{t.hoursLabel}</h4>
              <p className="text-lg md:text-xl text-linen-900 serif italic leading-relaxed whitespace-pre-line">
                {t.hours}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Transportation & Contact */}
        <div className="lg:col-span-5 space-y-12 md:space-y-16">
          <div className="space-y-10 md:space-y-12">
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">{t.parkingLabel}</h4>
              <p className="text-lg md:text-xl text-linen-900 serif italic leading-relaxed whitespace-pre-line">
                {t.parking}
              </p>
              <div className="mt-4 aspect-[16/9] overflow-hidden bg-linen-200 rounded-sm">
                <img 
                  src={CARPARK_IMAGE} 
                  alt="Parking location" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">{t.busLabel}</h4>
              <div className="space-y-3">
                <p className="text-lg md:text-xl text-linen-900 serif italic leading-relaxed">
                  {t.bus.split('\n')[0]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t.bus.split('\n')[1].split(', ').map((route, idx) => (
                    <span key={idx} className="px-2 py-1 bg-linen-200/50 text-linen-900 text-[9px] md:text-[10px] font-bold tracking-wider rounded-sm">
                      {route}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 pt-8 border-t border-linen-200/40">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-800">{t.contactLabel}</h4>
              <div className="space-y-2">
                <p className="text-lg md:text-xl text-linen-900 serif italic leading-relaxed">
                  mo.witdo@gmail.com
                </p>
                <button 
                  onClick={handleCopyWeChat}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-linen-900 hover:text-linen-400 transition-colors border-b border-linen-900/20 pb-1"
                >
                  {t.wechatLink}
                </button>
              </div>
            </div>
          </div>
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

export default Location;
