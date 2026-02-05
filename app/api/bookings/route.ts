import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNotificationToAdmin } from '@/lib/mail'; 

// Ez kötelező, hogy az Admin oldal ne a régi (cache-elt) listát mutassa
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Lekérési hiba:", error);
    return NextResponse.json({ error: 'Hiba a lekéréskor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mentés az adatbázisba az új sémád szerint
    const newBooking = await prisma.booking.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        adults: Number(body.adults),
        children: Number(body.children),
        guests: Number(body.adults) + Number(body.children),
        hasDog: body.hasDog,
        needsHeating: body.needsHeating, // Ez tárolja a klímát is nyáron
        totalPrice: body.totalPrice,
        paymentMethod: body.paymentMethod,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        apartmentId: (Number(body.adults) + Number(body.children)) > 3 ? 3 : 1,
        status: 'PENDING',
      },
    });

    // Értesítés küldése neked
    await sendNotificationToAdmin(newBooking);

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("Mentési hiba:", error);
    return NextResponse.json({ error: 'Hiba a mentés során' }, { status: 500 });
  }
}