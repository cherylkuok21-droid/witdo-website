
import React, { useState } from 'react';
import { Language, Page } from '../App';

interface FooterProps {
  lang: Language;
  setCurrentPage: (p: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ lang, setCurrentPage }) => {
  const [showToast, setShowToast] = useState(false);

  const labels = {
    en: {
      desc: "Artisanal preservation of life's first forms. Designed and crafted with architectural intent in Macau.",
      explore: "Curation",
      studio: "The Studio",
      rights: "© Witdo. Est. 2016",
      collections: "Collections",
      copied: "ID Copied: witdomacau2",
      faq: "FAQ",
      philosophy: "The Standard",
      care: "Care",
      follow: "Follow",
      location: "Location",
      bookings: "Bookings",
      giftcards: "Gift Cards"
    },
    zh: {
      desc: "生命最初形態的匠心留存。於澳門以建築美學精神設計與製作。",
      explore: "作品策劃",
      studio: "工作室",
      rights: "© Witdo. Est. 2016",
      collections: "系列方案",
      copied: "ID 已複製: witdomacau2",
      faq: "常見問題",
      philosophy: "極致標準",
      care: "保養",
      follow: "關注我們",
      location: "工作室地點",
      bookings: "預約製作",
      giftcards: "禮品卡"
    }
  };

  const handleBookNow = () => {
    const wechatId = 'witdomacau2';
    navigator.clipboard.writeText(wechatId).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  return (
    <footer className="bg-linen-100 border-t border-linen-200 pt-16 pb-12 px-8 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.5em] font-bold text-linen-900">{labels[lang].explore}</h4>
            <ul className="space-y-2 text-[11px] uppercase tracking-[0.3em] text-linen-800 font-medium">
              <li><button onClick={() => setCurrentPage('designs')} className="hover:text-linen-900 transition-all text-left">{labels[lang].collections}</button></li>
              <li><button onClick={() => setCurrentPage('why')} className="hover:text-linen-900 transition-all text-left">{labels[lang].philosophy}</button></li>
              <li><button onClick={() => setCurrentPage('care')} className="hover:text-linen-900 transition-all text-left">{labels[lang].care}</button></li>
              <li><button onClick={() => setCurrentPage('faq')} className="hover:text-linen-900 transition-all text-left">{labels[lang].faq}</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.5em] font-bold text-linen-900">{labels[lang].studio}</h4>
            <ul className="space-y-2 text-[11px] uppercase tracking-[0.3em] text-linen-800 font-medium">
              <li><button onClick={() => setCurrentPage('studio')} className="hover:text-linen-900 transition-all text-left">{labels[lang].location}</button></li>
              <li><button onClick={handleBookNow} className="hover:text-linen-900 transition-all text-left">{labels[lang].bookings}</button></li>
              <li><button onClick={() => setCurrentPage('giftcards')} className="hover:text-linen-900 transition-all text-left">{labels[lang].giftcards}</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.5em] font-bold text-linen-900">{labels[lang].follow}</h4>
            <ul className="space-y-2 text-[11px] uppercase tracking-[0.3em] text-linen-800 font-medium">
              <li>
                <a 
                  href="https://www.instagram.com/witdo.macau/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-linen-900 transition-all block"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/witdomacao" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-linen-900 transition-all block"
                >
                  Facebook
                </a>
              </li>
              <li>
                <button 
                  onClick={handleBookNow} 
                  className="hover:text-linen-900 transition-all text-left"
                >
                  WeChat
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-linen-200 flex flex-col md:flex-row justify-center items-center gap-8 text-[10px] uppercase tracking-[0.5em] text-linen-800 font-bold">
        <div>{labels[lang].rights}</div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] transition-all duration-500 ${showToast ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-linen-900 text-linen-50 px-8 py-4 shadow-2xl flex flex-col items-center gap-2 border border-linen-800 w-[90vw] max-w-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{labels[lang].copied}</span>
          <span className="text-[9px] opacity-60 uppercase tracking-widest">{lang === 'en' ? 'Please add us on WeChat' : '請在微信中添加我們'}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
