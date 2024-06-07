import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const clinics = await prisma.clinic.findMany();
    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json({ clinics, doctors });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching data' },
      { status: 500 }
    );
  }
}
