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
      clinic: true,
    },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { patientId, clinicId, date, time, doctorId } = body;

  const newAppointment = await prisma.appointment.create({
    data: {
      patientId,
      clinicId,
      date: new Date(date),
      time,
      doctors: {
        create: { doctorId },
      },
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { date, time } = body;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || body.id;

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      date: new Date(date),
      time,
    },
  });

  return NextResponse.json(updatedAppointment, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Appointment ID is required' },
      { status: 400 }
    );
  }

  await prisma.appointment.delete({
    where: { id },
  });

  return NextResponse.json(
    { message: 'Appointment deleted successfully' },
    { status: 200 }
  );
}
