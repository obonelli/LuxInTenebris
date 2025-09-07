// src/app/analyze/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';        // ← cambio clave
import { saveCVHistory } from '@/lib/cvHistory';

type AnalyzeResult = {
    summary: string;
    motivationalClose?: string;
    fullText: string;
};

async function runAnalysis(payload: any): Promise<AnalyzeResult> {
    const summary = payload?.summary ?? 'Key improvements...';
    const motivationalClose = payload?.motivationalClose ?? 'Keep pushing forward.';
    const fullText = `• Summary: ${summary}\n\nMotivational Close:\n${motivationalClose}`;
    return { summary, motivationalClose, fullText };
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const result = await runAnalysis(payload);

    await saveCVHistory({
        userId: session.user.id as string,
        summary: result.summary,
        motivationalClose: result.motivationalClose ?? null,
        rawText: result.fullText,
        source: 'analyze.v1',
    });

    return NextResponse.json(result, { status: 200 });
}
