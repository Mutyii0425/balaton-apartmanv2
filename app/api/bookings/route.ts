import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Hiba' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBooking = await prisma.booking.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        adults: parseInt(body.adults),
        children: parseInt(body.children),
        hasDog: body.hasDog,
        needsHeating: body.needsHeating,
        paymentMethod: body.paymentMethod,
        totalPrice: body.totalPrice,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: 'PENDING',
        apartmentId: body.adults + body.children > 3 ? 3 : 1,
      },
    });

    // Értesítés neked
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'ÚJ FOGLALÁSI IGÉNY ÉRKEZETT!',
      text: `Vendég: ${body.name}\nIdőpont: ${body.startDate} - ${body.endDate}\nÖsszeg: ${body.totalPrice} Ft\nTelefon: ${body.phone}`,
    });

    // Nyugtázó a vendégnek
    await transporter.sendMail({
      from: `"Hegyvidéki Apartman" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: 'Foglalási igényét megkaptuk',
      html: `<p>Kedves ${body.name}!</p><p>Foglalási igényét rögzítettük. Hamarosan küldjük a végleges visszaigazolást!</p>`,
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Hiba' }, { status: 500 });
  }
}