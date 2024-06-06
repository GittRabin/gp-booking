import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roles } = session.user;

  // if the user role is  { isDoctor: false, isPatient: true, isAdmin: false }
  if (roles.isPatient) {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: session.user.id,
      },
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

  if (roles.isDoctor) {
    const appointments = await prisma.doctorAppointment.findMany({
      where: {
        doctorId: session.user.id,
      },
      include: {
        doctor: true,
        appointment: true,
      },
    });

    // process this data to match the structure of the patient's appointments to provide as above get request for patient

    return NextResponse.json(appointments);
  }

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
      status: 'PENDING',
      doctors: {
        create: { doctorId },
      },
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, date, time } = body;

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      date: new Date(date),
      time,
      status: 'PENDING',
    },
  });

  return NextResponse.json(updatedAppointment, { status: 200 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      status,
    },
  });

  return NextResponse.json(updatedAppointment, { status: 200 });
}
