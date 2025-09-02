// src/lib/auth-options.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Tipo que funciona en Prisma v4 y v5
type Role = (typeof UserRole)[keyof typeof UserRole];

export const authOptions: NextAuthOptions = {
    debug: false,
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId:
                process.env.GOOGLE_ID ||
                process.env.GOOGLE_CLIENT_ID ||
                '',
            clientSecret:
                process.env.GOOGLE_SECRET ||
                process.env.GOOGLE_CLIENT_SECRET ||
                '',
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user?.id) {
                token.id = user.id;
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true },
                });
                token.role = (dbUser?.role as Role) ?? UserRole.CANDIDATE;
            } else if ((!token.id || !token.role) && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                    select: { id: true, role: true },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role as Role;
                }
            }

            if (trigger === 'update' && session?.user?.role) {
                token.role = session.user.role as Role;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = (token.id as string) ?? session.user.id!;
                session.user.role = (token.role as Role) ?? UserRole.CANDIDATE;
            }
            return session;
        },
    },
};
