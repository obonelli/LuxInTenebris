import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { listCVHistory, saveCVHistory } from '@/lib/cvHistory';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await listCVHistory(session.user.id as string);
    return NextResponse.json({ items });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { summary, motivationalClose, rawText, source } = body ?? {};
    if (!rawText || typeof rawText !== 'string') {
        return NextResponse.json({ error: 'rawText is required' }, { status: 400 });
    }

    const item = await saveCVHistory({
        userId: session.user.id as string,
        summary: summary ?? null,
        motivationalClose: motivationalClose ?? null,
        rawText,
        source: source ?? 'api',
    });

    return NextResponse.json({ item }, { status: 201 });
}
