import type { DefaultSession } from 'next-auth';
import type { UserRole } from '@prisma/client';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: UserRole;  // enum de Prisma
        } & DefaultSession['user']; // name | email | image
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string
        role?: UserRole;
    }
}
