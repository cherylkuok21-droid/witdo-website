
import React from 'react';
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-12 order-2 lg:order-1">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">{t.sub}</span>
          <h2 
            className="text-5xl md:text-7xl italic leading-none tracking-tighter" 
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
          >
            {t.title}
          </h2>
        </div>
        
        <div className="space-y-10 pt-4">
          <div className="flex gap-8 border-b border-stone-200 pb-8">
            <div className="w-1/2 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{t.addrLabel}</h4>
              <p className="text-lg text-stone-800 whitespace-pre-line leading-relaxed serif italic">{t.address}</p>
            </div>
            <div className="w-1/2 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{t.hoursLabel}</h4>
              <p className="text-lg text-stone-800 whitespace-pre-line leading-relaxed serif italic">{t.hours}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{t.contactLabel}</h4>
            <p className="text-xl text-stone-900 font-light tracking-widest">mo.witdo@gmail.com</p>
          </div>
        </div>

        <div className="pt-4">
          <a 
            href="https://maps.app.goo.gl/9M9D5WfG6r7Z3vBv8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-stone-900 text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-all"
          >
            {t.btn}
          </a>
        </div>
      </div>
      
      <div className="order-1 lg:order-2">
        <div className="relative group overflow-hidden shadow-2xl bg-stone-200 aspect-[4/5]">
          <div className="absolute inset-0 bg-stone-900/10 z-10"></div>
          <img 
            src={STUDIO_EXTERIOR}
            alt="Witdo Studio Facade" 
            className="w-full h-full object-cover transition-all duration-[2.5s]"
          />
          <div className="absolute top-8 right-8 z-20">
             <div className="bg-white text-stone-900 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] shadow-lg">
                Rua do Alm. Sergio 285
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
