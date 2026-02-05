'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, Trash2, CheckCircle, XCircle, Users, Home, Calendar, 
  Mail, Phone, Pencil, Save, X, Banknote, MessageSquare, 
  ListTodo, ShieldCheck, CreditCard, Dog, Flame 
} from 'lucide-react';

// --- TÍPUSOK (Mindent megtartottam + hozzáadtam az újakat) ---
interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  guests: number;
  adults: number;   
  children: number; 
  hasDog: boolean;  
  needsHeating: boolean; 
  apartmentId: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  totalPrice: number;
  paymentMethod?: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const resBookings = await fetch('/api/bookings');
      const data = await resBookings.json();
      setBookings(Array.isArray(data) ? data : []);

      const resReviews = await fetch('/api/reviews/all');
      setReviews(await resReviews.json());
    } catch (error) {
      console.error('Hiba az adatok betöltésekor');
    } finally {
      setLoading(false);
    }
  }

  // --- MŰVELETEK (Megmaradt minden régi funkció) ---
  async function updateBookingStatus(id: number, newStatus: string) {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  }

  async function deleteBooking(id: number) {
    if (!confirm('Biztosan törölni szeretnéd?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    fetchData();
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBooking) return;

    await fetch(`/api/bookings/${editingBooking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingBooking.name,
        email: editingBooking.email,
        phone: editingBooking.phone,
        adults: Number(editingBooking.adults),
        children: Number(editingBooking.children),
        guests: Number(editingBooking.adults) + Number(editingBooking.children),
        hasDog: editingBooking.hasDog,
        needsHeating: editingBooking.needsHeating,
        startDate: editingBooking.startDate,
        endDate: editingBooking.endDate,
        // Itt az összes mezőt beküldjük, hogy ne vesszen el semmi
      }),
    });

    setEditingBooking(null);
    fetchData();
  }

  async function approveReview(id: number) {
    await fetch(`/api/reviews/${id}`, { method: 'PATCH' });
    fetchData();
  }

  async function deleteReview(id: number) {
    if (!confirm('Biztosan törölni akarod ezt a véleményt?')) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    fetchData();
  }

  const getApartmentDetails = (id: number) => {
    switch (id) {
      case 1: return { name: 'A Apartman', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 2: return { name: 'B Apartman', color: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 3: return { name: 'EGÉSZ HÁZ', color: 'bg-purple-50 text-purple-700 border-purple-100 font-bold' };
      default: return { name: 'Nincs kijelölve', color: 'bg-gray-100' };
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'card': return { text: 'Bankkártya', icon: <CreditCard className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'szep_card': return { text: 'SZÉP Kártya', icon: <CreditCard className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'cash': return { text: 'Készpénz', icon: <Banknote className="w-4 h-4" />, color: 'bg-green-100 text-green-800 border-green-200' };
      default: return { text: 'Ismeretlen', icon: <Banknote className="w-4 h-4" />, color: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50/50"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;

  return (
    <main className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* FEJLÉC ÉS TABOK */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-slate-900 rounded-xl text-white shadow-md"><ShieldCheck size={24} /></div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Adminisztráció</h1>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
            <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all font-medium ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
              <ListTodo className="w-4 h-4" /> Foglalások
              <Badge variant="secondary" className={`ml-1 ${activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{bookings.length}</Badge>
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all font-medium ${activeTab === 'reviews' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
              <MessageSquare className="w-4 h-4" /> Vélemények
              {reviews.some(r => !r.isApproved) && <span className="w-2.5 h-2.5 bg-red-500 rounded-full ml-1 animate-pulse ring-2 ring-white"></span>}
            </button>
          </div>
        </div>

        {/* --- 1. FOGLALÁSOK LISTA --- */}
        {activeTab === 'bookings' && (
          <div className="grid gap-6">
            {bookings.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                <p className="text-slate-400 text-lg">Nincs még foglalás a rendszerben.</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const apt = getApartmentDetails(booking.apartmentId);
                const payment = getPaymentMethodLabel(booking.paymentMethod);

                return (
                  <Card key={booking.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-2xl group">
                    <div className={`h-2 w-full ${booking.status === 'CONFIRMED' ? 'bg-green-500' : booking.status === 'REJECTED' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                    <div className="p-6 md:p-8 flex flex-col lg:flex-row justify-between gap-8">
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <h3 className="font-bold text-2xl text-slate-800">{booking.name}</h3>
                          <Badge className={`text-sm px-3 py-1 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                            {booking.status === 'CONFIRMED' ? 'ELFOGADVA' : booking.status === 'REJECTED' ? 'ELUTASÍTVA' : 'FÜGGŐBEN'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="font-bold">{format(new Date(booking.startDate), 'MM.dd.')} - {format(new Date(booking.endDate), 'MM.dd.')}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-bold">{booking.adults || booking.guests} felnőtt, {booking.children || 0} gyerek</span>
                          </div>
                          <div className={`flex items-center gap-2 p-3 rounded-xl border ${apt.color}`}>
                            <Home className="w-4 h-4" />
                            <span className="font-bold">{apt.name}</span>
                          </div>
                          <div className={`flex items-center gap-2 p-3 rounded-xl border ${payment.color}`}>
                            {payment.icon}
                            <span className="font-bold">{payment.text}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-xl border border-yellow-100 text-yellow-700">
                            <Banknote className="w-4 h-4" />
                            <span className="font-bold">{booking.totalPrice?.toLocaleString('hu-HU')} Ft</span>
                          </div>
                        </div>

                        {/* EXTRÁK (Kutya, Fűtés) */}
                        <div className="flex gap-4 pt-1">
                          {booking.hasDog && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><Dog className="w-3 h-3 mr-1" /> Kutya</Badge>}
                          {booking.needsHeating && <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50"><Flame className="w-3 h-3 mr-1" /> Fűtés</Badge>}
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-slate-500 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer"><Mail className="w-4 h-4" /> {booking.email}</div>
                          <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer"><Phone className="w-4 h-4" /> {booking.phone || '-'}</div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col items-center justify-center gap-3 border-t lg:border-t-0 lg:border-l lg:border-slate-100 pt-6 lg:pt-0 lg:pl-8 min-w-[160px]">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setEditingBooking(booking)}>
                          <Pencil className="w-4 h-4 mr-2" /> Szerkeszt
                        </Button>
                        {booking.status === 'PENDING' && (
                          <>
                            <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')} className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm">
                              <CheckCircle className="w-4 h-4 mr-2" /> Elfogad
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(booking.id, 'REJECTED')} className="w-full bg-white text-red-600 border border-red-100 hover:bg-red-50 shadow-sm">
                              <XCircle className="w-4 h-4 mr-2" /> Elutasít
                            </Button>
                          </>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => deleteBooking(booking.id)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 mt-1 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* --- 2. VÉLEMÉNYEK LISTA (Érintetlen) --- */}
        {activeTab === 'reviews' && (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className={`overflow-hidden shadow-sm rounded-2xl border-l-8 ${review.isApproved ? 'border-l-green-500' : 'border-l-orange-400 bg-orange-50/30'}`}>
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">{review.name.charAt(0).toUpperCase()}</div>
                      <div>
                          <h3 className="font-bold text-lg text-slate-800">{review.name}</h3>
                          <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      {review.isApproved ? <Badge className="bg-green-100 text-green-700">PUBLIKUS</Badge> : <Badge className="bg-orange-100 text-orange-700">VÁRAKOZIK</Badge>}
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => <span key={i} className={i < review.rating ? "fill-current" : "text-gray-300"}>★</span>)}
                    </div>
                    <div className="bg-white/50 p-4 rounded-xl italic text-slate-600">"{review.text}"</div>
                  </div>
                  <div className="flex md:flex-col items-center justify-center gap-3">
                    {!review.isApproved && <Button onClick={() => approveReview(review.id)} className="bg-green-600 text-white w-full"><CheckCircle className="w-4 h-4 mr-2" /> Publikál</Button>}
                    <Button variant="ghost" onClick={() => deleteReview(review.id)} className="text-red-400 hover:text-red-600 w-full"><Trash2 className="w-5 h-5" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* --- SZERKESZTŐ MODAL (Megmaradt a régi, de bővült az új mezőkkel) --- */}
      {editingBooking && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-slate-50 px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Foglalás Szerkesztése</h2>
              <Button size="icon" variant="ghost" onClick={() => setEditingBooking(null)}><X className="w-5 h-5 text-slate-500" /></Button>
            </div>
            
            <form onSubmit={saveEdit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Érkezés</Label>
                  <Input type="date" value={new Date(editingBooking.startDate).toISOString().split('T')[0]} onChange={(e) => setEditingBooking({...editingBooking, startDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <Label>Távozás</Label>
                  <Input type="date" value={new Date(editingBooking.endDate).toISOString().split('T')[0]} onChange={(e) => setEditingBooking({...editingBooking, endDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Név</Label>
                <Input value={editingBooking.name} onChange={(e) => setEditingBooking({...editingBooking, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Felnőtt</Label>
                  <Input type="number" value={editingBooking.adults} onChange={(e) => setEditingBooking({...editingBooking, adults: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <Label>Gyermek</Label>
                  <Input type="number" value={editingBooking.children} onChange={(e) => setEditingBooking({...editingBooking, children: Number(e.target.value)})} />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingBooking.hasDog} onChange={(e) => setEditingBooking({...editingBooking, hasDog: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm font-medium">Kutya 🐶</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingBooking.needsHeating} onChange={(e) => setEditingBooking({...editingBooking, needsHeating: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm font-medium">Fűtés 🔥</span>
                 </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingBooking(null)}>Mégse</Button>
                <Button type="submit" className="bg-blue-600 text-white"><Save className="w-4 h-4 mr-2" /> Mentés</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}