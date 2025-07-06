// src/lib/auth-options.ts
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    debug: false,
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            console.log('>>> SESSION CALLBACK');
            console.log('Session:', session);
            console.log('Token:', token);

            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
};
