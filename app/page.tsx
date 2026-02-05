'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from "../app/context/LanguageContext"; 
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { format, eachDayOfInterval, differenceInCalendarDays, isWithinInterval } from 'date-fns';
import { hu, de, enUS } from 'date-fns/locale'; 
import { Loader2, CheckCircle, Calculator, Dog, Wind, CalendarDays, Users, Banknote, CreditCard } from 'lucide-react';

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
  const [month, setMonth] = useState<Date>(new Date()); // ÚJ: A naptár aktuális nézetének kezelése
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 pt-32">
        <Card className="w-full max-w-md text-center p-8 border-green-500 border-2 shadow-2xl rounded-3xl bg-white">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-green-700 mb-2">{t.booking.success_title}</CardTitle>
          <p className="text-gray-500 mb-8">{t.booking.success_msg}</p>
          
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left border border-gray-100 shadow-inner">
            <p className="font-bold text-gray-900 uppercase tracking-wide text-xs mb-3">{t.booking.details}</p>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li className="flex justify-between"><span>Vendégek:</span> <span className="font-medium">{adults} {t.booking.adults}, {children} {t.booking.children}</span></li>
              {nights === 1 && <li className="flex justify-between text-amber-600 font-bold"><span>Extra:</span> <span>+20% (1 éjszakás felár)</span></li>}
              {hasDog && <li className="flex justify-between text-blue-600"><span>Extra:</span> <span className="font-medium">🐶 {t.booking.dog}</span></li>}
              {needsClimate && <li className="flex justify-between text-blue-400"><span>Extra:</span> <span className="font-medium">❄️ Klíma (+2000Ft/éj)</span></li>}
              
              <li className="flex justify-between text-slate-500 italic">
                <span>Idegenforgalmi adó (helyszínen):</span>
                <span>{(adults * nights * 500).toLocaleString('hu-HU')} Ft</span>
              </li>

              <li className="flex justify-between border-t pt-2 mt-2">
                <span>Fizetési mód:</span>
                <span className="font-medium capitalize text-slate-900">
                  {paymentMethod === 'cash' ? 'Készpénz' : paymentMethod === 'card' ? 'Bankkártya' : 'SZÉP Kártya'}
                </span>
              </li>

              <li className="flex justify-between border-t pt-2 mt-2 text-lg font-bold text-blue-900">
                <span>Szállásdíj:</span>
                <span>{totalPrice.toLocaleString('hu-HU')} Ft</span>
              </li>
            </ul>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              * Az IFA (500 Ft/fő/éj) 18 év felett fizetendő a helyszínen.
            </p>
          </div>
          
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full h-12 rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold">
            {t.booking.back_to_calendar}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{t.booking.title}</h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light">{t.booking.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <Card className="xl:col-span-2 shadow-xl border-gray-100 rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="bg-blue-50/50 border-b border-blue-50 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-2">
                 <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><CalendarDays size={28} /></div>
                 <CardTitle className="text-2xl md:text-3xl text-blue-900 font-bold">{t.booking.calendar}</CardTitle>
              </div>
              <CardDescription className="text-blue-700/80 font-medium text-base md:text-lg pl-1">
                {adults + children >= 4 
                  ? (language === 'hu' ? "Nagyobb társaság esetén mindkét apartmanra szükség van." : "Both apartments needed for larger groups.") 
                  : (language === 'hu' ? "Kisebb létszámnál elég az egyik apartman." : "One apartment is enough for smaller groups.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              {date?.from && isWithinInterval(date.from, { 
                start: new Date(new Date().getFullYear(), 6, 1), 
                end: new Date(new Date().getFullYear(), 7, 31) 
              }) && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                    <CalendarDays size={20} />
                  </div>
                  <p className="text-sm font-semibold text-amber-900 leading-tight">
                    {language === 'hu' 
                      ? "Főszezoni időszak (július-augusztus): Ebben az időszakban legalább 4 éjszaka foglalható." 
                      : "High season (July-August): Minimum 4 nights required."}
                  </p>
                </div>
              )}

              {/* JAVÍTOTT: month és onMonthChange hozzáadva, overflow-x-auto a görgethetőségért */}
              <div className="flex justify-center mb-8 w-full overflow-x-auto pb-4">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  month={month}
                  onMonthChange={setMonth}
                  locale={localeMap[language as keyof typeof localeMap]} 
                  numberOfMonths={2}
                  className="rounded-xl border border-gray-100 p-4 shadow-sm relative bg-white"
                  disabled={[{ before: new Date() }, ...bookedDates]}
                  modifiers={{ booked: bookedDates, pending: pendingDates }}
                  modifiersClassNames={{
                    booked: "bg-red-50 text-red-300 line-through decoration-red-300 opacity-60 cursor-not-allowed",
                    pending: "bg-orange-100 text-orange-600 font-bold"
                  }}
                  classNames={{
                    months: "flex flex-col md:flex-row space-y-4 md:space-x-8 md:space-y-0 justify-center",
                    month: "space-y-4", 
                    caption: "flex justify-center pt-1 relative items-center mb-4",
                    caption_label: "text-lg font-bold text-slate-800",
                    nav: "space-x-1 flex items-center absolute top-3 w-full justify-between px-2 left-0 pointer-events-none",
                    nav_button: "h-8 w-8 bg-white border border-gray-100 p-0 hover:bg-slate-50 rounded-full transition-colors shadow-sm pointer-events-auto",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-slate-400 rounded-md w-10 font-normal text-[0.8rem] flex justify-center items-center h-10",
                    row: "flex w-full mt-2",
                    cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-blue-50/50 [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-medium aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors flex items-center justify-center",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white shadow-md",
                    day_today: "bg-slate-100 text-slate-900 font-bold ring-1 ring-slate-300",
                    day_outside: "text-slate-300 opacity-50",
                    day_disabled: "text-slate-300 opacity-50",
                    day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-900",
                    day_hidden: "invisible",
                  }}
                />
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 md:p-6 text-center border border-slate-100">
                 <p className="text-lg md:text-xl text-slate-700 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                    {date?.from ? (
                      date.to ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600">{format(date.from, 'yyyy. MM. dd.')}</span> 
                            <span className="text-gray-300 hidden md:inline">|</span>
                            <span className="font-bold text-blue-600">{format(date.to, 'yyyy. MM. dd.')}</span>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-sm py-1.5 px-4 rounded-full font-bold uppercase tracking-wide">
                            {nights} {t.booking.night}
                          </span>
                        </>
                      ) : (t.booking.select_end_date)
                    ) : (
                        <span className="text-gray-400 italic font-medium">{t.booking.select_dates}</span>
                    )}
                 </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-t-8 border-t-blue-600 rounded-[2rem] bg-white h-fit sticky top-24 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-2"></div>
            <CardHeader className="pb-6 pt-8 px-6 md:px-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600 shadow-sm"><Calculator size={28} /></div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{t.booking.calc_title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-6 md:px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-5">
                  <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                     <Users size={20} className="text-blue-500" /> Vendégek
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adults" className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.booking.adults}</Label>
                      <Input 
                        type="number" min={1} max={6} 
                        value={adults} 
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="bg-white h-12 text-xl font-bold border-gray-200 rounded-xl text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="children" className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.booking.children}</Label>
                      <Input 
                        type="number" min={0} max={5} 
                        value={children} 
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="bg-white h-12 text-xl font-bold border-gray-200 rounded-xl text-center"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-5 border-t border-slate-200">
                      <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-all group">
                        <div className="flex items-center gap-3">
                           <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform"><Dog size={18} /></div>
                           <span className="font-semibold text-slate-700">{t.booking.dog}</span>
                        </div>
                        <input type="checkbox" checked={hasDog} onChange={(e) => setHasDog(e.target.checked)} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-all group">
                        <div className="flex items-center gap-3">
                           <div className="bg-blue-50 p-2 rounded-lg text-blue-400 group-hover:scale-110 transition-transform"><Wind size={18} /></div>
                           <span className="font-semibold text-slate-700">Klíma használat (+2000Ft/éj)</span>
                        </div>
                        <input type="checkbox" checked={needsClimate} onChange={(e) => setNeedsClimate(e.target.checked)} className="w-5 h-5 accent-blue-400 rounded cursor-pointer" />
                      </label>
                  </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-slate-500 font-medium pl-1">{t.booking.name}</Label>
                        <Input name="name" required className="h-11 border-gray-200 bg-gray-50 focus:bg-white rounded-xl" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-slate-500 font-medium pl-1">{t.booking.email}</Label>
                        <Input name="email" type="email" required className="h-11 border-gray-200 bg-gray-50 focus:bg-white rounded-xl" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-slate-500 font-medium pl-1">{t.booking.phone}</Label>
                        <Input name="phone" required className="h-11 border-gray-200 bg-gray-50 focus:bg-white rounded-xl" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                     <Banknote size={20} className="text-green-600" /> Fizetési mód
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${paymentMethod === 'cash' ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentMethod === 'cash' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}><Banknote size={20} /></div>
                        <span className="font-semibold text-slate-700">Készpénz</span>
                      </div>
                      {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}><CreditCard size={20} /></div>
                        <span className="font-semibold text-slate-700">Bankkártya</span>
                      </div>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('szep_card')} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${paymentMethod === 'szep_card' ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentMethod === 'szep_card' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}><CreditCard size={20} /></div>
                        <span className="font-semibold text-slate-700">SZÉP Kártya</span>
                      </div>
                      {paymentMethod === 'szep_card' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col gap-2 shadow-xl ring-4 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{t.booking.total}</p>
                      <p className="text-sm text-slate-500 font-medium">{nights} {t.booking.night} / {adults + children} fő</p>
                    </div>
                    <div className="text-2xl md:text-3xl font-extrabold text-yellow-400 tracking-tight">
                      {totalPrice.toLocaleString('hu-HU')} <span className="text-lg text-yellow-600/80">Ft</span>
                    </div>
                  </div>
                  {nights === 1 && (
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-amber-400 bg-amber-400/10 p-2 rounded-lg border border-amber-400/20 mt-1">
                      <Calculator size={14} />
                      <span>AZ ÁR TARTALMAZZA A 20% EGYSZAKÁS FELÁRAT</span>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full text-lg h-14 font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl transition-all" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : t.booking.send}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}