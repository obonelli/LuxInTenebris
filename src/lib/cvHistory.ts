import { prisma } from './prisma';

export type SaveCVHistoryInput = {
    userId: string;
    summary?: string | null;
    motivationalClose?: string | null;
    rawText: string;
    source?: string | null;
};

export async function saveCVHistory(input: SaveCVHistoryInput) {
    const { userId, summary, motivationalClose, rawText, source } = input;
    return prisma.cVHistory.create({
        data: {
            userId,
            summary: summary ?? null,
            motivationalClose: motivationalClose ?? null,
            rawText,
            source: source ?? 'analyze.v1',
        },
    });
}

export async function listCVHistory(userId: string, limit = 50) {
    return prisma.cVHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}
