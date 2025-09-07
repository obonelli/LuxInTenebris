import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return new NextResponse('Missing id', { status: 400 });
    }

    const item = await prisma.cVHistory.findFirst({
        where: { id, userId: session.user.id as string },
    });

    if (!item) {
        return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(item.rawText, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename=cv-feedback-${item.createdAt.toISOString()}.txt`,
        },
    });
}
