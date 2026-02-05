'use client';

import { useState, useEffect } from 'react';
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

  const openLightbox = (src: string) => {
    const index = ALL_IMAGES.findIndex(img => img.src === src);
    if (index !== -1) setSelectedImageIndex(index);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % ALL_IMAGES.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! - 1 + ALL_IMAGES.length) % ALL_IMAGES.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <main className="min-h-screen bg-gray-50/50">
      
      {/* 1. HERO SZEKCIÓ - Mobilra optimalizált magasság */}
      <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/kilatas1.webp" 
            alt="Balatonederics Panoráma" 
            className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-gray-50/90"></div>
        </div>
        
        <div className="relative h-full max-w-[1400px] mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-xl tracking-tight px-2">
              {t.info.hero_title}
            </h1>
            <p className="text-lg md:text-3xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed mb-8 drop-shadow-md px-4">
              {t.info.hero_subtitle}
            </p>
            <Link href="/">
              <Button size="lg" className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-bold bg-white text-blue-900 hover:bg-blue-50 rounded-full shadow-xl border-2 md:border-4 border-white/30 backdrop-blur-sm">
                {t.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-12">
        
        {/* 2. BEMUTATKOZÁS */}
        <section className="mb-16 md:mb-24 scroll-mt-24" id="about">
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
              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                 <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> <span className="text-sm md:text-base">Prémium minőség</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Mountain className="w-5 h-5 text-blue-600" /> <span className="text-sm md:text-base">Panoráma</span>
                 </div>
              </div>
            </div>

            <div className="order-1 md:order-2 relative group cursor-pointer" onClick={() => openLightbox("/images/haz.webp")}>
               <div className="absolute inset-0 bg-blue-600 rounded-2xl md:rounded-3xl rotate-2 md:rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
               <img 
                src="/images/haz.webp" 
                alt="A ház kívülről" 
                className="relative w-full h-[300px] md:h-[400px] object-cover rounded-2xl md:rounded-3xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
              />
            </div>
          </div>
        </section>

        {/* 3. FELSZERELTSÉG - Mobilon 2 oszlop */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto px-4">
            <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">{t.info.features_title}</h3>
            <p className="text-slate-500 text-base md:text-lg">{t.info.features_subtitle}</p>
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
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-8 md:mb-12">
             <h3 className="text-2xl md:text-4xl font-bold text-slate-900">{t.info.gallery_title}</h3>
          </div>
          
          <div className="mb-12 md:mb-16">
            <h4 className="flex items-center gap-3 text-lg md:text-xl font-bold text-slate-800 mb-6">
                <span className="w-6 md:w-8 h-[2px] bg-blue-600"></span>
                {t.info.gallery_inside}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {INTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(img.src)} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-3 text-lg md:text-xl font-bold text-slate-800 mb-6">
                <span className="w-6 md:w-8 h-[2px] bg-green-500"></span>
                {t.info.gallery_outside}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {EXTERIOR_IMAGES.map((img, idx) => (
                <Photo key={idx} src={img.src} label={img.label} onClick={() => openLightbox(img.src)} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. TÉRKÉP ÉS KAPCSOLAT - Mobilbarát elrendezés */}
        <section className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-white">
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-xs md:text-sm mb-4">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" /> {t.info.contact_title}
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-blue-900 mb-6">
                 {t.info.hero_title}
              </h3>
              
              <div className="space-y-4 md:space-y-6 text-base md:text-lg">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Címünk</p>
                        <p className="text-slate-600 text-sm md:text-base">{t.info.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Telefonszám</p>
                        <a href="tel:+36303605915" className="text-slate-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                          +36 30 360 5915
                        </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{t.info.hours_label}</p>
                        <p className="text-slate-600 text-sm md:text-base">Egész évben</p>
                    </div>
                  </div>
              </div>

              <div className="mt-8 md:mt-10">
                <Link href="/">
                  <Button className="w-full h-12 md:h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg rounded-xl shadow-lg transition-all">
                    {t.info.book_btn}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Térkép magassága fixálva mobilon */}
            <div className="h-[300px] md:h-[400px] lg:h-auto w-full relative">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.685387413643!2d17.38202407686884!3d46.79084797112648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476903f56e919865%3A0x7df647963df997d9!2sBalatonederics%2C%20Sipostorok%20u.%203%2C%208312!5e0!3m2!1shu!2shu!4v1707150000000!5m2!1shu!2shu"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </section>

      </div>

      {/* --- LIGHTBOX - Mobilbarát érintési felületekkel --- */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-md animate-in fade-in duration-300">
          
          <button 
            onClick={() => setSelectedImageIndex(null)} 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-3 bg-white/10 rounded-full z-[110]"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition hidden md:block"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <div className="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={ALL_IMAGES[selectedImageIndex].src} 
              alt="Nagyított kép" 
              className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl"
              onClick={nextMonth} // Mobilon koppintásra is léphet
            />
            <p className="text-white text-center mt-4 md:mt-6 text-base md:text-xl font-medium px-4">
              {ALL_IMAGES[selectedImageIndex].label} 
              <span className="block md:inline text-white/50 text-xs md:text-sm mt-1 md:ml-2">
                ({selectedImageIndex + 1} / {ALL_IMAGES.length})
              </span>
            </p>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition hidden md:block"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

        </div>
      )}

    </main>
  );
}

function FeatureCard({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="group bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-left">
      <div className="mb-4 md:mb-6 text-blue-600 h-10 w-10 md:h-12 md:w-12 [&>svg]:w-full [&>svg]:h-full bg-blue-50 p-2 md:p-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 mb-1 md:mb-2 text-sm md:text-lg">{title}</h4>
      <span className="text-[10px] md:text-sm text-slate-500 font-medium leading-tight md:leading-relaxed">{text}</span>
    </div>
  );
}

function Photo({ src, label, onClick }: { src: string, label: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer aspect-[4/3] shadow-md"
    >
      <img 
        src={src} 
        alt={label} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
        <span className="text-white font-bold text-sm md:text-lg transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {label}
        </span>
      </div>
    </div>
  );
}