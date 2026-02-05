import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConfirmationToGuest } from '@/lib/mail'; // Beimportáljuk a másik függvényedet

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json(); // Itt jön pl: { status: 'CONFIRMED' }
    
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: body,
    });

    // HA AZ ADMIN ELFOGADTA, MEGY A VENDÉGNEK A VISSZAIGAZOLÁS
    if (body.status === 'CONFIRMED') {
      await sendConfirmationToGuest(updatedBooking);
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Hiba a frissítéskor' }, { status: 500 });
  }
}