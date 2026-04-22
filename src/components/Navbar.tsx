
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Language, Page } from '@/types';

interface NavbarProps {
  scrolled: boolean;
  lang: Language;
  setLang: (l: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, lang, setLang }) => {
  const [showToast, setShowToast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const labels = {
    en: { 
      why: 'The Standard', 
      pricing: 'Prices', 
      about: 'About', 
      location: 'Studio', 
      care: 'Care',
      faq: 'FAQ',
      book: 'Book Now',
      copied: 'ID Copied: witdomacau2',
      menu: 'Menu',
      close: 'Close'
    },
    zh: { 
      why: '極致標準', 
      pricing: '價格', 
      about: '關於', 
      location: '工作室', 
      care: '保養',
      faq: '常見問題',
      book: '立即預約',
      copied: 'ID 已複製: witdomacau2',
      menu: '菜單',
      close: '關閉'
    }
  };

  const navItems: { label: string; path: string; id: Page }[] = [
    { label: labels[lang].about, path: '/about', id: 'about' },
    { label: labels[lang].why, path: '/why', id: 'why' },
    { label: labels[lang].pricing, path: '/designs', id: 'designs' },
    { label: labels[lang].location, path: '/studio', id: 'studio' },
    { label: labels[lang].care, path: '/care', id: 'care' },
    { label: labels[lang].faq, path: '/faq', id: 'faq' },
  ];

  const handleBookNow = () => {
    const wechatId = 'witdomacau2';
    navigator.clipboard.writeText(wechatId).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsMobileMenuOpen(false);
    });
  };

  const isHome = location.pathname === '/';
  const isTransparentHome = isHome && !scrolled;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled || !isHome ? 'bg-linen-100/95 backdrop-blur-md py-4 border-b border-linen-200' : 'bg-transparent py-8'}`}>
        {isTransparentHome && !isMobileMenuOpen && (
          <div className="absolute inset-0 bg-gradient-to-b from-linen-900/10 to-transparent -z-10 pointer-events-none"></div>
        )}
        
        <div className="max-w-7xl mx-auto px-8 md:px-12 flex justify-between items-center">
          <Link 
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-lg md:text-xl font-light tracking-[0.5em] serif uppercase transition-all duration-500 ${isTransparentHome ? 'text-linen-900' : 'text-linen-900'}`}
          >
            Witdo
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-[10px] font-bold uppercase tracking-[0.3em]">
            {navItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                to={item.path}
                className={`transition-all relative group whitespace-nowrap py-1 
                  ${isActive(item.path) ? 'text-linen-900' : isTransparentHome ? 'text-linen-800/80 hover:text-linen-900' : 'text-linen-800 hover:text-linen-900'}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-px bg-linen-900 transition-all duration-500 ${isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* Desktop Social Links */}
            <div className={`hidden lg:flex items-center gap-4 transition-colors duration-500 ${isTransparentHome ? 'text-linen-800' : 'text-linen-800'}`}>
              <a href="https://www.instagram.com/witdo.macau/" target="_blank" rel="noopener noreferrer" className="hover:text-linen-900 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/witdomacao" target="_blank" rel="noopener noreferrer" className="hover:text-linen-900 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <button onClick={handleBookNow} className="hover:text-linen-900 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.493 0 .892.412.892.921s-.399.92-.892.92a.907.907 0 0 1-.892-.92c0-.509.4-.921.892-.921zm4.76 0c.493 0 .891.412.891.921s-.398.92-.891.92a.907.907 0 0 1-.892-.92c0-.509.4-.921.892-.921zM24 10.158c0-4.633-4.545-8.389-10.152-8.389C8.24 1.769 3.696 5.525 3.696 10.158c0 2.503 1.328 4.75 3.425 6.257L6.11 19.33l3.292-1.745c.477.133.974.218 1.48.243-.372-.614-.582-1.323-.582-2.079 0-3.13 3.197-5.666 7.142-5.666 1.458 0 2.808.347 3.903.94-.038-.288-.063-.58-.063-.875-.037-.013-.037-.013-.037-.013L24 10.158zm-7.143 4.45c-3.151 0-5.706 2.029-5.706 4.532 0 2.503 2.555 4.532 5.706 4.532.404 0 .8-.035 1.183-.1l2.632 1.395-.808-2.316c1.677-1.205 2.739-3.003 2.739-5.004 0-2.503-2.555-4.532-5.706-4.532zm-2.031 4.532c-.394 0-.713-.33-.713-.736s.319-.737.713-.737.713.33.713.737-.319.736-.713.736zm4.062 0c-.394 0-.714-.33-.714-.736s.32-.737.714-.737c.393 0 .713.33.713.737s-.32.736-.713.736z"/></svg>
              </button>
            </div>

            {/* Desktop Language Switcher */}
            <div className={`hidden md:flex items-center gap-4 text-[9px] font-bold tracking-[0.2em] transition-colors duration-500 ${isTransparentHome ? 'text-linen-800' : 'text-linen-800'}`}>
              <button 
                onClick={() => setLang('en')} 
                className={`${lang === 'en' ? 'text-linen-900 underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
              >EN</button>
              <span className="opacity-20">|</span>
              <button 
                onClick={() => setLang('zh')} 
                className={`${lang === 'zh' ? 'text-linen-900 underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
              >ZH</button>
            </div>

            <button 
              onClick={handleBookNow}
              className={`hidden sm:flex px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all items-center gap-2
                ${isTransparentHome 
                  ? 'text-linen-900 border border-linen-900/20 hover:bg-linen-900 hover:text-linen-50' 
                  : 'bg-linen-900 text-linen-50 hover:bg-linen-800 shadow-sm'}`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.493 0 .892.412.892.921s-.399.92-.892.92a.907.907 0 0 1-.892-.92c0-.509.4-.921.892-.921zm4.76 0c.493 0 .891.412.891.921s-.398.92-.891.92a.907.907 0 0 1-.892-.92c0-.509.4-.921.892-.921zM24 10.158c0-4.633-4.545-8.389-10.152-8.389C8.24 1.769 3.696 5.525 3.696 10.158c0 2.503 1.328 4.75 3.425 6.257L6.11 19.33l3.292-1.745c.477.133.974.218 1.48.243-.372-.614-.582-1.323-.582-2.079 0-3.13 3.197-5.666 7.142-5.666 1.458 0 2.808.347 3.903.94-.038-.288-.063-.58-.063-.875-.037-.013-.037-.013-.037-.013L24 10.158zm-7.143 4.45c-3.151 0-5.706 2.029-5.706 4.532 0 2.503 2.555 4.532 5.706 4.532.404 0 .8-.035 1.183-.1l2.632 1.395-.808-2.316c1.677-1.205 2.739-3.003 2.739-5.004 0-2.503-2.555-4.532-5.706-4.532zm-2.031 4.532c-.394 0-.713-.33-.713-.736s.319-.737.713-.737.713.33.713.737-.319.736-.713.736zm4.062 0c-.394 0-.714-.33-.714-.736s.32-.737.714-.737c.393 0 .713.33.713.737s-.32.736-.713.736z"/></svg>
              {labels[lang].book}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle Menu"
            >
              <div className={`w-6 h-0.5 bg-linen-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-linen-900 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-linen-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-linen-100 flex flex-col transition-all duration-500 ease-in-out lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex-grow flex flex-col justify-center items-center gap-6 pt-20">
          {navItems.map((item, index) => (
            <Link
              key={`${item.id}-mob-${index}`}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xl md:text-2xl serif italic tracking-wide transition-all ${isActive(item.path) ? 'text-linen-900 underline underline-offset-8' : 'text-linen-800'}`}
            >
              {item.label}
            </Link>
          ))}
          <button 
            onClick={handleBookNow}
            className="mt-4 text-linen-900 text-[12px] font-bold uppercase tracking-[0.5em] border-b border-linen-900 pb-2"
          >
            {labels[lang].book}
          </button>
        </div>
        
        <div className="p-12 border-t border-linen-200 flex flex-col gap-8 bg-linen-50">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 text-[11px] font-bold tracking-[0.3em]">
              <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-linen-900' : 'text-linen-800'}>ENGLISH</button>
              <button onClick={() => setLang('zh')} className={lang === 'zh' ? 'text-linen-900' : 'text-linen-800'}>中文</button>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-linen-800 hover:text-linen-900 transition-colors"
              aria-label={labels[lang].close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="flex gap-8 text-linen-800">
            <a href="https://www.instagram.com/witdo.macau/" target="_blank" rel="noopener noreferrer" className="hover:text-linen-900 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://www.facebook.com/witdomacao" target="_blank" rel="noopener noreferrer" className="hover:text-linen-900 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <button onClick={handleBookNow} className="hover:text-linen-900 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.493 0 .892.412.892.921s-.399.92-.892.92a.907.907 0 0 1-.892-.92c0-.509.4-.921.892-.921zm4.76 0c.493 0 .891.412.891.921s-.398.92-.891.92a.907.907 0 0 1-.892-.92c0-.509.4-.921.892-.921zM24 10.158c0-4.633-4.545-8.389-10.152-8.389C8.24 1.769 3.696 5.525 3.696 10.158c0 2.503 1.328 4.75 3.425 6.257L6.11 19.33l3.292-1.745c.477.133.974.218 1.48.243-.372-.614-.582-1.323-.582-2.079 0-3.13 3.197-5.666 7.142-5.666 1.458 0 2.808.347 3.903.94-.038-.288-.063-.58-.063-.875-.037-.013-.037-.013-.037-.013L24 10.158zm-7.143 4.45c-3.151 0-5.706 2.029-5.706 4.532 0 2.503 2.555 4.532 5.706 4.532.404 0 .8-.035 1.183-.1l2.632 1.395-.808-2.316c1.677-1.205 2.739-3.003 2.739-5.004 0-2.503-2.555-4.532-5.706-4.532zm-2.031 4.532c-.394 0-.713-.33-.713-.736s.319-.737.713-.737.713.33.713.737-.319.736-.713.736zm4.062 0c-.394 0-.714-.33-.714-.736s.32-.737.714-.737c.393 0 .713.33.713.737s-.32.736-.713.736z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {createPortal(
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] transition-all duration-500 ${showToast ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="bg-linen-900 text-linen-50 px-8 py-4 shadow-2xl flex flex-col items-center gap-2 border border-linen-800 w-[90vw] max-w-sm text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{labels[lang].copied}</span>
            <span className="text-[9px] opacity-60 uppercase tracking-widest">{lang === 'en' ? 'Please add us on WeChat' : '請在微信中添加我們'}</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Navbar;
