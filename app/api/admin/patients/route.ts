import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
    },
  });
  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const newPatient = await prisma.patient.create({
    data: {
      name,
      userId: user.id,
    },
  });

  return NextResponse.json(newPatient, { status: 201 });
}
