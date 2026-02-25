
import React from 'react';
import { Language, Page } from '../App';

interface HeroProps {
  lang: Language;
  setCurrentPage: (p: Page) => void;
}

// Updated with the new image ID from the provided link
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1v9V0tNryf00lC9H7z5ql6IJ4UOVHxTza";

const Hero: React.FC<HeroProps> = ({ lang, setCurrentPage }) => {
  const content = {
    en: {
      sub: "Professional Hand & Foot Casting",
      title: "The tactile \n essence of memory",
      desc: "Capturing the delicate form of infancy through museum-grade materials and architectural precision.",
      btn1: "Our Philosophy",
      btn2: "Contact Studio"
    },
    zh: {
      // Per user request: Do not translate the main slogans for the Chinese version
      sub: "Professional Hand & Foot Casting",
      title: "The tactile \n essence of memory",
      desc: "Capturing the delicate form of infancy through museum-grade materials and architectural precision.",
      btn1: "了解理念",
      btn2: "聯繫工作室"
    }
  };

  return (
    <div className="relative min-h-screen md:min-h-[120vh] w-full flex items-center justify-center overflow-hidden bg-linen-100">
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_IMAGE} 
          alt="Baby hand casting detail" 
          className="w-full h-full object-cover opacity-40 md:opacity-60 mix-blend-multiply scale-100 transition-transform duration-[10s] hover:scale-105"
        />
        {/* Adjusted gradient for mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-linen-100/10 via-linen-100/60 to-linen-100 md:bg-gradient-to-t md:from-linen-100 md:via-linen-100/40 md:to-transparent"></div>
        <div className="absolute inset-0 bg-linen-900/5"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-0">
        <div className="flex flex-col md:items-center md:text-center">
          {/* Mobile: Vertical Subtitle / Desktop: Horizontal */}
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="hidden md:block w-12 h-px bg-linen-900/20"></div>
            <span className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.8em] text-linen-900 font-bold opacity-90">
              {content[lang].sub}
            </span>
          </div>
          
          {/* Large high-contrast serif headers */}
          <h1 className="text-6xl md:text-[11rem] font-extralight leading-[0.85] text-linen-900 mb-10 md:mb-14 serif italic tracking-tighter drop-shadow-sm max-w-4xl">
            {content[lang].title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          
          <div className="relative md:max-w-2xl md:mx-auto">
            {/* Decorative line for mobile */}
            <div className="absolute -left-6 top-0 bottom-0 w-px bg-linen-900/10 md:hidden"></div>
            
            <p className="text-lg md:text-2xl text-linen-900 font-light mb-12 md:mb-20 tracking-tight leading-relaxed italic serif opacity-80">
              {content[lang].desc}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-start md:justify-center gap-6 md:gap-10">
            <button 
              onClick={() => setCurrentPage('why')}
              className="bg-linen-900 text-linen-50 px-10 md:px-14 py-5 md:py-6 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all shadow-xl"
            >
              {content[lang].btn1}
            </button>
            <button 
              onClick={() => setCurrentPage('studio')}
              className="group relative text-linen-900 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] py-5 md:py-6 px-4 text-center"
            >
              {content[lang].btn2}
              <span className="absolute bottom-4 left-4 right-4 h-px bg-linen-900/30 transition-all group-hover:left-0 group-hover:right-0 group-hover:bg-linen-900"></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Visual cue indicator */}
      <div className="absolute bottom-12 left-6 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center gap-6">
        <div className="w-px h-16 md:h-24 bg-gradient-to-b from-linen-900 to-transparent opacity-30"></div>
      </div>
    </div>
  );
};

export default Hero;
