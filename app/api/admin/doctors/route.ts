import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
    },
  });
  return NextResponse.json(doctors);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, location, email, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const newDoctor = await prisma.doctor.create({
    data: {
      name,
      location,
      userId: user.id,
    },
  });

  return NextResponse.json(newDoctor, { status: 201 });
}
