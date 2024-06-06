import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, User, Doctor, Patient, Admin } from '@prisma/client';

const prisma = new PrismaClient();

type UserWithRoles = Omit<User, 'email'> & {
  email: string;
  name: string;
  doctor?: Doctor | null;
  patient?: Patient | null;
  admin?: Admin | null;
  roles: {
    isDoctor: boolean;
    isPatient: boolean;
    isAdmin: boolean;
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            doctor: true,
            patient: true,
            admin: true,
          },
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          const userWithRoles: UserWithRoles = {
            ...user,
            email: user.email || '',
            roles: {
              isDoctor: !!user.doctor,
              isPatient: !!user.patient,
              isAdmin: !!user.admin,
            },
          };
          return userWithRoles;
        }
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          roles: {
            isDoctor: !!token.isDoctor,
            isPatient: !!token.isPatient,
            isAdmin: !!token.isAdmin,
          },
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.isDoctor = !!user.doctor;
        token.isPatient = !!user.patient;
        token.isAdmin = !!user.admin;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
