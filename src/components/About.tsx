
import React from 'react';
import { Language } from '@/App';

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
    <div className={isPreview ? "" : "py-12 md:py-32"}>
      <div className={`flex flex-col ${isPreview ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-start gap-16 lg:gap-32`}>
        {/* Image Column */}
        <div className="w-full lg:w-5/12">
          <div className="relative aspect-[3/4] overflow-hidden bg-linen-200">
            <img 
              src={STUDIO_PHOTO_1} 
              alt="Witdo Studio Craftsmanship" 
              className="w-full h-full object-cover opacity-90 transition-all duration-[3s] hover:scale-105"
            />
          </div>
          {!isPreview && (
            <div className="mt-8 flex items-center gap-4 opacity-30">
              <div className="w-8 h-px bg-linen-900"></div>
              <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-linen-900">Studio Detail</span>
            </div>
          )}
        </div>
        
        {/* Content Column */}
        <div className="w-full lg:w-7/12 space-y-12 md:space-y-20">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-800 block">
              {t.sub}
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl leading-[1] md:leading-[0.9] serif italic text-linen-900 tracking-tight whitespace-pre-line">
              {t.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-6 text-linen-900 font-light leading-relaxed text-sm md:text-base italic serif opacity-80">
              <p>{t.p1}</p>
            </div>
            
            {!isPreview && (
              <div className="space-y-6 text-linen-900 font-light leading-relaxed text-sm md:text-base italic serif opacity-80">
                <p>{t.p2}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
