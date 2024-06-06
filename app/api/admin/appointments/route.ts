import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
      patient: true,
      clinic: true,
    },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { doctorId, patientId, clinicId, date, time } = body;

  const newAppointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId,
      clinicId,
      date: new Date(date),
      time,
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}
