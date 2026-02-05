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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: body,
    });

    // HA JÓVÁHAGYOD (Státusz CONFIRMED lesz)
    if (body.status === 'CONFIRMED') {
      await transporter.sendMail({
        from: `"Hegyvidéki Apartman" <${process.env.EMAIL_USER}>`,
        to: updatedBooking.email,
        subject: 'FOGLALÁS VISSZAIGAZOLVA!',
        html: `<h1>Gratulálunk!</h1><p>A(z) ${new Date(updatedBooking.startDate).toLocaleDateString()} napra vonatkozó foglalását jóváhagytuk. Várjuk Önöket szeretettel!</p>`,
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Hiba' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.booking.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: 'Törölve' });
  } catch (error) {
    return NextResponse.json({ error: 'Hiba' }, { status: 500 });
  }
}