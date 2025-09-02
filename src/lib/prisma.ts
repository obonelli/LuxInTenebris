// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
    // Evita múltiples instancias en dev (HMR)
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const prisma =
    globalThis.prisma ??
    new PrismaClient({
        log: ['warn', 'error'],
    });

// En desarrollo reutiliza la instancia en el espacio global
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
