
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyWitdo from './components/WhyWitdo';
import About from './components/About';
import Location from './components/Location';
import FAQ from './components/FAQ';
import CaringTips from './components/CaringTips';
import Footer from './components/Footer';
import Designs from './components/Designs';
import GiftCards from './components/GiftCards';
import OwnerPortal from './components/OwnerPortal';

export type Language = 'en' | 'zh';
export type Page = 'home' | 'why' | 'about' | 'studio' | 'care' | 'designs' | 'faq' | 'giftcards';
export type Category = 'duo' | 'full' | 'legacy';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [initialCategory, setInitialCategory] = useState<Category>('duo');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-linen-100 selection:bg-linen-300">
      <ScrollToTop />
      <Navbar 
        scrolled={scrolled} 
        lang={lang} 
        setLang={setLang} 
      />
      <main className={`flex-grow ${isHome ? '' : 'pt-16'}`}>
        <Routes>
          <Route path="/" element={<Hero lang={lang} />} />
          <Route path="/why" element={
            <section className="py-16 md:py-32 px-8 md:px-12 max-w-7xl mx-auto fade-in">
              <WhyWitdo lang={lang} />
            </section>
          } />
          <Route path="/designs" element={
            <section className="py-32 bg-linen-100 px-6 fade-in min-h-[80vh]">
              <div className="max-w-7xl mx-auto w-full">
                <Designs lang={lang} initialCategory={initialCategory} />
              </div>
            </section>
          } />
          <Route path="/about" element={
            <section className="px-8 md:px-12 max-w-7xl mx-auto fade-in">
              <About lang={lang} />
            </section>
          } />
          <Route path="/studio" element={
            <section className="py-16 md:py-32 px-8 md:px-12 max-w-7xl mx-auto fade-in">
              <Location lang={lang} />
            </section>
          } />
          <Route path="/care" element={
            <section className="py-32 px-6 max-w-7xl mx-auto fade-in">
              <CaringTips lang={lang} />
            </section>
          } />
          <Route path="/faq" element={
            <section className="py-16 md:py-32 px-8 md:px-12 max-w-7xl mx-auto fade-in">
              <FAQ lang={lang} />
            </section>
          } />
          <Route path="/giftcards" element={
            <section className="py-16 md:py-32 px-8 md:px-12 max-w-7xl mx-auto fade-in">
              <GiftCards lang={lang} />
            </section>
          } />
          <Route path="/witdo-studio-management" element={<OwnerPortal />} />
        </Routes>
      </main>
      <Footer lang={lang} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
