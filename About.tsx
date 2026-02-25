
import React from 'react';
import { Language } from '../App';

interface AboutProps {
  lang: Language;
  isPreview?: boolean;
}

const STUDIO_PHOTO_1 = "https://lh3.googleusercontent.com/d/1v9V0tNryf00lC9H7z5ql6IJ4UOVHxTza";

const About: React.FC<AboutProps> = ({ lang, isPreview = false }) => {
  const content = {
    en: {
      sub: "Founding Philosophy",
      title: "Obsession in \n the Details",
      p1: "At Witdo, we are defined by a singular, unyielding obsession with the finer things. We know that when it comes to preserving the essence of your loved ones, only the absolute best will suffice.",
      p2: "Memories are priceless, yet our individual recollection is often limited. Our mission is to freeze that fleeting moment of wonder. By capturing every microscopic detail to perfection, we ensure that your final artwork is not just a cast, but a tangible legacy utterly unique to your family's story."
    },
    zh: {
      sub: "品牌初衷",
      title: "Obsession in \n the Details",
      p1: "在 Witdo 的每一件作品中，您都能感受到我們對細節近乎偏執的追求。無論是材料的挑選、技術的磨練還是美學的設計——我們只想要最好的，因為您也只值得最好的。",
      p2: "感動是無價的，而記憶卻往往隨時間淡去。就讓我們為您凝結當下的那份溫柔。從指尖最細小的紋理到肌膚柔軟的弧度，我們精準捕捉每一處完美細節，確保您的最終作品成為世界上獨一無二的傳家珍寶。"
    }
  };

  const t = content[lang];

  return (
    <div className={isPreview ? "" : "py-24"}>
      <div className={`flex flex-col ${isPreview ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-24 lg:gap-32`}>
        <div className="lg:w-1/2 relative group">
          <div className="absolute -inset-6 bg-linen-200/50 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>
          <div className={`overflow-hidden relative z-10 ${isPreview ? 'aspect-[4/5]' : 'aspect-[3/4]'} bg-linen-200`}>
            <img 
              src={STUDIO_PHOTO_1} 
              alt="Witdo Studio Craftsmanship" 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-[3s]"
            />
          </div>
        </div>
        
        <div className="lg:w-1/2 space-y-16 text-left">
          <div className="space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-linen-300">{t.sub}</span>
            <h2 className={`${isPreview ? 'text-6xl md:text-8xl' : 'text-7xl md:text-9xl'} leading-[0.85] serif italic text-linen-900 tracking-tighter whitespace-pre-line`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t.title}
            </h2>
          </div>
          
          <div className={`space-y-10 text-linen-900 font-light leading-relaxed ${isPreview ? 'text-xl' : 'text-2xl'} max-w-xl italic serif`}>
            <p className="opacity-80">
              {t.p1}
            </p>
            {!isPreview && (
              <p className="pt-8 border-t border-linen-200/50">
                {t.p2}
              </p>
            )}
          </div>

          <div className="pt-8">
             <div className="w-16 h-px bg-linen-900/10 mb-8"></div>
             <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-linen-300">Est. 2016 Macau</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
