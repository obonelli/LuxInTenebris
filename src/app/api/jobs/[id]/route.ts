import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, ctx: { params: { id: string } }) {
    const job = await prisma.jobPosition.findUnique({
        where: { id: ctx.params.id },
        include: { technologies: { include: { technology: true } } },
    });
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
        id: job.id,
        title: job.title,
        description: job.description,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        seniority: job.seniority,
        workingScheme: job.workingScheme,
        englishLevel: job.englishLevel,
        location: job.location,
        provider: job.provider,
        technologies: job.technologies.map(t => ({ id: t.technologyId, name: t.technology.name, slug: t.technology.slug })),
        createdAt: job.createdAt,
    });
}
