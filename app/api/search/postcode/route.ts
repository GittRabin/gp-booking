import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('postcode');

  if (!term) {
    return NextResponse.json(
      { error: 'Postcode is required' },
      { status: 400 }
    );
  }

  try {
    const clinics = await prisma.clinic.findMany({
      where: {
        OR: [
          { location: { contains: term } },
          { postcode: { contains: term } },
        ],
      },
    });

    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
      },
      where: {
        OR: [
          {
            location: {
              contains: term,
            },
          },
          {
            postcode: {
              contains: term,
            },
          },
        ],
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
