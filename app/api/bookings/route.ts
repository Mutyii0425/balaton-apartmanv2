import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNotificationToAdmin } from '@/lib/mail'; // Beimportáljuk a függvényedet

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
        needsHeating: body.needsHeating,
        totalPrice: body.totalPrice,
        paymentMethod: body.paymentMethod,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        apartmentId: body.adults + body.children > 3 ? 3 : 1,
        status: 'PENDING',
      },
    });


    await sendNotificationToAdmin(newBooking);

    return NextResponse.json(newBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Hiba a mentés során' }, { status: 500 });
  }
}