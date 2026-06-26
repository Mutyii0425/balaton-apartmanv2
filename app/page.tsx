'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Wifi, Car, Utensils, Wind, MapPin, Mountain, Coffee, Baby, X, ChevronLeft, ChevronRight, Phone, Calendar, ArrowRight } from 'lucide-react';

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

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % ALL_IMAGES.length);
    }
  }, [selectedImageIndex, ALL_IMAGES.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
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
  }, [selectedImageIndex, nextImage, prevImage, closeLightbox]);

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      
      {/* 1. HERO SZEKCIÓ */}
      <div className="relative h-[75vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/kilatas1.webp" 
            alt="Panoráma kilátás" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-slate-50/95"></div>
        </div>
        
        <div className="relative h-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase mb-6 border border-white/30">
            Balatonederics
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight leading-tight">
            {t.info.hero_title}
          </h1>
          <p className="text-lg md:text-2xl text-slate-100 max-w-2xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
            {t.info.hero_subtitle}
          </p>
          <div className="hidden md:block">
            <Link href="/info">
              <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-slate-900 hover:bg-slate-100 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 group flex items-center gap-2">
                {t.hero.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10 -mt-10">
        
        {/* 2. BEMUTATKOZÁS (Kiemelt kártyán) */}
        <section className="mb-20 bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-100">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.info.intro_title}
              </h2>
              <div className="w-16 h-1.5 bg-blue-500 mx-auto md:mx-0 rounded-full"></div>
              <div className="space-y-4 text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                <p>{t.info.intro_p1}</p>
                <p>{t.info.intro_p2}</p>
              </div>
            </div>

            <div 
              className="relative group cursor-pointer active:scale-95 transition-transform" 
              onClick={() => {
                const idx = ALL_IMAGES.findIndex(img => img.src === "/images/haz.webp");
                openLightbox(idx !== -1 ? idx : 0);
              }}
            >
               <div className="absolute inset-0 bg-blue-500 rounded-3xl rotate-3 md:rotate-6 opacity-20 transition-transform group-hover:rotate-6 md:group-hover:rotate-12"></div>
               <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                 <Image 
                  src="/images/haz.webp" 
                  alt="A ház kívülről" 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
               </div>
            </div>
          </div>
        </section>

        {/* 3. FELSZERELTSÉG */}
        <section className="mb-20">
          <div className="text-center mb-12">
             <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4">Mivel várjuk?</h3>
             <p className="text-slate-500 font-medium">Minden, amire a tökéletes kikapcsolódáshoz szükség van.</p>
          </div>
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

        {/* 4. GALÉRIA */}
        <section className="mb-20">
          <div className="mb-16">
            <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-4">
              <span className="w-12 h-1 bg-slate-300 rounded-full"></span> {t.info.gallery_inside}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {INTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(idx)} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-4">
              <span className="w-12 h-1 bg-slate-300 rounded-full"></span> {t.info.gallery_outside}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {EXTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(INTERIOR_IMAGES.length + idx)} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. TÉRKÉP ÉS KAPCSOLAT */}
        <section className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="grid lg:grid-cols-2 relative z-10">
            <div className="p-8 md:p-14 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-8">{t.info.hero_title}</h3>
              <div className="space-y-6">
                  <ContactInfo icon={<MapPin />} label="Címünk" value={t.info.address} />
                  <ContactInfo icon={<Phone />} label="Telefonszám" value="+36 30 360 5915" isLink href="tel:+36303605915" />
                  <ContactInfo icon={<Calendar />} label="Nyitvatartás" value="Egész évben" />
              </div>
              <div className="mt-10 hidden md:block">
                <Link href="/info">
                  <Button className="w-full h-14 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 text-lg">
                    {t.info.book_btn}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="h-[300px] lg:h-auto min-h-[400px] w-full relative">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=Balaton+Hegyvid%C3%A9ki+Apartman,+8312+Balatonederics,+Sipostorok+utca+3&t=&z=15&ie=UTF8&iwloc=&output=embed"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="md:grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </section>
      </div>

      {/* --- MOBIL STICKY FOGLALÁS GOMB --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md z-[90] border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
         <Link href="/info" className="block w-full">
            <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg font-bold text-lg flex items-center justify-center gap-2">
              {t.info.book_btn} <Calendar className="w-5 h-5" />
            </Button>
          </Link>
      </div>

      {/* --- LIGHTBOX ELŐTÖLTÉSSEL --- */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-md" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white p-3 z-[110] transition-colors">
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <button onClick={prevImage} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all z-50">
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <button onClick={nextImage} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all z-50">
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
            
            {/* LÁTHATÓ KÉP */}
            <div className="relative w-full h-[70vh] md:h-[85vh] max-w-6xl mx-auto cursor-pointer" onClick={nextImage}>
               <Image 
                src={ALL_IMAGES[selectedImageIndex].src} 
                alt={ALL_IMAGES[selectedImageIndex].label} 
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* PRELOAD HÁTTÉRBEN (Akadásmentes lapozásért) */}
            <div className="hidden">
              <Image src={ALL_IMAGES[(selectedImageIndex + 1) % ALL_IMAGES.length].src} alt="next" fill priority />
              <Image src={ALL_IMAGES[(selectedImageIndex - 1 + ALL_IMAGES.length) % ALL_IMAGES.length].src} alt="prev" fill priority />
            </div>

            <div className="absolute bottom-6 md:bottom-10 text-center px-4 bg-black/50 backdrop-blur-sm py-2 px-6 rounded-full">
              <p className="text-white text-base md:text-xl font-bold tracking-wide">{ALL_IMAGES[selectedImageIndex].label}</p>
              <p className="text-white/60 text-xs md:text-sm mt-1">{selectedImageIndex + 1} / {ALL_IMAGES.length}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// --- SEGÉDKOMPONENSEK ---

function ContactInfo({ icon, label, value, isLink, href }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-medium text-slate-400 text-xs md:text-sm uppercase tracking-wider mb-0.5">{label}</p>
        {isLink ? (
          <a href={href} className="text-white font-bold text-base md:text-lg hover:text-blue-400 transition-colors">{value}</a>
        ) : (
          <p className="text-white font-bold text-base md:text-lg">{value}</p>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="bg-white p-5 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
      <div className="mb-4 text-slate-400 group-hover:text-blue-500 h-12 w-12 [&>svg]:w-full [&>svg]:h-full transition-colors duration-300">
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 mb-2 text-sm md:text-base group-hover:text-blue-600 transition-colors">{title}</h4>
      <span className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{text}</span>
    </div>
  );
}

function Photo({ src, label, onClick }: { src: string, label: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3] shadow-sm hover:shadow-xl active:scale-95 transition-all duration-300 group"
    >
      <Image 
        src={src} 
        alt={label} 
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
        <span className="text-white font-bold text-sm md:text-lg drop-shadow-md translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{label}</span>
      </div>
    </div>
  );
}