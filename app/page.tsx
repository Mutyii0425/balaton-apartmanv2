'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from './context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Wifi, Car, Utensils, Wind, MapPin, Mountain, Coffee, Baby, X, ChevronLeft, ChevronRight, Phone, Calendar } from 'lucide-react';

export default function InfoPage() {
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const INTERIOR_IMAGES = [
    { src: "/images/balhalo.jpg", label: t.info.img_labels.bedroom },
    { src: "/images/balhalo1.jpg", label: t.info.img_labels.living },
    { src: "/images/balkonyha.jpg", label: t.info.img_labels.kitchen },
    { src: "/images/balbejarat.jpg", label: t.info.img_labels.hall },
    { src: "/images/balfurdo.jpg", label: t.info.img_labels.bath },
  ];

  const EXTERIOR_IMAGES = [
    { src: "/images/bejarat.webp", label: t.info.img_labels.entrance },
    { src: "/images/kilatas.webp", label: t.info.img_labels.view },
    { src: "/images/udvar.webp", label: t.info.img_labels.yard },
    { src: "/images/kiulo.webp", label: t.info.img_labels.pavilion },
    { src: "/images/sutogeto.webp", label: t.info.img_labels.bbq },
  ];

  const ALL_IMAGES = [...INTERIOR_IMAGES, ...EXTERIOR_IMAGES];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % ALL_IMAGES.length);
    }
  }, [selectedImageIndex, ALL_IMAGES.length]);

  const prevImage = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! - 1 + ALL_IMAGES.length) % ALL_IMAGES.length);
    }
  }, [selectedImageIndex, ALL_IMAGES.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, nextImage, prevImage]);

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-200">
      
      {/* 1. HERO SZEKCIÓ */}
      <div className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/kilatas1.webp" 
            alt="Balatonederics Panoráma" 
            className="w-full h-full object-cover scale-105 animate-image-pan"
          />
          {/* Sötétebb, elegánsabb gradiens a jobb olvashatóságért */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-slate-50"></div>
        </div>
        
        <div className="relative h-full max-w-[1400px] mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="space-y-6 max-w-4xl backdrop-blur-sm bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {t.info.hero_title}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-light leading-relaxed drop-shadow-md">
              {t.info.hero_subtitle}
            </p>
            <div className="pt-4">
              <Link href="/info">
                <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-blue-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                  {t.hero.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-16 md:py-24 space-y-24 md:space-y-32">
        
        {/* 2. BEMUTATKOZÁS */}
        <section>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-widest uppercase border border-blue-100">
                <MapPin className="w-4 h-4 mr-2" />
                Balatonederics
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.info.intro_title}
              </h2>
              <div className="space-y-5 text-lg text-slate-600 leading-relaxed font-light">
                <p>{t.info.intro_p1}</p>
                <p>{t.info.intro_p2}</p>
              </div>
            </div>

            {/* FŐ KÉP - Prémium árnyék és rotáció */}
            <div 
              className="order-1 md:order-2 relative group cursor-pointer" 
              onClick={() => {
                const idx = ALL_IMAGES.findIndex(img => img.src === "/images/haz.webp");
                openLightbox(idx !== -1 ? idx : 0);
              }}
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl rotate-3 scale-105 opacity-20 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500"></div>
               <img 
                src="/images/haz.webp" 
                alt="A ház kívülről" 
                className="relative w-full h-[300px] md:h-[450px] object-cover rounded-3xl shadow-2xl group-hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* 3. FELSZERELTSÉG */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Kényelem és Felszereltség</h3>
            <p className="text-slate-500">Minden adott egy tökéletes pihenéshez a Balaton partján.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <FeatureCard icon={<Wifi />} title={t.info.features.wifi_t} text={t.info.features.wifi_d} />
            <FeatureCard icon={<Car />} title={t.info.features.parking_t} text={t.info.features.parking_d} />
            <FeatureCard icon={<Wind />} title={t.info.features.ac_t} text={t.info.features.ac_d} />
            <FeatureCard icon={<Mountain />} title={t.info.features.view_t} text={t.info.features.view_d} />
            <FeatureCard icon={<Utensils />} title={t.info.features.bbq_t} text={t.info.features.bbq_d} />
            <FeatureCard icon={<Coffee />} title={t.info.features.kitchen_t} text={t.info.features.kitchen_d} />
            <FeatureCard icon={<Baby />} title={t.info.features.kids_t} text={t.info.features.kids_d} />
            <FeatureCard icon={<MapPin />} title={t.info.features.beach_t} text={t.info.features.beach_d} />
          </div>
        </section>

        {/* 4. GALÉRIA */}
        <section>
          <div className="mb-16">
            <h4 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
              <span className="w-12 h-1 bg-blue-600 rounded-full"></span> 
              {t.info.gallery_inside}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {INTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(idx)} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
              <span className="w-12 h-1 bg-emerald-500 rounded-full"></span> 
              {t.info.gallery_outside}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {EXTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(INTERIOR_IMAGES.length + idx)} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. TÉRKÉP ÉS KAPCSOLAT */}
        <section className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">{t.info.hero_title}</h3>
              <div className="space-y-6">
                  <ContactInfo icon={<MapPin />} label="Címünk" value={t.info.address} />
                  <ContactInfo icon={<Phone />} label="Telefonszám" value="+36 30 360 5915" isLink href="tel:+36303605915" />
                  <ContactInfo icon={<Calendar />} label="Nyitvatartás" value="Egész évben" />
              </div>
              <div className="mt-10">
                <Link href="/info">
                  <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    {t.info.book_btn}
                  </Button>
                </Link>
              </div>
            </div>
           <div className="h-[400px] lg:h-auto min-h-[400px] w-full relative group">
               <div className="absolute inset-0 bg-blue-900/10 pointer-events-none group-hover:opacity-0 transition-opacity duration-700 z-10"></div>
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=Balaton+Hegyvid%C3%A9ki+Apartman,+8312+Balatonederics,+Sipostorok+utca+3&t=&z=15&ie=UTF8&iwloc=&output=embed" // IDE TEDD A VALÓS MAPS LINKET!
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </section>
      </div>

      {/* --- LIGHTBOX --- */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-xl" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 text-white p-3 bg-white/10 hover:bg-white/20 hover:rotate-90 transition-all duration-300 rounded-full z-[110]">
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={prevImage} className="absolute left-4 md:left-8 p-4 text-white/50 hover:text-white hover:scale-110 transition-all z-50 bg-black/20 rounded-full backdrop-blur-md">
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            <img 
              src={ALL_IMAGES[selectedImageIndex].src} 
              alt="Nagyított kép" 
              className="max-w-[95vw] max-h-[75vh] md:max-h-[85vh] object-contain shadow-2xl rounded-lg select-none"
              onClick={nextImage}
            />

            <div className="absolute bottom-8 text-center px-6 py-3 bg-black/50 backdrop-blur-md rounded-2xl">
              <p className="text-white text-lg md:text-xl font-medium tracking-wide">{ALL_IMAGES[selectedImageIndex].label}</p>
              <p className="text-white/60 text-sm font-light mt-1">{selectedImageIndex + 1} / {ALL_IMAGES.length}</p>
            </div>

            <button onClick={nextImage} className="absolute right-4 md:right-8 p-4 text-white/50 hover:text-white hover:scale-110 transition-all z-50 bg-black/20 rounded-full backdrop-blur-md">
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// --- SEGÉDKOMPONENSEK ---

function ContactInfo({ icon, label, value, isLink, href }: any) {
  return (
    <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-300 border border-transparent hover:border-slate-100">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-slate-400 text-sm uppercase tracking-wider mb-1">{label}</p>
        {isLink ? (
          <a href={href} className="text-slate-900 font-bold text-lg hover:text-blue-600 transition-colors">{value}</a>
        ) : (
          <p className="text-slate-900 font-bold text-lg">{value}</p>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 transition-all duration-300 group flex flex-col items-center md:items-start text-center md:text-left transform hover:-translate-y-1">
      <div className="mb-5 text-blue-600 h-14 w-14 [&>svg]:w-7 [&>svg]:h-7 flex items-center justify-center bg-blue-50/50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 rounded-2xl">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 mb-2 text-base md:text-lg">{title}</h4>
      <span className="text-sm text-slate-500 font-medium leading-relaxed">{text}</span>
    </div>
  );
}

function Photo({ src, label, onClick }: { src: string, label: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <img 
        src={src} 
        alt={label} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      {/* Sötétítő gradiens, ami hoverre felerősödik */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white font-bold text-sm md:text-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
          {label}
        </span>
      </div>
    </div>
  );
}