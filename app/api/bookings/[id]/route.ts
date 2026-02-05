import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConfirmationToGuest } from '@/lib/mail';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15+ kompatibilis
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const bookingId = parseInt(id);

    // Régi adat lekérése, hogy tudjuk, most változott-e a státusz
    const oldBooking = await prisma.booking.findUnique({ where: { id: bookingId } });

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: body,
    });

    // Ha a státusz PENDING-ről CONFIRMED-re váltott, küldünk emailt a vendégnek
    if (oldBooking?.status === 'PENDING' && body.status === 'CONFIRMED') {
      await sendConfirmationToGuest(updatedBooking);
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("PATCH hiba:", error);
    return NextResponse.json({ error: 'Hiba a frissítéskor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.booking.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Foglalás törölve' });
  } catch (error) {
    return NextResponse.json({ error: 'Hiba a törléskor' }, { status: 500 });
  }
}