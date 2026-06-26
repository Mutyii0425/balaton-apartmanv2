'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Wifi, Car, Utensils, Wind, MapPin, Mountain, Coffee, Baby, X, ChevronLeft, ChevronRight, Phone, Calendar, ArrowRight, Sparkles } from 'lucide-react';

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
    <main className="min-h-screen bg-stone-50 font-sans pb-24 md:pb-0 selection:bg-amber-500 selection:text-white">
      
      {/* 1. PRÉMIUM HERO SZEKCIÓ */}
      <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/kilatas1.webp" 
            alt="Panoráma kilátás" 
            fill
            priority
            className="object-cover scale-105 animate-slow-zoom"
          />
          {/* Elegáns sötétítő gradiens */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-stone-50/95"></div>
        </div>
        
        <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center pt-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md text-amber-400 rounded-full text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-8 border border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            <Sparkles className="w-4 h-4" /> Balatonederics
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight leading-tight">
            {t.info.hero_title}
          </h1>
          <p className="text-lg md:text-2xl text-stone-200 max-w-2xl mx-auto font-light leading-relaxed mb-12 drop-shadow-md">
            {t.info.hero_subtitle}
          </p>
          <div className="hidden md:block">
            <Link href="/info">
              <Button size="lg" className="h-16 px-12 text-lg font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-1 group flex items-center gap-3">
                {t.hero.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* TARTALMI RÉSZ - Negatív marginnal "rácsúszik" a Hero képre */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 -mt-32 md:-mt-40">
        
        {/* 2. BEMUTATKOZÁS (Kiemelt átfedéses kártya) */}
        <section className="mb-24 bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-stone-100">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {t.info.intro_title}
                </h2>
                <div className="w-20 h-1.5 bg-amber-500 mx-auto lg:mx-0 rounded-full"></div>
              </div>
              <div className="space-y-6 text-base md:text-lg text-slate-500 leading-relaxed font-medium">
                <p>{t.info.intro_p1}</p>
                <p>{t.info.intro_p2}</p>
              </div>
            </div>

            <div 
              className="relative group cursor-pointer order-1 lg:order-2" 
              onClick={() => {
                const idx = ALL_IMAGES.findIndex(img => img.src === "/images/haz.webp");
                openLightbox(idx !== -1 ? idx : 0);
              }}
            >
               {/* Dekoratív arany háttér */}
               <div className="absolute -inset-4 bg-amber-500/10 rounded-[2.5rem] md:rounded-[3rem] rotate-3 transition-transform group-hover:rotate-6"></div>
               <div className="relative h-[350px] md:h-[500px] w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                 <Image 
                  src="/images/haz.webp" 
                  alt="A ház kívülről" 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
               </div>
            </div>
          </div>
        </section>

        {/* 3. FELSZERELTSÉG (Prémium ikonokkal) */}
        <section className="mb-32">
          <div className="text-center mb-16">
             <h3 className="text-sm font-bold text-amber-500 tracking-[0.2em] uppercase mb-3">Kényelem felsőfokon</h3>
             <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Mivel várjuk?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
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

        {/* 4. GALÉRIA (Elegáns elválasztókkal) */}
        <section className="mb-32">
          <div className="mb-20">
            <div className="flex items-center gap-6 mb-10">
              <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900 whitespace-nowrap">
                {t.info.gallery_inside}
              </h4>
              <div className="h-[1px] w-full bg-stone-200"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {INTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(idx)} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-6 mb-10">
              <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900 whitespace-nowrap">
                {t.info.gallery_outside}
              </h4>
              <div className="h-[1px] w-full bg-stone-200"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {EXTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(INTERIOR_IMAGES.length + idx)} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. TÉRKÉP ÉS KAPCSOLAT (Mélykék és Arany luxus design) */}
        <section className="bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="grid lg:grid-cols-2 relative z-10">
            <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center">
              <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{t.info.hero_title}</h3>
              <p className="text-amber-400 font-medium tracking-widest uppercase text-sm mb-12">Foglaljon közvetlenül nálunk</p>
              
              <div className="space-y-8">
                  <ContactInfo icon={<MapPin />} label="Címünk" value={t.info.address} />
                  <ContactInfo icon={<Phone />} label="Telefonszám" value="+36 30 360 5915" isLink href="tel:+36303605915" />
                  <ContactInfo icon={<Calendar />} label="Nyitvatartás" value="Egész évben várjuk" />
              </div>
              
              <div className="mt-14 hidden md:block">
                <Link href="/info">
                  <Button className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] transition-transform hover:-translate-y-1 text-lg">
                    {t.info.book_btn}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="h-[350px] lg:h-auto min-h-[500px] w-full relative">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=Balaton+Hegyvid%C3%A9ki+Apartman,+8312+Balatonederics,+Sipostorok+utca+3&t=&z=15&ie=UTF8&iwloc=&output=embed"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="md:grayscale-[80%] md:opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 object-cover"
              ></iframe>
            </div>
          </div>
        </section>
      </div>

      {/* --- MOBIL STICKY FOGLALÁS GOMB (Prémium kinézet) --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-xl z-[90] border-t border-stone-200 shadow-[0_-20px_40px_rgba(0,0,0,0.08)]">
         <Link href="/info" className="block w-full">
            <Button className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl shadow-lg font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
              {t.info.book_btn} <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
      </div>

      {/* --- LIGHTBOX ELŐTÖLTÉSSEL --- */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 flex flex-col items-center justify-center backdrop-blur-xl" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white p-3 z-[110] transition-colors">
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <button onClick={prevImage} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-amber-400 transition-all z-50 backdrop-blur-sm">
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          <button onClick={nextImage} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-amber-400 transition-all z-50 backdrop-blur-sm">
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
            
            <div className="relative w-full h-[75vh] md:h-[85vh] max-w-6xl mx-auto cursor-pointer" onClick={nextImage}>
               <Image 
                src={ALL_IMAGES[selectedImageIndex].src} 
                alt={ALL_IMAGES[selectedImageIndex].label} 
                fill
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>

            <div className="hidden">
              <Image src={ALL_IMAGES[(selectedImageIndex + 1) % ALL_IMAGES.length].src} alt="next" fill priority />
              <Image src={ALL_IMAGES[(selectedImageIndex - 1 + ALL_IMAGES.length) % ALL_IMAGES.length].src} alt="prev" fill priority />
            </div>

            <div className="absolute bottom-8 md:bottom-12 text-center flex flex-col items-center">
              <p className="text-white text-lg md:text-2xl font-bold tracking-wide">{ALL_IMAGES[selectedImageIndex].label}</p>
              <div className="w-12 h-1 bg-amber-500 rounded-full mt-3 mb-2"></div>
              <p className="text-white/40 text-sm font-medium tracking-widest">{selectedImageIndex + 1} / {ALL_IMAGES.length}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* GLOBAL ANIMATION */}
      <style jsx global>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate linear;
        }
      `}</style>
    </main>
  );
}

// --- SEGÉDKOMPONENSEK ---

function ContactInfo({ icon, label, value, isLink, href }: { icon: React.ReactNode, label: string, value: string, isLink?: boolean, href?: string }) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300 shrink-0 shadow-lg">
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-1">{label}</p>
        {isLink ? (
          <a href={href} className="text-white font-extrabold text-lg md:text-xl hover:text-amber-400 transition-colors">{value}</a>
        ) : (
          <p className="text-white font-extrabold text-lg md:text-xl">{value}</p>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-stone-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center group">
      <div className="mb-5 text-amber-600 bg-amber-50 h-16 w-16 p-4 rounded-2xl group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
        {icon}
      </div>
      <h4 className="font-extrabold text-slate-900 mb-2 text-sm md:text-lg">{title}</h4>
      <span className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{text}</span>
    </div>
  );
}

function Photo({ src, label, onClick }: { src: string, label: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-[1.5rem] cursor-pointer aspect-[4/3] shadow-md hover:shadow-2xl active:scale-95 transition-all duration-500 group"
    >
      <Image 
        src={src} 
        alt={label} 
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-70 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 md:p-6 pointer-events-none">
        <div className="w-8 h-1 bg-amber-500 rounded-full mb-3 translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500"></div>
        <span className="text-white font-extrabold text-sm md:text-xl drop-shadow-md translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">{label}</span>
      </div>
    </div>
  );
}