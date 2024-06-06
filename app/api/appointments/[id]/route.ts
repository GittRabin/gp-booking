import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: true,
    },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { doctorId, date, time } = body;

  const newAppointment = await prisma.appointment.create({
    data: {
      doctorId,
      date: new Date(date),
      time,
      patientId: '1', // Replace with the actual patient ID
      clinicId: '1', // Replace with the actual clinic ID
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}
