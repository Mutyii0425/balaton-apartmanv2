import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// NAPTÁR BETÖLTÉSE (Ezt hívja a naptár oldal)
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Lekérési hiba:", error);
    return NextResponse.json({ error: 'Nem sikerült betölteni a naptárat' }, { status: 500 });
  }
}

// ÚJ FOGLALÁS MENTÉSE (Ezt hívja a foglalási gomb)
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
    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("Mentési hiba:", error);
    return NextResponse.json({ error: 'Hiba a mentés során' }, { status: 500 });
  }
}