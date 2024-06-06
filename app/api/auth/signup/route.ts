// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();

  // check if password is empty then throw error
  if (!password) {
    return NextResponse.json(
      { error: 'Password is required' },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }

  switch (role) {
    case 'doctor':
      await prisma.doctor.create({
        data: {
          name,
          userId: user.id,
          location: 'Sydney',
        },
      });
      break;

    case 'admin':
      await prisma.admin.create({
        data: {
          userId: user.id,
        },
      });
      break;
    default:
      await prisma.patient.create({
        data: {
          name,
          userId: user.id,
        },
      });
  }

  return NextResponse.json(user, { status: 201 });
}
