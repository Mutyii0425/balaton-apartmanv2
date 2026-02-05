import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SEGÉDFÜGGVÉNY: Fizetési mód szép kiírása
const getPaymentLabel = (method?: string) => {
  switch (method) {
    case 'card': return '💳 Bankkártya';
    case 'szep_card': return '💳 SZÉP Kártya';
    case 'cash': return '💵 Készpénz';
    default: return '❓ Nem választott / Ismeretlen';
  }
};

// 1. ÉRTESÍTÉS NEKED (Új foglalás jött)
export async function sendNotificationToAdmin(booking: any) {
  const paymentText = getPaymentLabel(booking.paymentMethod);
  
  // IFA Számítás
  const nights = Math.max(1, Math.round((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)));
  const ifaTotal = booking.adults * nights * 500;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: `📢 ÚJ FOGLALÁS: ${booking.name}`,
    html: `
      <h2>Új foglalási igény érkezett!</h2>
      <p><strong>Név:</strong> ${booking.name}</p>
      <p><strong>Dátum:</strong> ${new Date(booking.startDate).toLocaleDateString('hu-HU')} - ${new Date(booking.endDate).toLocaleDateString('hu-HU')} (${nights} éj)</p>
      <p><strong>Létszám:</strong> ${booking.adults} felnőtt, ${booking.children} gyerek</p>
      <p><strong>Szállásdíj:</strong> ${booking.totalPrice.toLocaleString('hu-HU')} Ft</p>
      <p><strong>Helyszínen fizetendő IFA:</strong> ${ifaTotal.toLocaleString('hu-HU')} Ft</p>
      
      <p style="font-size: 16px; color: #d97706; background-color: #fffbeb; padding: 5px; border-radius: 4px; display: inline-block;">
        <strong>Fizetési mód: ${paymentText}</strong>
      </p>
      
      <p><strong>Kutya:</strong> ${booking.hasDog ? 'IGEN 🐶' : 'Nem'}</p>
      <p><strong>Fűtés:</strong> ${booking.needsHeating ? 'IGEN 🔥' : 'Nem'}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Telefon:</strong> ${booking.phone}</p>
      <br/>
      <a href="https://balatonhegyvidekiapartman.hu/admin" style="padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
        Kezelés az Admin felületen
      </a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin értesítve.');
  } catch (error) {
    console.error('Hiba az admin email küldésekor:', error);
  }
}

// 2. ÉRTESÍTÉS A VENDÉGNEK (Elfogadtuk a foglalást)
export async function sendConfirmationToGuest(booking: any) {
  const paymentText = getPaymentLabel(booking.paymentMethod);

  // IFA Számítás
  const nights = Math.max(1, Math.round((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)));
  const ifaTotal = booking.adults * nights * 500;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.email, 
    subject: `✅ Foglalás Visszaigazolása - Balaton Hegyvidéki Apartman`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Kedves ${booking.name}!</h2>
        <p>Örömmel értesítünk, hogy a foglalásodat <strong>ELFOGADTUK</strong>!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Részletek:</h3>
          <p>📅 <strong>Időpont:</strong> ${new Date(booking.startDate).toLocaleDateString('hu-HU')} - ${new Date(booking.endDate).toLocaleDateString('hu-HU')} (${nights} éjszaka)</p>
          <p>👥 <strong>Létszám:</strong> ${booking.adults} felnőtt, ${booking.children} gyermek</p>
          <p>💰 <strong>Fizetendő szállásdíj:</strong> ${booking.totalPrice.toLocaleString('hu-HU')} Ft</p>
          <p>💳 <strong>Választott fizetési mód:</strong> ${paymentText}</p>
          <p style="color: #b45309; font-weight: bold;">Helyszínen fizetendő IFA: ${ifaTotal.toLocaleString('hu-HU')} Ft</p>
          <p style="font-size: 11px; color: #64748b;">* Az Idegenforgalmi Adó (IFA) 500 Ft/fő/éj 18 év felett, mely a helyszínen fizetendő.</p>
          <p>📍 <strong>Cím:</strong> 8312 Balatonederics, Sipostorok utca 3.</p>
        </div>

        <p>Szeretettel várunk titeket! Ha bármi kérdésed van, keress minket bizalommal.</p>
        <p>Üdvözlettel,<br/>Balaton Hegyvidéki Apartman</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Vendég értesítve.');
  } catch (error) {
    console.error('Hiba a vendég email küldésekor:', error);
  }
}

// 3. ÉRTESÍTÉS ÚJ VÉLEMÉNYRŐL
export async function sendReviewNotification(review: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: `⭐ ÚJ VÉLEMÉNY ÉRKEZETT: ${review.name}`,
    html: `
      <div style="font-family: sans-serif; border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px;">
        <h2 style="color: #f59e0b;">Új véleményt írtak az oldalon!</h2>
        <p><strong>Név:</strong> ${review.name}</p>
        <p><strong>Értékelés:</strong> ${review.rating} / 5 ⭐</p>
        <p><strong>Szöveg:</strong></p>
        <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #f59e0b; font-style: italic;">
          "${review.text}"
        </div>
        <br/>
        <a href="https://balatonhegyvidekiapartman.hu/admin" style="padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Jóváhagyás az Admin felületen
        </a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Vélemény értesítés elküldve.');
  } catch (error) {
    console.error('Hiba a vélemény email küldésekor:', error);
  }
}