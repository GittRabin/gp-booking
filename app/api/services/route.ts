import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const services = await prisma.clinic.findMany();

  return NextResponse.json(services);
}
