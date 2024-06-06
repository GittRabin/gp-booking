import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const clinics = await prisma.clinic.findMany({});
  return NextResponse.json(clinics);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, location } = body;

  const newClinic = await prisma.clinic.create({
    data: {
      name,
      location,
    },
  });

  return NextResponse.json(newClinic, { status: 201 });
}
