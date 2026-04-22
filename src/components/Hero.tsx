
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Language } from '@/types';

interface HeroProps {
  lang: Language;
}

// Updated with the new image ID from the provided link
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1v9V0tNryf00lC9H7z5ql6IJ4UOVHxTza";

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const navigate = useNavigate();
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
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-linen-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_IMAGE} 
          alt="Baby hand casting detail" 
          className="w-full h-full object-cover opacity-70 md:opacity-60 transition-transform duration-[10s] hover:scale-105"
        />
        {/* Subtle gradient overlay for text legibility at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-linen-100/90 via-linen-100/20 to-transparent md:from-linen-100 md:via-linen-100/40 md:to-transparent"></div>
      </div>
      
      {/* Top Section (Meta) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 pt-16 md:pt-24">
        <div className="flex items-center">
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] text-linen-900 font-medium">
            {content[lang].sub}
          </span>
        </div>
      </div>

      {/* Bottom Section (Title & CTA) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 pb-16 md:pb-24">
        <div className="max-w-4xl space-y-10 md:space-y-14">
          <h1 className="text-5xl md:text-[10rem] font-light leading-[1.1] md:leading-[0.85] text-linen-900 serif italic tracking-tight md:tracking-tighter">
            {content[lang].title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
            <Link 
              to="/why"
              className="group relative text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-linen-900 py-2"
            >
              {content[lang].btn1}
              <span className="absolute bottom-0 left-0 w-6 md:w-8 h-px bg-linen-900 transition-all group-hover:w-full"></span>
            </Link>
            
            <Link 
              to="/studio"
              className="group relative text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-linen-900 py-2"
            >
              {content[lang].btn2}
              <span className="absolute bottom-0 left-0 w-6 md:w-8 h-px bg-linen-900 transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
