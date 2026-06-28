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
    <main className="min-h-screen bg-[#FDF8F1] selection:bg-orange-200 font-sans text-amber-950 pb-20">
      
      {/* 1. HERO SZEKCIÓ - Olyan, mint a képen: egy széles banner a tetején */}
      <div className="relative h-[450px] md:h-[500px] w-full max-w-[1500px] mx-auto md:mt-4 md:rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="/images/kilatas1.webp" 
            alt="Balatonederics Panoráma" 
            className="w-full h-full object-cover scale-105"
          />
          {/* Gyönyörű meleg naplemente átmenet a képre (multiply effekttel, mint a generált képen) */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 via-amber-500/60 to-yellow-400/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>
        
        <div className="relative h-full px-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl mb-4 max-w-3xl">
            Balaton Hegyvidéki Apartman – Panoráma
          </h1>
          <p className="text-lg md:text-xl text-orange-50 font-medium mb-8 drop-shadow-md">
            {t.info.hero_subtitle}
          </p>
          <Link href="/info">
            <Button size="lg" className="h-12 px-8 text-base font-bold bg-[#E87A5D] text-white hover:bg-[#D96C4A] hover:scale-105 transition-all duration-300 rounded-full shadow-lg border-2 border-white/20">
              Kiváló Panoráma
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-16 md:mt-24 space-y-24">
        
        {/* 2. BEMUTATKOZÁS - Bal oldalt szöveg, jobb oldalt keretes kép */}
        <section>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#5C3D2E] tracking-tight">
                {t.info.intro_title}
              </h2>
              <div className="space-y-4 text-lg text-[#7A5B49] leading-relaxed font-medium">
                <p>{t.info.intro_p1}</p>
                <p>{t.info.intro_p2}</p>
              </div>
            </div>

            {/* FŐ KÉP - Vastag "képkerettel", ahogy a generált dizájnon */}
            <div 
              className="relative group cursor-pointer w-full md:w-[90%] ml-auto" 
              onClick={() => {
                const idx = ALL_IMAGES.findIndex(img => img.src === "/images/haz.webp");
                openLightbox(idx !== -1 ? idx : 0);
              }}
            >
               <div className="absolute -inset-2 bg-gradient-to-tr from-[#E87A5D] to-[#F3B562] rounded-2xl rotate-3 opacity-40 group-hover:rotate-6 transition-all duration-500"></div>
               <img 
                src="/images/haz.webp" 
                alt="A ház kívülről" 
                className="relative w-full aspect-[4/3] object-cover rounded-xl shadow-xl group-hover:-translate-y-1 transition-transform duration-500 border-[10px] border-white"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#A67B5B] text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                Balatonederics
              </div>
            </div>
          </div>
        </section>

        {/* 3. FELSZERELTSÉG - Telibe színezett pasztell kártyák! */}
        <section>
          <h3 className="text-2xl font-bold text-[#5C3D2E] mb-8">Kényelem és Felszereltség</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Itt adjuk át a teljes kártya hátterét */}
            <FeatureCard icon={<Wifi />} title={t.info.features.wifi_t} text={t.info.features.wifi_d} bgColor="bg-[#FFDFD3]" textColor="text-[#964B33]" />
            <FeatureCard icon={<Car />} title={t.info.features.parking_t} text={t.info.features.parking_d} bgColor="bg-[#E0F2E9]" textColor="text-[#3A7056]" />
            <FeatureCard icon={<Utensils />} title={t.info.features.bbq_t} text={t.info.features.bbq_d} bgColor="bg-[#FCE8B2]" textColor="text-[#8C6D1F]" />
            <FeatureCard icon={<Mountain />} title={t.info.features.view_t} text={t.info.features.view_d} bgColor="bg-[#D6EAEF]" textColor="text-[#3C6E79]" />
            <FeatureCard icon={<Wind />} title={t.info.features.ac_t} text={t.info.features.ac_d} bgColor="bg-[#E8DFF5]" textColor="text-[#604987]" />
            <FeatureCard icon={<Coffee />} title={t.info.features.kitchen_t} text={t.info.features.kitchen_d} bgColor="bg-[#FCE2E6]" textColor="text-[#8A3F4E]" />
            <FeatureCard icon={<Baby />} title={t.info.features.kids_t} text={t.info.features.kids_d} bgColor="bg-[#FCF6BD]" textColor="text-[#7A7426]" />
            <FeatureCard icon={<MapPin />} title={t.info.features.beach_t} text={t.info.features.beach_d} bgColor="bg-[#D0F4DE]" textColor="text-[#2F6B47]" />
          </div>
        </section>

        {/* 4. GALÉRIA & TÉRKÉP - 2 oszlopos elrendezés alul */}
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Bal oszlop: Galéria */}
          <section className="space-y-8">
            <div>
              <h4 className="text-xl font-bold text-[#D96C4A] mb-4 flex items-center gap-3">
                Belső Terek
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {INTERIOR_IMAGES.slice(0, 4).map((img, idx) => (
                  <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(idx)} />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#F3B562] mb-4 flex items-center gap-3">
                Környezet
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {EXTERIOR_IMAGES.slice(0, 4).map((img, idx) => (
                  <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(INTERIOR_IMAGES.length + idx)} />
                ))}
              </div>
            </div>
          </section>

          {/* Jobb oszlop: Térkép és Kapcsolat */}
          <section className="space-y-6 flex flex-col">
            <h4 className="text-xl font-bold text-[#5C3D2E] mb-2">Térkép & Kapcsolat</h4>
            
            {/* Pill alakú, színes kontakt infók, ahogy a képen */}
            <div className="flex flex-wrap gap-3 mb-4">
              <ContactPill icon={<MapPin className="w-4 h-4"/>} text={t.info.address} color="bg-[#E87A5D] text-white" />
              <ContactPill icon={<Phone className="w-4 h-4"/>} text="+36 30 360 5915" color="bg-[#5CB85C] text-white" isLink href="tel:+36303605915" />
              <ContactPill icon={<Calendar className="w-4 h-4"/>} text="Egész évben" color="bg-[#4DB8FF] text-white" />
            </div>

            <div className="flex-grow w-full min-h-[300px] rounded-2xl overflow-hidden border-4 border-white shadow-lg">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=Balaton+Hegyvid%C3%A9ki+Apartman,+8312+Balatonederics,+Sipostorok+utca+3&t=&z=15&ie=UTF8&iwloc=&output=embed"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] sepia-[15%] transition-all duration-700 hover:grayscale-0"
              ></iframe>
            </div>
          </section>

        </div>
      </div>

      {/* --- LIGHTBOX --- */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-[#3E2723]/95 flex flex-col items-center justify-center backdrop-blur-md" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 text-[#FDF8F1] p-3 bg-white/10 hover:bg-[#E87A5D] hover:rotate-90 transition-all duration-300 rounded-full z-[110]">
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={prevImage} className="absolute left-4 md:left-8 p-4 text-white/50 hover:text-white hover:scale-110 transition-all z-50 bg-black/20 hover:bg-[#E87A5D] rounded-full">
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            <img 
              src={ALL_IMAGES[selectedImageIndex].src} 
              alt="Nagyított kép" 
              className="max-w-[95vw] max-h-[75vh] md:max-h-[85vh] object-contain shadow-2xl rounded-lg select-none ring-8 ring-white/10"
              onClick={nextImage}
            />

            <div className="absolute bottom-8 text-center px-8 py-3 bg-[#2D1B16]/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              <p className="text-[#FDF8F1] text-lg font-bold tracking-wide">{ALL_IMAGES[selectedImageIndex].label}</p>
            </div>

            <button onClick={nextImage} className="absolute right-4 md:right-8 p-4 text-white/50 hover:text-white hover:scale-110 transition-all z-50 bg-black/20 hover:bg-[#E87A5D] rounded-full">
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// --- SEGÉDKOMPONENSEK ---

// Új, pill-alakú kontakt gomb a térkép fölé
function ContactPill({ icon, text, color, isLink, href }: any) {
  const content = (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-transform hover:scale-105 ${color}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
  
  return isLink ? <a href={href}>{content}</a> : content;
}

// A Feature kártya most egy telibe színezett, lekerekített négyzet (mint a képen)
function FeatureCard({ icon, title, text, bgColor, textColor }: { icon: any, title: string, text: string, bgColor: string, textColor: string }) {
  return (
    <div className={`${bgColor} p-6 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center transform hover:-translate-y-2 cursor-pointer border border-black/5 aspect-square justify-center`}>
      <div className={`mb-3 h-12 w-12 [&>svg]:w-8 [&>svg]:h-8 flex items-center justify-center ${textColor} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className={`font-bold ${textColor} mb-1 text-base md:text-lg leading-tight`}>{title}</h4>
      <span className={`text-xs md:text-sm ${textColor} opacity-80 font-medium leading-tight`}>{text}</span>
    </div>
  );
}

// Egyszerűbb, kártya jellegű fotó megjelenítés
function Photo({ src, label, onClick }: { src: string, label: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300 group bg-white p-1"
    >
      <div className="w-full h-full rounded-xl overflow-hidden relative">
        <img 
          src={src} 
          alt={label} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5C3D2E]/80 via-transparent to-transparent flex flex-col justify-end p-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-bold text-xs md:text-sm drop-shadow-md">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}