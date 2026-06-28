'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from "../context/LanguageContext"; 
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { format, eachDayOfInterval, differenceInCalendarDays, isWithinInterval, addMonths, subMonths } from 'date-fns';
import { hu, de, enUS } from 'date-fns/locale'; 
import { Loader2, CheckCircle, Calculator, Dog, Wind, CalendarDays, Users, Banknote, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

const PRICES = {
  ADULT_1: 12000,
  ADULT_2: 18000,
  ADULT_3: 27500,
  CHILD: 6000,
  DOG: 2500,
  CLIMATE: 2000 
};

const localeMap = {
  hu: hu,
  de: de,
  en: enUS
};

function getDaysArray(start: string | Date, end: string | Date) {
  return eachDayOfInterval({
    start: new Date(start),
    end: new Date(end),
  });
}

type PaymentMethod = 'cash' | 'card' | 'szep_card';

export default function BookingPage() {
  const { t, language } = useLanguage(); 

  const [date, setDate] = useState<DateRange | undefined>();
  const [month, setMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [hasDog, setHasDog] = useState<boolean>(false);
  const [needsClimate, setNeedsClimate] = useState<boolean>(false); 
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const [occupancyMap, setOccupancyMap] = useState<Record<string, number>>({});
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [pendingDates, setPendingDates] = useState<Date[]>([]);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [nights, setNights] = useState<number>(0);

  // --- FUNKCIÓK ---
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const nextMonth = () => setMonth(addMonths(month, 1));
  const prevMonth = () => setMonth(subMonths(month, 1));

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        
        const counts: Record<string, number> = {};
        const pending: Date[] = [];

        data.forEach((booking: any) => {
          const days = getDaysArray(booking.startDate, booking.endDate);
          days.forEach(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (booking.status === 'CONFIRMED') {
              const weight = booking.apartmentId === 3 ? 2 : 1;
              counts[dateStr] = (counts[dateStr] || 0) + weight;
            } else if (booking.status === 'PENDING') {
              pending.push(day);
            }
          });
        });

        setOccupancyMap(counts);
        setPendingDates(pending);
      } catch (error) {
        console.error("Nem sikerült betölteni a naptárat");
      }
    }
    fetchBookings();
  }, []);

  useEffect(() => {
    const totalGuests = adults + children;
    const newBookedDates: Date[] = [];
    for (const [dateStr, occupiedCount] of Object.entries(occupancyMap)) {
      let isBlocked = false;
      if (totalGuests >= 4) {
        if (occupiedCount >= 1) isBlocked = true; 
      } else {
        if (occupiedCount >= 2) isBlocked = true; 
      }
      if (isBlocked) newBookedDates.push(new Date(dateStr));
    }
    setBookedDates(newBookedDates);

    if (date?.from && date?.to) {
      const nightCount = differenceInCalendarDays(date.to, date.from);
      setNights(nightCount);

      let adultPricePerNight = 0;
      const aptsNeeded = totalGuests > 3 ? 2 : 1;

      if (aptsNeeded === 1) {
        if (adults === 1) adultPricePerNight = PRICES.ADULT_1;
        else if (adults === 2) adultPricePerNight = PRICES.ADULT_2;
        else if (adults === 3) adultPricePerNight = PRICES.ADULT_3;
        else if (adults === 0) adultPricePerNight = 0; 
      } else {
        if (adults === 4) adultPricePerNight = PRICES.ADULT_2 * 2;
        else if (adults === 5) adultPricePerNight = PRICES.ADULT_3 + PRICES.ADULT_2;
        else if (adults === 6) adultPricePerNight = PRICES.ADULT_3 * 2;
        else if (adults <= 3) adultPricePerNight = PRICES.ADULT_1 * 2;
      }

      const childPricePerNight = children * PRICES.CHILD;
      const dogPricePerNight = hasDog ? PRICES.DOG : 0;
      const climatePricePerNight = needsClimate ? (aptsNeeded * PRICES.CLIMATE) : 0;

      let nightlyTotal = adultPricePerNight + childPricePerNight + dogPricePerNight + climatePricePerNight;

      if (nightCount === 1) {
        nightlyTotal = Math.round(nightlyTotal * 1.2);
      }

      setTotalPrice(nightlyTotal * nightCount);
    } else {
      setTotalPrice(0);
      setNights(0);
    }

  }, [adults, children, hasDog, needsClimate, date, occupancyMap]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date?.from || !date?.to) {
      alert(t.booking.select_dates); 
      return;
    }

    const nightCount = differenceInCalendarDays(date.to, date.from);
    const startOfSummer = new Date(new Date().getFullYear(), 6, 1); 
    const endOfSummer = new Date(new Date().getFullYear(), 7, 31); 

    const isSummerBooking = isWithinInterval(date.from, { start: startOfSummer, end: endOfSummer }) || 
                            isWithinInterval(date.to, { start: startOfSummer, end: endOfSummer });

    if (isSummerBooking && nightCount < 4) {
      alert(language === 'hu' 
        ? "A július 1. és augusztus 31. közötti főszezonban minimum 4 éjszaka foglalható!" 
        : "A minimum of 4 nights is required for bookings between July 1 and August 31!");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      adults: adults,
      children: children,
      hasDog: hasDog,
      needsHeating: needsClimate, 
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      startDate: date.from,
      endDate: date.to,
    };

    const isConflict = bookedDates.some(bookedDay => 
      (date.from && date.to && bookedDay >= date.from && bookedDay <= date.to)
    );

    if (isConflict) {
      alert('Sajnáljuk, a választott időpontban nincs szabad hely.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert('Hiba történt a foglalás során.');
      }
    } catch (error) {
      alert('Hálózati hiba.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDF8F1] p-4 pt-32 font-sans text-[#5C3D2E]">
        <Card className="w-full max-w-md text-center p-8 border-[6px] border-[#E0F2E9] shadow-2xl rounded-[2.5rem] bg-white">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-[#E0F2E9] rounded-[1.5rem] flex items-center justify-center rotate-3">
                <CheckCircle className="h-12 w-12 text-[#3A7056] -rotate-3" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-[#3A7056] mb-2">{t.booking.success_title}</CardTitle>
          <p className="text-[#7A5B49] font-medium mb-8">{t.booking.success_msg}</p>
          
          <div className="bg-[#FDF8F1] p-6 rounded-[2rem] mb-8 text-left border border-black/5 shadow-inner">
            <p className="font-bold text-[#5C3D2E] uppercase tracking-wider text-xs mb-4">{t.booking.details}</p>
            <ul className="text-[#7A5B49] space-y-3 text-sm font-medium">
              <li className="flex justify-between items-center">
                <span>Vendégek:</span> 
                <span className="font-bold text-[#5C3D2E] bg-white px-3 py-1 rounded-full shadow-sm">{adults} {t.booking.adults}, {children} {t.booking.children}</span>
              </li>
              {nights === 1 && <li className="flex justify-between items-center text-[#964B33]"><span>Extra:</span> <span className="font-bold bg-[#FFDFD3] px-3 py-1 rounded-full shadow-sm">+20% (1 éjszakás felár)</span></li>}
              {hasDog && <li className="flex justify-between items-center"><span>Extra:</span> <span className="font-bold text-[#964B33] bg-[#FFDFD3] px-3 py-1 rounded-full shadow-sm">🐶 {t.booking.dog}</span></li>}
              {needsClimate && <li className="flex justify-between items-center"><span>Extra:</span> <span className="font-bold text-[#3C6E79] bg-[#D6EAEF] px-3 py-1 rounded-full shadow-sm">❄️ Klíma</span></li>}
              
              <li className="flex justify-between items-center text-[#A67B5B] italic pt-2">
                <span>Idegenforgalmi adó (helyszínen):</span>
                <span>{(adults * nights * 500).toLocaleString('hu-HU')} Ft</span>
              </li>

              <li className="flex justify-between items-center border-t border-[#E8DFF5] pt-4 mt-2">
                <span>Fizetési mód:</span>
                <span className="font-bold capitalize text-[#5C3D2E] bg-white px-3 py-1 rounded-full shadow-sm">
                  {paymentMethod === 'cash' ? 'Készpénz' : paymentMethod === 'card' ? 'Bankkártya' : 'SZÉP Kártya'}
                </span>
              </li>

              <li className="flex justify-between items-center border-t border-[#E8DFF5] pt-4 mt-2 text-lg font-extrabold text-[#5C3D2E]">
                <span>Szállásdíj:</span>
                <span>{totalPrice.toLocaleString('hu-HU')} Ft</span>
              </li>
            </ul>
            <p className="text-[10px] text-[#A67B5B] mt-4 text-center">
              * Az IFA (500 Ft/fő/éj) 18 év felett fizetendő a helyszínen.
            </p>
          </div>
          
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full h-14 rounded-2xl border-4 border-[#E0F2E9] text-[#3A7056] hover:bg-[#E0F2E9] font-bold text-base transition-all">
            {t.booking.back_to_calendar}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF8F1] selection:bg-[#FCE8B2] pt-28 pb-20 px-4 md:px-8 font-sans text-[#5C3D2E]">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#5C3D2E] mb-6 tracking-tight drop-shadow-sm">{t.booking.title}</h1>
          <p className="text-lg md:text-xl text-[#7A5B49] max-w-2xl mx-auto font-medium">{t.booking.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
          
          {/* NAPTÁR KÁRTYA */}
          <Card className="xl:col-span-2 shadow-xl border-[8px] border-white rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="bg-[#FFDFD3] border-b-0 p-6 md:p-10 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                 <div className="p-4 bg-white/60 backdrop-blur-sm rounded-[1.5rem] text-[#964B33] shadow-sm rotate-3 hover:rotate-0 transition-transform"><CalendarDays size={32} /></div>
                 <div>
                    <CardTitle className="text-3xl md:text-4xl text-[#964B33] font-extrabold tracking-tight">{t.booking.calendar}</CardTitle>
                    <CardDescription className="text-[#964B33]/80 font-bold text-base md:text-lg mt-1">
                      {adults + children >= 4 
                        ? (language === 'hu' ? "Nagyobb társaság esetén mindkét apartmanra szükség van." : "Both apartments needed for larger groups.") 
                        : (language === 'hu' ? "Kisebb létszámnál elég az egyik apartman." : "One apartment is enough for smaller groups.")}
                    </CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-10">
              {date?.from && isWithinInterval(date.from, { 
                start: new Date(new Date().getFullYear(), 6, 1), 
                end: new Date(new Date().getFullYear(), 7, 31) 
              }) && (
                <div className="mb-8 p-5 bg-[#FCE8B2] border-none rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-2 shadow-sm">
                  <div className="bg-white/60 p-3 rounded-2xl text-[#8C6D1F]">
                    <CalendarDays size={24} />
                  </div>
                  <p className="text-base font-bold text-[#8C6D1F] leading-snug">
                    {language === 'hu' 
                      ? "Főszezoni időszak (július-augusztus): Ebben az időszakban legalább 4 éjszaka foglalható." 
                      : "High season (July-August): Minimum 4 nights required."}
                  </p>
                </div>
              )}

              <div className="relative group">
                <div className="absolute top-5 left-0 right-0 flex justify-between px-2 md:px-6 z-50 pointer-events-none">
                  <Button 
                    type="button" variant="outline" size="icon" 
                    className="h-12 w-12 rounded-full bg-white shadow-lg pointer-events-auto hover:bg-[#FFDFD3] hover:text-[#964B33] border-none transition-transform hover:scale-110"
                    onClick={prevMonth}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    type="button" variant="outline" size="icon" 
                    className="h-12 w-12 rounded-full bg-white shadow-lg pointer-events-auto hover:bg-[#FFDFD3] hover:text-[#964B33] border-none transition-transform hover:scale-110"
                    onClick={nextMonth}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex justify-center mb-10 w-full overflow-x-auto pb-4">
                  <Calendar
                    key={month.toISOString()} 
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    month={month}
                    onMonthChange={setMonth}
                    locale={localeMap[language as keyof typeof localeMap]} 
                    numberOfMonths={2}
                    className="rounded-3xl border-none p-0 md:p-4 relative bg-white"
                    disabled={[{ before: new Date() }, ...bookedDates]}
                    modifiers={{ booked: bookedDates, pending: pendingDates }}
                    modifiersClassNames={{
                      booked: "bg-red-50 text-red-300 line-through decoration-red-300 opacity-60 cursor-not-allowed rounded-xl",
                      pending: "bg-[#FCE8B2] text-[#8C6D1F] font-bold rounded-xl"
                    }}
                    classNames={{
                      months: "flex flex-col md:flex-row space-y-6 md:space-x-12 md:space-y-0 justify-center",
                      month: "space-y-4", 
                      caption: "flex justify-center pt-2 relative items-center mb-6",
                      caption_label: "text-2xl font-extrabold text-[#5C3D2E] capitalize",
                      nav: "hidden", 
                      table: "w-full border-collapse space-y-2",
                      head_row: "flex mb-2",
                      head_cell: "text-[#A67B5B] rounded-md w-12 font-bold text-sm flex justify-center items-center h-12 uppercase",
                      row: "flex w-full mt-2 gap-1",
                      cell: "h-12 w-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "h-12 w-12 p-0 font-bold text-base text-[#5C3D2E] aria-selected:opacity-100 hover:bg-[#FDF8F1] rounded-2xl transition-all flex items-center justify-center",
                      day_selected: "bg-[#E87A5D] text-white hover:bg-[#D96C4A] hover:text-white focus:bg-[#E87A5D] focus:text-white shadow-md scale-105",
                      day_today: "bg-[#FDF8F1] text-[#E87A5D] font-extrabold ring-4 ring-[#FFDFD3]",
                      day_outside: "text-[#D0C0B5] opacity-50",
                      day_disabled: "text-[#D0C0B5] opacity-50",
                      day_range_middle: "aria-selected:bg-[#FFDFD3] aria-selected:text-[#964B33] scale-100 rounded-none",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </div>

              {/* Kijelölt dátum megjelenítő */}
              <div className="bg-[#FDF8F1] rounded-[2rem] p-6 text-center border-4 border-[#FFDFD3]/30 shadow-inner">
                 <p className="text-xl md:text-2xl text-[#5C3D2E] flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 font-medium">
                    {date?.from ? (
                      date.to ? (
                        <>
                          <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm">
                            <span className="font-extrabold text-[#E87A5D]">{format(date.from, 'yyyy. MM. dd.')}</span> 
                            <span className="text-[#D0C0B5] hidden md:inline">-</span>
                            <span className="font-extrabold text-[#E87A5D]">{format(date.to, 'yyyy. MM. dd.')}</span>
                          </div>
                          <span className="bg-[#E87A5D] text-white text-sm py-2 px-6 rounded-full font-bold uppercase tracking-wider shadow-md">
                            {nights} {t.booking.night}
                          </span>
                        </>
                      ) : (t.booking.select_end_date)
                    ) : (
                        <span className="text-[#A67B5B] italic font-semibold">{t.booking.select_dates}</span>
                    )}
                 </p>
              </div>
            </CardContent>
          </Card>

          {/* ŰRLAP ÉS ÁRKALKULÁTOR KÁRTYA */}
          <Card className="shadow-2xl border-[8px] border-white rounded-[3rem] bg-[#FDF8F1] h-fit sticky top-24 overflow-hidden">
            <CardHeader className="bg-[#FCE8B2] pb-8 pt-10 px-6 md:px-10 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="p-4 bg-white/60 backdrop-blur-sm rounded-[1.5rem] text-[#8C6D1F] shadow-sm -rotate-3 hover:rotate-0 transition-transform"><Calculator size={32} /></div>
                    <CardTitle className="text-3xl font-extrabold text-[#8C6D1F]">{t.booking.calc_title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-6 md:px-10 pb-10 pt-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* VENDÉGEK SZEKCIÓ */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 text-[#5C3D2E] font-extrabold text-lg">
                     <div className="p-2 bg-[#D6EAEF] rounded-xl text-[#3C6E79]"><Users size={20} /></div> Vendégek
                  </div>
                  
                  <div className="flex flex-row gap-4 items-end">
                    <div className="flex-1 space-y-3">
                      <Label htmlFor="adults" className="text-xs font-bold uppercase text-[#A67B5B] tracking-widest block">
                        {t.booking.adults}
                      </Label>
                      <Input 
                        type="number" min={1} max={6} 
                        value={adults} 
                        onFocus={handleInputFocus}
                        onChange={(e) => setAdults(e.target.value === '' ? 0 : Number(e.target.value))}
                        className="bg-[#FDF8F1] h-14 text-2xl font-extrabold border-none rounded-2xl text-center w-full text-[#5C3D2E] focus:ring-4 focus:ring-[#FFDFD3] transition-all"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <Label htmlFor="children" className="text-xs font-bold uppercase text-[#A67B5B] tracking-widest block leading-tight">
                        {t.booking.children} <span className="lowercase font-semibold opacity-70 block text-[10px]">(2-14 év)</span>
                      </Label>
                      <Input 
                        type="number" min={0} max={5} 
                        value={children} 
                        onFocus={handleInputFocus}
                        onChange={(e) => setChildren(e.target.value === '' ? 0 : Number(e.target.value))}
                        className="bg-[#FDF8F1] h-14 text-2xl font-extrabold border-none rounded-2xl text-center w-full text-[#5C3D2E] focus:ring-4 focus:ring-[#FFDFD3] transition-all"
                      />
                    </div>
                  </div>
                  
                  {/* Extrák kapcsolói - Pasztell kártyás stílus */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-[#FDF8F1]">
                      <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-4 ${hasDog ? 'bg-[#FFDFD3] border-[#FFDFD3]' : 'bg-white border-[#FDF8F1] hover:border-[#FFDFD3]'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-xl transition-transform ${hasDog ? 'bg-white/60 text-[#964B33] scale-110' : 'bg-[#FDF8F1] text-[#A67B5B]'}`}><Dog size={20} /></div>
                           <span className={`font-extrabold ${hasDog ? 'text-[#964B33]' : 'text-[#7A5B49]'}`}>{t.booking.dog}</span>
                        </div>
                        <input type="checkbox" checked={hasDog} onChange={(e) => setHasDog(e.target.checked)} className="w-6 h-6 accent-[#E87A5D] rounded-md cursor-pointer" />
                      </label>
                      <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-4 ${needsClimate ? 'bg-[#D6EAEF] border-[#D6EAEF]' : 'bg-white border-[#FDF8F1] hover:border-[#D6EAEF]'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-xl transition-transform ${needsClimate ? 'bg-white/60 text-[#3C6E79] scale-110' : 'bg-[#FDF8F1] text-[#A67B5B]'}`}><Wind size={20} /></div>
                           <span className={`font-extrabold ${needsClimate ? 'text-[#3C6E79]' : 'text-[#7A5B49]'}`}>Klíma (+2000Ft)</span>
                        </div>
                        <input type="checkbox" checked={needsClimate} onChange={(e) => setNeedsClimate(e.target.checked)} className="w-6 h-6 accent-[#3C6E79] rounded-md cursor-pointer" />
                      </label>
                  </div>
                </div>

                {/* Személyes adatok */}
                <div className="space-y-5 bg-white p-6 rounded-[2rem] shadow-sm">
                    <div className="space-y-2">
                        <Label className="text-[#A67B5B] font-bold text-xs uppercase tracking-widest pl-2">{t.booking.name}</Label>
                        <Input name="name" required className="h-14 border-none bg-[#FDF8F1] focus:bg-white focus:ring-4 focus:ring-[#FFDFD3] rounded-2xl font-bold text-[#5C3D2E] px-4" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#A67B5B] font-bold text-xs uppercase tracking-widest pl-2">{t.booking.email}</Label>
                        <Input name="email" type="email" required className="h-14 border-none bg-[#FDF8F1] focus:bg-white focus:ring-4 focus:ring-[#FFDFD3] rounded-2xl font-bold text-[#5C3D2E] px-4" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#A67B5B] font-bold text-xs uppercase tracking-widest pl-2">{t.booking.phone}</Label>
                        <Input name="phone" required className="h-14 border-none bg-[#FDF8F1] focus:bg-white focus:ring-4 focus:ring-[#FFDFD3] rounded-2xl font-bold text-[#5C3D2E] px-4" />
                    </div>
                </div>

                {/* Fizetési Mód */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-[#5C3D2E] font-extrabold text-lg mb-2">
                     <div className="p-2 bg-[#E0F2E9] rounded-xl text-[#3A7056]"><Banknote size={20} /></div> Fizetési mód
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex items-center justify-between p-4 rounded-2xl border-4 transition-all ${paymentMethod === 'cash' ? 'bg-[#E0F2E9] border-[#E0F2E9]' : 'bg-white border-[#FDF8F1] hover:border-[#E0F2E9]'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${paymentMethod === 'cash' ? 'bg-white/60 text-[#3A7056]' : 'bg-[#FDF8F1] text-[#A67B5B]'}`}><Banknote size={20} /></div>
                        <span className={`font-extrabold ${paymentMethod === 'cash' ? 'text-[#3A7056]' : 'text-[#7A5B49]'}`}>Készpénz</span>
                      </div>
                      {paymentMethod === 'cash' && <div className="w-4 h-4 rounded-full bg-[#3A7056] shadow-inner" />}
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`flex items-center justify-between p-4 rounded-2xl border-4 transition-all ${paymentMethod === 'card' ? 'bg-[#D6EAEF] border-[#D6EAEF]' : 'bg-white border-[#FDF8F1] hover:border-[#D6EAEF]'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${paymentMethod === 'card' ? 'bg-white/60 text-[#3C6E79]' : 'bg-[#FDF8F1] text-[#A67B5B]'}`}><CreditCard size={20} /></div>
                        <span className={`font-extrabold ${paymentMethod === 'card' ? 'text-[#3C6E79]' : 'text-[#7A5B49]'}`}>Bankkártya</span>
                      </div>
                      {paymentMethod === 'card' && <div className="w-4 h-4 rounded-full bg-[#3C6E79] shadow-inner" />}
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('szep_card')} className={`flex items-center justify-between p-4 rounded-2xl border-4 transition-all ${paymentMethod === 'szep_card' ? 'bg-[#E8DFF5] border-[#E8DFF5]' : 'bg-white border-[#FDF8F1] hover:border-[#E8DFF5]'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${paymentMethod === 'szep_card' ? 'bg-white/60 text-[#604987]' : 'bg-[#FDF8F1] text-[#A67B5B]'}`}><CreditCard size={20} /></div>
                        <span className={`font-extrabold ${paymentMethod === 'szep_card' ? 'text-[#604987]' : 'text-[#7A5B49]'}`}>SZÉP Kártya</span>
                      </div>
                      {paymentMethod === 'szep_card' && <div className="w-4 h-4 rounded-full bg-[#604987] shadow-inner" />}
                    </button>
                  </div>
                </div>

                {/* Végösszeg */}
                <div className="bg-[#5C3D2E] text-white p-8 rounded-[2rem] flex flex-col gap-3 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[#D0C0B5] text-xs font-extrabold uppercase tracking-widest mb-1">{t.booking.total}</p>
                      <p className="text-sm text-white/80 font-semibold bg-white/10 px-3 py-1 rounded-full inline-block">{nights} {t.booking.night} / {adults + children} fő</p>
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-[#FCE8B2] tracking-tight drop-shadow-md">
                      {totalPrice.toLocaleString('hu-HU')} <span className="text-xl text-[#FCE8B2]/70">Ft</span>
                    </div>
                  </div>
                  {nights === 1 && (
                    <div className="flex items-center gap-3 text-xs font-bold text-[#964B33] bg-[#FFDFD3] p-3 rounded-xl mt-3 relative z-10">
                      <Calculator size={16} />
                      <span>AZ ÁR TARTALMAZZA A 20% EGYSZAKÁS FELÁRAT</span>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full text-xl h-16 font-extrabold bg-[#E87A5D] hover:bg-[#D96C4A] hover:scale-[1.02] text-white rounded-[1.5rem] shadow-[0_10px_25px_rgba(232,122,93,0.4)] transition-all" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : t.booking.send}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}