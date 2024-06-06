import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctors: {
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { doctorId, date, time, patientId, clinicId } = body;

  const newAppointment = await prisma.appointment.create({
    data: {
      patientId,
      date: new Date(date),
      time,
      clinicId,
    },
  });

  // Now will store in the doctor appointable table
  await prisma.doctorAppointment.create({
    data: {
      appointmentId: newAppointment.id,
      doctorId,
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}
