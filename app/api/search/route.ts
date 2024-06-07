import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service');
    const location = searchParams.get('location');

    let clinics;

    if (service || location) {
      clinics = await prisma.clinic.findMany({
        where: {
          AND: [
            location ? { location: { contains: location } } : {},
            service
              ? {
                  doctors: {
                    some: {
                      doctor: {
                        name: { contains: service },
                      },
                    },
                  },
                }
              : {},
          ],
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
        },
      });
    } else {
      clinics = await prisma.clinic.findMany({
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
    }

    return NextResponse.json({ clinics });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while fetching data' },
      { status: 500 }
    );
  }
}
