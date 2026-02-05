'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Wifi, Car, Utensils, Wind, MapPin, Mountain, Coffee, Baby, X, ChevronLeft, ChevronRight, Star, Phone, Calendar } from 'lucide-react';

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
    document.body.style.overflow = 'hidden'; // Ne görögjön a háttér ha nyitva a kép
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
    <main className="min-h-screen bg-gray-50/50">
      
      {/* 1. HERO SZEKCIÓ */}
      <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/kilatas1.webp" 
            alt="Balatonederics Panoráma" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-gray-50/90"></div>
        </div>
        
        <div className="relative h-full max-w-[1400px] mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-xl tracking-tight px-2">
            {t.info.hero_title}
          </h1>
          <p className="text-lg md:text-3xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed mb-8 drop-shadow-md px-4">
            {t.info.hero_subtitle}
          </p>
          <Link href="/">
            <Button size="lg" className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-bold bg-white text-blue-900 hover:bg-blue-50 rounded-full shadow-xl border-2 md:border-4 border-white/30">
              {t.hero.cta}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-12">
        
        {/* 2. BEMUTATKOZÁS */}
        <section className="mb-16 md:mb-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4 md:space-y-6 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase">
                Balatonederics
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                {t.info.intro_title}
              </h2>
              <div className="space-y-4 text-base md:text-lg text-slate-600 leading-relaxed">
                <p>{t.info.intro_p1}</p>
                <p>{t.info.intro_p2}</p>
              </div>
            </div>

            {/* FŐ KÉP - Javítva, hogy érintésre nyíljon */}
            <div 
              className="order-1 md:order-2 relative group cursor-pointer active:scale-95 transition-transform" 
              onClick={() => {
                const idx = ALL_IMAGES.findIndex(img => img.src === "/images/haz.webp");
                openLightbox(idx !== -1 ? idx : 0);
              }}
            >
               <div className="absolute inset-0 bg-blue-600 rounded-2xl md:rounded-3xl rotate-2 md:rotate-3 opacity-10"></div>
               <img 
                src="/images/haz.webp" 
                alt="A ház kívülről" 
                className="relative w-full h-[250px] md:h-[400px] object-cover rounded-2xl md:rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* 3. FELSZERELTSÉG */}
        <section className="mb-16 md:mb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

        {/* 4. GALÉRIA - Pontos indexelés a megnyitáshoz */}
        <section className="mb-16 md:mb-24">
          <div className="mb-12 md:mb-16">
            <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-blue-600"></span> {t.info.gallery_inside}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {INTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(idx)} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-green-500"></span> {t.info.gallery_outside}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {EXTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(INTERIOR_IMAGES.length + idx)} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. TÉRKÉP ÉS KAPCSOLAT */}
        <section className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center">
              <h3 className="text-2xl md:text-4xl font-extrabold text-blue-900 mb-6">{t.info.hero_title}</h3>
              <div className="space-y-4">
                  <ContactInfo icon={<MapPin />} label="Címünk" value={t.info.address} />
                  <ContactInfo icon={<Phone />} label="Telefonszám" value="+36 30 360 5915" isLink href="tel:+36303605915" />
                  <ContactInfo icon={<Calendar />} label="Nyitvatartás" value="Egész évben" />
              </div>
              <div className="mt-8">
                <Link href="/">
                  <Button className="w-full h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all">
                    {t.info.book_btn}
                  </Button>
                </Link>
              </div>
            </div>
           <div className="h-[400px] lg:h-auto min-h-[400px] w-full relative">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=Balaton+Hegyvid%C3%A9ki+Apartman,+8312+Balatonederics,+Sipostorok+utca+3&t=&z=15&ie=UTF8&iwloc=&output=embed"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </section>
      </div>

      {/* --- LIGHTBOX - Javított mobil navigáció --- */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-md" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white p-3 bg-white/10 rounded-full z-[110]">
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Előző kép gomb - Mobilon is látható de szolidabb */}
            <button onClick={prevImage} className="absolute left-2 md:left-4 p-3 text-white/50 hover:text-white transition-all z-50">
              <ChevronLeft className="w-10 h-10 md:w-16 md:h-16" />
            </button>

            <img 
              src={ALL_IMAGES[selectedImageIndex].src} 
              alt="Nagyított kép" 
              className="max-w-[98vw] max-h-[70vh] md:max-h-[85vh] object-contain shadow-2xl"
              onClick={nextImage} // Képre kattintva is továbblép (kényelmes mobilon)
            />

            <div className="mt-4 text-center px-4">
              <p className="text-white text-lg md:text-2xl font-medium">{ALL_IMAGES[selectedImageIndex].label}</p>
              <p className="text-white/40 text-sm">{selectedImageIndex + 1} / {ALL_IMAGES.length}</p>
            </div>

            {/* Következő kép gomb */}
            <button onClick={nextImage} className="absolute right-2 md:right-4 p-3 text-white/50 hover:text-white transition-all z-50">
              <ChevronRight className="w-10 h-10 md:w-16 md:h-16" />
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
    <div className="flex items-start gap-3 md:gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-900 text-sm md:text-base">{label}</p>
        {isLink ? (
          <a href={href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm md:text-base">{value}</a>
        ) : (
          <p className="text-slate-600 text-sm md:text-base">{value}</p>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 text-center md:text-left flex flex-col items-center md:items-start">
      <div className="mb-4 text-blue-600 h-10 w-10 md:h-12 md:w-12 [&>svg]:w-full [&>svg]:h-full bg-blue-50 p-2 rounded-xl">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-lg">{title}</h4>
      <span className="text-[11px] md:text-sm text-slate-500 font-medium leading-tight">{text}</span>
    </div>
  );
}

function Photo({ src, label, onClick }: { src: string, label: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer aspect-[4/3] shadow-md active:scale-95 transition-transform"
    >
      <img 
        src={src} 
        alt={label} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Mobilon is látható legyen a felirat, de ne takarja a kattintást */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 md:p-6 pointer-events-none">
        <span className="text-white font-bold text-xs md:text-lg">{label}</span>
      </div>
    </div>
  );
}