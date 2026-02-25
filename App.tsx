
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyWitdo from './components/WhyWitdo';
import Pricing from './components/Pricing';
import About from './components/About';
import Location from './components/Location';
import FAQ from './components/FAQ';
import CaringTips from './components/CaringTips';
import Footer from './components/Footer';
import Designs from './components/Designs';

export type Language = 'en' | 'zh';
export type Page = 'home' | 'why' | 'pricing' | 'about' | 'studio' | 'care' | 'designs' | 'faq';
export type Category = 'all' | 'duo' | 'full' | 'legacy';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [initialCategory, setInitialCategory] = useState<Category>('all');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigateToDesigns = (category: Category) => {
    setInitialCategory(category);
    setCurrentPage('designs');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'why':
        return (
          <section className="py-32 bg-linen-50 px-6 fade-in">
            <div className="max-w-7xl mx-auto">
              <WhyWitdo lang={lang} />
            </div>
          </section>
        );
      case 'pricing':
        return (
          <section className="py-32 bg-linen-100 px-6 fade-in min-h-[80vh] flex items-center border-t border-linen-200">
            <div className="max-w-7xl mx-auto w-full">
              <Pricing lang={lang} setCurrentPage={setCurrentPage} navigateToDesigns={navigateToDesigns} />
            </div>
          </section>
        );
      case 'designs':
        return (
          <section className="py-32 bg-linen-100 px-6 fade-in min-h-[80vh]">
            <div className="max-w-7xl mx-auto w-full">
              <Designs lang={lang} setCurrentPage={setCurrentPage} initialCategory={initialCategory} />
            </div>
          </section>
        );
      case 'about':
        return (
          <section className="px-8 md:px-12 max-w-7xl mx-auto fade-in">
            <About lang={lang} />
          </section>
        );
      case 'studio':
        return (
          <section className="py-32 bg-linen-50 px-6 fade-in min-h-[80vh] flex items-center">
            <div className="max-w-7xl mx-auto w-full">
              <Location lang={lang} />
            </div>
          </section>
        );
      case 'care':
        return (
          <section className="py-32 px-6 max-w-7xl mx-auto fade-in">
            <CaringTips lang={lang} />
          </section>
        );
      case 'faq':
        return (
          <section className="py-32 bg-linen-900 text-linen-50 px-6 fade-in min-h-screen flex items-center">
            <div className="max-w-4xl mx-auto w-full">
              <FAQ lang={lang} />
            </div>
          </section>
        );
      default:
        return (
          <>
            <Hero lang={lang} setCurrentPage={setCurrentPage} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linen-100 selection:bg-linen-300">
      <Navbar 
        scrolled={scrolled} 
        lang={lang} 
        setLang={setLang} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      <main className={`flex-grow ${currentPage === 'home' ? '' : 'pt-16'}`}>
        {renderPage()}
      </main>
      <Footer lang={lang} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
