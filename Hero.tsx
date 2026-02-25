
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
      sub: "Artisanal Preservation Studio",
      title: "The tactile \n essence of memory",
      desc: "Capturing the delicate form of infancy through museum-grade materials and architectural precision.",
      btn1: "Our Philosophy",
      btn2: "Contact Studio"
    },
    zh: {
      // Per user request: Do not translate the main slogans for the Chinese version
      sub: "Artisanal Preservation Studio",
      title: "The tactile \n essence of memory",
      desc: "Capturing the delicate form of infancy through museum-grade materials and architectural precision.",
      btn1: "了解理念",
      btn2: "聯繫工作室"
    }
  };

  return (
    <div className="relative min-h-[120vh] w-full flex items-start justify-center overflow-hidden bg-linen-100">
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_IMAGE} 
          alt="Baby hand casting detail" 
          className="w-full h-full object-cover opacity-60 mix-blend-multiply scale-100 transition-transform duration-[10s] hover:scale-105"
        />
        {/* Warm linen gradient overlay - adjusted to allow image to breathe */}
        <div className="absolute inset-0 bg-gradient-to-t from-linen-100 via-linen-100/40 to-transparent"></div>
        <div className="absolute inset-0 bg-linen-900/5"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-6xl mt-32 pt-[220px] pb-32">
        <span className="block text-[11px] uppercase tracking-[0.8em] text-linen-900 mb-12 font-bold opacity-90 drop-shadow-sm">
          {content[lang].sub}
        </span>
        
        {/* Large high-contrast serif headers */}
        <h1 className="text-7xl md:text-[11rem] font-extralight leading-[0.85] text-linen-900 mb-14 serif italic whitespace-pre-line tracking-tighter drop-shadow-md">
          {content[lang].title}
        </h1>
        
        <p className="text-xl md:text-2xl text-linen-900 font-light mb-20 tracking-tight max-w-2xl mx-auto leading-relaxed italic serif">
          {content[lang].desc}
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <button 
            onClick={() => setCurrentPage('why')}
            className="bg-linen-900 text-linen-50 px-14 py-6 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all w-full md:w-auto min-w-[260px] shadow-xl"
          >
            {content[lang].btn1}
          </button>
          <button 
            onClick={() => setCurrentPage('studio')}
            className="group relative text-linen-900 text-[11px] font-bold uppercase tracking-[0.4em] py-6 px-4"
          >
            {content[lang].btn2}
            <span className="absolute bottom-4 left-4 right-4 h-px bg-linen-900 transition-all group-hover:left-0 group-hover:right-0"></span>
          </button>
        </div>
      </div>
      
      {/* Visual cue indicator moved slightly higher to maintain balance */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
        <div className="w-px h-24 bg-gradient-to-b from-linen-900 to-transparent opacity-40"></div>
      </div>
    </div>
  );
};

export default Hero;
