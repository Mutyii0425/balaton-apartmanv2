'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Wifi, Car, Utensils, Wind, MapPin, Mountain, Coffee, Baby, X, ChevronLeft, ChevronRight, Star, Phone, Calendar } from 'lucide-react';

export default function InfoPage() {
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // KÉPEK
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

  // LOGIKA
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
      
      {/* 1. HERO SZEKCIÓ */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/kilatas1.webp" 
            alt="Balatonederics Panoráma" 
            className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-gray-50/90"></div>
        </div>
        
        <div className="relative h-full max-w-[1400px] mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
              {t.info.hero_title}
            </h1>
            <p className="text-xl md:text-3xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
              {t.info.hero_subtitle}
            </p>
            <Link href="/">
              <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-blue-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl rounded-full border-4 border-white/30 backdrop-blur-sm">
                {t.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        
        {/* 2. BEMUTATKOZÁS */}
        <section className="mb-24 scroll-mt-24" id="about">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 md:order-1 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase">
                Balatonederics
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                {t.info.intro_title}
              </h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>{t.info.intro_p1}</p>
                <p>{t.info.intro_p2}</p>
              </div>
              <div className="pt-4 flex gap-4">
                 <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Prémium minőség
                 </div>
                 <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Mountain className="w-5 h-5 text-blue-600" /> Panoráma
                 </div>
              </div>
            </div>

            <div className="order-1 md:order-2 relative group cursor-pointer" onClick={() => openLightbox("/images/haz.webp")}>
               <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
               <img 
                src="/images/haz.webp" 
                alt="A ház kívülről" 
                className="relative w-full h-[400px] object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
              />
            </div>

          </div>
        </section>

        {/* 3. FELSZERELTSÉG */}
        <section className="mb-24">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.info.features_title}</h3>
            <p className="text-slate-500 text-lg">{t.info.features_subtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
        <section className="mb-24">
          <div className="text-center mb-12">
             <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{t.info.gallery_title}</h3>
          </div>
          
          <div className="mb-16">
            <h4 className="flex items-center gap-3 text-xl font-bold text-slate-800 mb-6">
                <span className="w-8 h-[2px] bg-blue-600"></span>
                {t.info.gallery_inside}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INTERIOR_IMAGES.map((img, idx) => (
                <Photo 
                  key={idx} 
                  src={img.src} 
                  label={img.label} 
                  onClick={() => openLightbox(img.src)} 
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-3 text-xl font-bold text-slate-800 mb-6">
                <span className="w-8 h-[2px] bg-green-500"></span>
                {t.info.gallery_outside}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXTERIOR_IMAGES.map((img, idx) => (
                <Photo 
                  key={idx} 
                  src={img.src} 
                  label={img.label} 
                  onClick={() => openLightbox(img.src)} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* 5. TÉRKÉP ÉS KAPCSOLAT */}
        <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-white">
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm mb-4">
                <MapPin className="h-5 w-5" /> {t.info.contact_title}
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-6">
                 {t.info.hero_title}
              </h3>
              
              <div className="space-y-6 text-lg">
                  {/* CÍM */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Címünk</p>
                        <p className="text-slate-600">{t.info.address}</p>
                    </div>
                  </div>

                  {/* TELEFONSZÁM (ÚJ) */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <Phone size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Telefonszám</p>
                        <a href="tel:+36303605915" className="text-slate-600 hover:text-blue-600 transition-colors">
                          +36 30 360 5915
                        </a>
                    </div>
                  </div>

                  {/* NYITVATARTÁS (MÓDOSÍTVA) */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{t.info.hours_label}</p>
                        <p className="text-slate-600">Egész évben</p>
                    </div>
                  </div>
              </div>

              <div className="mt-10">
                <Link href="/">
                  <Button className="w-full sm:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl shadow-lg hover:shadow-blue-200 transition-all">
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

      {/* --- LIGHTBOX --- */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-300">
          
          <button 
            onClick={() => setSelectedImageIndex(null)} 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition hover:bg-white/20"
          >
            <X className="w-10 h-10" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full transition md:block hidden"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <div className="relative max-w-[95vw] max-h-[90vh] flex flex-col items-center">
            <img 
              src={ALL_IMAGES[selectedImageIndex].src} 
              alt="Nagyított kép" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-center mt-6 text-xl font-medium tracking-wide">
              {ALL_IMAGES[selectedImageIndex].label} <span className="text-white/50 text-sm ml-2">({selectedImageIndex + 1} / {ALL_IMAGES.length})</span>
            </p>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full transition md:block hidden"
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
    <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
      <div className="mb-6 text-blue-600 h-12 w-12 [&>svg]:w-full [&>svg]:h-full bg-blue-50 p-2.5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 mb-2 text-lg">{title}</h4>
      <span className="text-sm text-slate-500 font-medium leading-relaxed">{text}</span>
    </div>
  );
}

function Photo({ src, label, onClick }: { src: string, label: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3]"
    >
      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div> 
      <img 
        src={src} 
        alt={label} 
        className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{label}</span>
      </div>
    </div>
  );
}