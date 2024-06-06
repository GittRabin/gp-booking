// types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      roles: {
        isDoctor: boolean;
        isPatient: boolean;
        isAdmin: boolean;
      };
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    roles: {
      isDoctor: boolean;
      isPatient: boolean;
      isAdmin: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isDoctor: boolean;
    isPatient: boolean;
    isAdmin: boolean;
  }
}
