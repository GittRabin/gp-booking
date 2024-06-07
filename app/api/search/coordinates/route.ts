import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and Longitude are required' },
      { status: 400 }
    );
  }

  try {
    const clinics = await prisma.clinic.findMany({
      where: {
        // Assuming you have lat and lon columns in your clinics table
        // This is a placeholder logic, you need to adjust based on your actual schema and requirements
        location: {
          contains: `${lat},${lon}`,
        },
      },
    });

    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
      },
      where: {
        location: {
          contains: `${lat},${lon}`,
        },
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
