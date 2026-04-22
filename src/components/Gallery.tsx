
import React from 'react';
import { Language } from '@/App';

interface GalleryProps {
  lang: Language;
}

const INSTAGRAM_URL = "https://www.instagram.com/witdo.macau/";

/**
 * Using verified direct-link IDs from the user's studio work.
 * These are high-fidelity images that represent the brand better than API thumbnails.
 */
const STUDIO_WORKS = [
  { url: 'https://lh3.googleusercontent.com/d/1v9V0tNryf00lC9H7z5ql6IJ4UOVHxTza', id: '01' },
  { url: 'https://lh3.googleusercontent.com/d/1CcekDByFaplKvyn2KkYCEJCq_92u7ovg', id: '02' },
  { url: 'https://lh3.googleusercontent.com/d/1v9V0tNryf00lC9H7z5ql6IJ4UOVHxTza', id: '03' },
  { url: 'https://lh3.googleusercontent.com/d/1CcekDByFaplKvyn2KkYCEJCq_92u7ovg', id: '04' },
  { url: 'https://lh3.googleusercontent.com/d/1v9V0tNryf00lC9H7z5ql6IJ4UOVHxTza', id: '05' },
  { url: 'https://lh3.googleusercontent.com/d/1CcekDByFaplKvyn2KkYCEJCq_92u7ovg', id: '06' },
];

const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  const content = {
    en: {
      title: "Studio Curation",
      sub: "Artistic Journal",
      btn: "View Live Instagram",
      desc: "A window into our daily craftsmanship. We preserve the most delicate details of infancy through a lens of architectural precision."
    },
    zh: {
      title: "動態藝廊",
      sub: "日常紀錄",
      btn: "追蹤我們的 Instagram",
      desc: "這是我們工作室的日常縮影。我們致力於以建築美學的精準視角，留存嬰兒時期最細膩的溫柔。"
    }
  };

  const t = content[lang];

  return (
    <div className="space-y-24 bg-linen-100">
      <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-linen-200 pb-16">
        <div className="max-w-2xl space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-linen-300 block">{t.sub}</span>
          <h2 className="text-6xl md:text-8xl serif italic text-linen-900 tracking-tighter">{t.title}</h2>
          <p className="text-xl text-linen-800 font-light italic serif opacity-60 leading-relaxed">
            {t.desc}
          </p>
        </div>
        <a 
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-linen-900 text-linen-50 px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-linen-800 transition-all flex items-center gap-3 shadow-lg"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          {t.btn}
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {STUDIO_WORKS.map((post, i) => (
          <a 
            key={i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-square relative group overflow-hidden bg-linen-200 border border-linen-200/50 shadow-sm"
          >
            <img 
              src={post.url} 
              alt={`Witdo Studio Work ${post.id}`} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-linen-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <div className="w-10 h-10 rounded-full bg-linen-50/20 backdrop-blur-sm border border-linen-50/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
               </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="text-center pt-12">
         <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-linen-300">
           @witdo.macau
         </span>
      </div>
    </div>
  );
};

export default Gallery;
