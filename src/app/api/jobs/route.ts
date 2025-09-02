import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma, Seniority, WorkingScheme, EnglishLevel } from '@prisma/client';

export async function GET(req: Request) {
    const url = new URL(req.url);

    const search = url.searchParams.get('q')?.trim() ?? '';
    const seniority = url.searchParams.get('seniority') ?? undefined;
    const scheme = url.searchParams.get('scheme') ?? undefined;
    const english = url.searchParams.get('english') ?? undefined;
    const location = url.searchParams.get('location') ?? undefined;
    const tech = url.searchParams.getAll('tech'); // ?tech=react&tech=typescript

    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || '10')));

    const where: Prisma.JobPositionWhereInput = {
        isActive: true,
        ...(search && { title: { contains: search } }),             // sin 'mode'
        ...(seniority && { seniority: seniority as Seniority }),
        ...(scheme && { workingScheme: scheme as WorkingScheme }),
        ...(english && { englishLevel: english as EnglishLevel }),
        ...(location && { location: { contains: location } }),         // sin 'mode'
        ...(tech.length
            ? { technologies: { some: { technology: { slug: { in: tech } } } } }
            : {}),
    };

    const [total, data] = await Promise.all([
        prisma.jobPosition.count({ where }),
        prisma.jobPosition.findMany({
            where,
            include: { technologies: { include: { technology: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
    ]);

    const mapped = data.map((j) => ({
        id: j.id,
        title: j.title,
        description: j.description,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        currency: j.currency,
        seniority: j.seniority,
        workingScheme: j.workingScheme,
        englishLevel: j.englishLevel,
        location: j.location,
        provider: j.provider,
        technologies: j.technologies.map((t) => ({
            id: t.technologyId,
            name: t.technology.name,
            slug: t.technology.slug,
        })),
    }));

    return NextResponse.json({
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        data: mapped,
    });
}

// Crear vacante sencilla (para admin). Protege este endpoint con tu auth.
export async function POST(req: Request) {
    const body = await req.json();
    const {
        title, description, salaryMin, salaryMax, currency = 'USD',
        seniority, workingScheme, englishLevel, location, provider,
        technologies = [] as string[], isActive = true,
    } = body ?? {};

    if (!title || !description || !seniority || !workingScheme) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // upsert de tecnologías por slug
    const techRecords = await Promise.all(
        technologies.map((slug: string) =>
            prisma.technology.upsert({
                where: { slug },
                update: {},
                create: { slug, name: slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
            })
        )
    );

    const job = await prisma.jobPosition.create({
        data: {
            title,
            description,
            currency,
            seniority: seniority as Seniority,
            workingScheme: workingScheme as WorkingScheme,
            englishLevel: (englishLevel as EnglishLevel) ?? null,
            location,
            provider,
            isActive,
            salaryMin: salaryMin ?? null,
            salaryMax: salaryMax ?? null,
            technologies: { create: techRecords.map(t => ({ technologyId: t.id })) },
        },
        include: { technologies: { include: { technology: true } } },
    });

    return NextResponse.json(job, { status: 201 });
}
