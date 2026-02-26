
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface LocationProps {
  lang: Language;
}

const STUDIO_EXTERIOR = "https://lh3.googleusercontent.com/d/1CcekDByFaplKvyn2KkYCEJCq_92u7ovg";

const Location: React.FC<LocationProps> = ({ lang }) => {
  const content = {
    en: {
      title: "Our Studio",
      sub: "Visit Us",
      addrLabel: "Address",
      hoursLabel: "Opening Hours",
      contactLabel: "Get In Touch",
      address: "Rua do Alm. Sergio no.285, R/C\nMacau",
      hours: "Monday – Sunday: 11:30 – 20:00\nStrictly By Appointment",
      btn: "Open in Google Maps"
    },
    zh: {
      title: "Our Studio",
      sub: "誠邀參觀",
      addrLabel: "詳細地址",
      hoursLabel: "營業時間",
      contactLabel: "聯繫資訊",
      address: "澳門河邊新街 285 號地下",
      hours: "週一至週日: 11:30 – 20:00\n僅限預約制",
      btn: "在 Google 地圖中開啟"
    }
  };

  const t = content[lang];

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Header Section */}
      <div className="space-y-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-300 block">
          {t.sub}
        </span>
        <h2 className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] serif italic text-linen-900 tracking-tight">
          {t.title}
        </h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start pt-16 border-t border-linen-200/60">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-300">{t.addrLabel}</h4>
              <p className="text-xl text-linen-900 serif italic leading-relaxed whitespace-pre-line">
                {t.address}
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-300">{t.hoursLabel}</h4>
              <p className="text-xl text-linen-900 serif italic leading-relaxed whitespace-pre-line">
                {t.hours}
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-linen-300">{t.contactLabel}</h4>
              <p className="text-xl text-linen-900 serif italic leading-relaxed">
                mo.witdo@gmail.com
              </p>
            </div>
          </div>

          <div className="pt-8">
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
        </div>

        {/* Image Column */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] lg:aspect-[16/10] overflow-hidden bg-linen-200"
          >
            <img 
              src={STUDIO_EXTERIOR}
              alt="Witdo Studio Facade" 
              className="w-full h-full object-cover grayscale-[0.2] hover:scale-105 transition-transform duration-[3s] ease-out"
            />
            <div className="absolute bottom-8 right-8 text-white text-[9px] font-bold uppercase tracking-[0.4em] mix-blend-difference">
              Exterior View
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Location;
