import { Resend } from 'resend';

// Inicializálás a Vercel környezeti változóval
const resend = new Resend(process.env.RESEND_API_KEY);

// KONFIGURÁCIÓ
// Amíg nincs saját domained a Resendben, hagyd ezt: 'onboarding@resend.dev'
const FROM_EMAIL = 'info@balatonhegyvidekiapartman.hu'; 
// Ide érkezzenek az admin értesítések (a te címed)
const ADMIN_EMAIL = 'hegyvidekiapartman@gmail.com'; 

/**
 * Segédfüggvény a fizetési módok magyarításához
 */
const getPaymentLabel = (method?: string): string => {
  const methods: Record<string, string> = {
    card: '💳 Bankkártya',
    szep_card: '💳 SZÉP Kártya',
    cash: '💵 Készpénz',
  };
  return methods[method as string] || '❓ Nem választott / Ismeretlen';
};

/**
 * IFA számítása (500 Ft/fő/éj)
 */
const calculateIFA = (adults: number, startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  return adults * nights * 500;
};

// 1. ÉRTESÍTÉS AZ ADMINNAK (Új foglalás)
export async function sendNotificationToAdmin(booking: any) {
  const paymentText = getPaymentLabel(booking.paymentMethod);
  const ifaTotal = calculateIFA(booking.adults, booking.startDate, booking.endDate);

  try {
    const { data, error } = await resend.emails.send({
      from: `Apartman Értesítő <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `📢 ÚJ FOGLALÁS: ${booking.name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px;">Új foglalási igény!</h2>
          <p><strong>Vendég:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Telefon:</strong> ${booking.phone}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Időszak:</strong> ${new Date(booking.startDate).toLocaleDateString('hu-HU')} - ${new Date(booking.endDate).toLocaleDateString('hu-HU')}</p>
          <p><strong>Létszám:</strong> ${booking.adults} felnőtt, ${booking.children} gyermek</p>
          <p><strong>Fizetési mód:</strong> ${paymentText}</p>
          <p><strong>Szállásdíj:</strong> ${booking.totalPrice?.toLocaleString('hu-HU')} Ft</p>
          <p style="color: #d97706;"><strong>Helyszínen fizetendő IFA:</strong> ${ifaTotal.toLocaleString('hu-HU')} Ft</p>
          <div style="background: #f9fafb; padding: 10px; margin-top: 15px; border-radius: 8px;">
             <p>🐶 Kutya: ${booking.hasDog ? 'Van' : 'Nincs'}</p>
             <p>🔥 Fűtés: ${booking.needsHeating ? 'Kér' : 'Nem kér'}</p>
          </div>
          <br/>
          <a href="https://balatonhegyvidekiapartman.hu/admin" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Admin megnyitása</a>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Admin Error]:', err);
    return { success: false, error: err };
  }
}

// 2. ÉRTESÍTÉS A VENDÉGNEK
export async function sendConfirmationToGuest(booking: any) {
  const paymentText = getPaymentLabel(booking.paymentMethod);
  const ifaTotal = calculateIFA(booking.adults, booking.startDate, booking.endDate);

  try {
    const { data, error } = await resend.emails.send({
      from: `Balaton Hegyvidéki Apartman <${FROM_EMAIL}>`,
      to: booking.email,
      subject: `✅ Foglalás Visszaigazolása`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #444;">
          <h2 style="color: #16a34a;">Kedves ${booking.name}!</h2>
          <p>Örömmel értesítünk, hogy a foglalásodat <strong>visszaigazoltuk</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <p>📅 <strong>Időpont:</strong> ${new Date(booking.startDate).toLocaleDateString('hu-HU')} - ${new Date(booking.endDate).toLocaleDateString('hu-HU')}</p>
            <p>💰 <strong>Szállásdíj:</strong> ${booking.totalPrice?.toLocaleString('hu-HU')} Ft</p>
            <p>💳 <strong>Fizetés:</strong> ${paymentText}</p>
            <p style="color: #b45309;"><strong>Helyszínen fizetendő IFA:</strong> ${ifaTotal.toLocaleString('hu-HU')} Ft</p>
          </div>
          <p style="margin-top: 20px;">📍 <strong>Cím:</strong> 8312 Balatonederics, Sipostorok utca 3.</p>
          <p>Várjuk érkezéseteket!</p>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Guest Error]:', err);
    return { success: false, error: err };
  }
}

// 3. VÉLEMÉNY ÉRKEZETT
export async function sendReviewNotification(review: any) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⭐ ÚJ VÉLEMÉNY: ${review.name}`,
      html: `<h3>Új értékelés: ${review.rating}/5</h3><p>${review.text}</p>`,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}