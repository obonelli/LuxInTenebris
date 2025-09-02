// prisma/seed.ts
import { PrismaClient, Seniority, WorkingScheme, EnglishLevel } from '@prisma/client';

const prisma = new PrismaClient();

const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function upsertTech(name: string) {
    const slug = slugify(name);
    return prisma.technology.upsert({
        where: { name },
        update: { slug },
        create: { name, slug },
    });
}

async function ensureTechs(names: string[]) {
    const uniques = Array.from(new Set(names));
    const techs = await Promise.all(uniques.map(upsertTech));
    return techs.map((t) => ({ technologyId: t.id }));
}

async function main() {
    /* =======================
       FORCED CLEANING
       ======================= */
    await prisma.jobPosition.deleteMany({});

    /* ========= 1) Sr Fullstack Developer — NebulaWorks ========= */
    const techsNebula = await ensureTechs([
        'IAM',
        '.NET',
        'TypeScript',
        'React',
        'Auth0',
        'Keycloak',
        'Okta',
        'Azure AD',
        'OAuth 2.0',
        'OpenID Connect',
        'MFA',
        'RBAC',
        'Node.js',
        'SQL Server',
        'NoSQL',
        'Microservices',
    ]);

    await prisma.jobPosition.upsert({
        where: { id: 'seed-nebula-sr-fullstack' },
        update: {},
        create: {
            id: 'seed-nebula-sr-fullstack',
            title: 'Sr Fullstack Developer',
            provider: 'NebulaWorks',
            location: 'LATAM',
            workingScheme: WorkingScheme.REMOTE,
            seniority: Seniority.SENIOR,
            englishLevel: EnglishLevel.C1,
            currency: 'USD',
            salaryMin: 5500,
            salaryMax: 5500,
            isActive: true,
            description: `
**Company**: NebulaWorks  
**Job Type**: Full-Time  
**Salary**: $5,500 USD  
**Experience**: 7–8 years

## Overview
Ownership de una suite de aplicaciones para clientes internos/externos.

## Must Have
IAM (Auth0/Keycloak/Okta/Azure AD), OAuth 2.0, OIDC, MFA, RBAC, React + TypeScript, .NET/C#.
      `.trim(),
            technologies: { create: techsNebula },
        },
    });

    /* ========= 2) Mid React Developer — Orion Talent ========= */
    const techsOrion = await ensureTechs(['React', 'TypeScript', 'MUI']);

    await prisma.jobPosition.upsert({
        where: { id: 'seed-orion-mid-react' },
        update: {},
        create: {
            id: 'seed-orion-mid-react',
            title: 'Mid React Developer',
            provider: 'Orion Talent',
            location: 'Mexico City',
            workingScheme: WorkingScheme.HYBRID,
            seniority: Seniority.MID,
            englishLevel: EnglishLevel.B2,
            currency: 'USD',
            salaryMin: 3000,
            salaryMax: 4000,
            isActive: true,
            description: `
**Company**: Orion Talent  
**Job Type**: Full-Time  
**Salary (USD)**: $3,000–$4,000

## Overview
Construcción de UI modernas con React + MUI en equipo híbrido.
      `.trim(),
            technologies: { create: techsOrion },
        },
    });

    /* ========= 3) Backend Engineer — LunarSoft ========= */
    const techsLunar = await ensureTechs([
        'Node.js',
        'NestJS',
        'PostgreSQL',
        'Docker',
        'AWS',
        'TypeScript',
        'Redis',
        'REST',
        'GraphQL',
    ]);

    await prisma.jobPosition.upsert({
        where: { id: 'seed-lunar-backend' },
        update: {},
        create: {
            id: 'seed-lunar-backend',
            title: 'Backend Engineer',
            provider: 'LunarSoft',
            location: 'Remote',
            workingScheme: WorkingScheme.REMOTE,
            seniority: Seniority.MID,
            englishLevel: EnglishLevel.B2,
            currency: 'USD',
            salaryMin: 4500,
            salaryMax: 6000,
            isActive: true,
            description: `
**Company**: LunarSoft  
**Job Type**: Full-Time

## Overview
Servicios de backend escalables con Node.js/NestJS sobre AWS.

## Must Have
Node.js, NestJS, PostgreSQL, Docker, AWS, TypeScript, cachés (Redis), APIs REST/GraphQL.
      `.trim(),
            technologies: { create: techsLunar },
        },
    });

    /* ========= 4) DevOps Engineer — Atlas Systems ========= */
    const techsAtlas = await ensureTechs([
        'AWS',
        'Terraform',
        'Kubernetes',
        'Helm',
        'CI/CD',
        'GitHub Actions',
        'Prometheus',
        'Grafana',
        'Linux',
        'Docker',
    ]);

    await prisma.jobPosition.upsert({
        where: { id: 'seed-atlas-devops' },
        update: {},
        create: {
            id: 'seed-atlas-devops',
            title: 'DevOps Engineer',
            provider: 'Atlas Systems',
            location: 'Remote (Americas)',
            workingScheme: WorkingScheme.REMOTE,
            seniority: Seniority.SENIOR,
            englishLevel: EnglishLevel.C1,
            currency: 'USD',
            salaryMin: 6000,
            salaryMax: 7000,
            isActive: true,
            description: `
**Company**: Atlas Systems

## Overview
Plataformas en AWS con IaC, despliegues y observabilidad end-to-end.

## Must Have
Terraform, Kubernetes/Helm, CI/CD (GitHub Actions), Docker, monitoreo (Prometheus/Grafana).
      `.trim(),
            technologies: { create: techsAtlas },
        },
    });

    /* ========= 5) Mobile Engineer (React Native) — QuantumTech ========= */
    const techsQuantum = await ensureTechs([
        'React Native',
        'TypeScript',
        'GraphQL',
        'Expo',
        'iOS',
        'Android',
        'Jest',
    ]);

    await prisma.jobPosition.upsert({
        where: { id: 'seed-quantum-mobile' },
        update: {},
        create: {
            id: 'seed-quantum-mobile',
            title: 'Mobile Engineer (React Native)',
            provider: 'QuantumTech',
            location: 'Buenos Aires',
            workingScheme: WorkingScheme.HYBRID,
            seniority: Seniority.MID,
            englishLevel: EnglishLevel.B2,
            currency: 'USD',
            salaryMin: 3500,
            salaryMax: 5000,
            isActive: true,
            description: `
**Company**: QuantumTech

## Overview
Apps móviles cross-platform con React Native + GraphQL.

## Must Have
React Native, TypeScript, GraphQL, testing (Jest), publicación iOS/Android.
      `.trim(),
            technologies: { create: techsQuantum },
        },
    });

    /* ========= 6) Data Engineer — NovaData ========= */
    const techsNova = await ensureTechs([
        'Python',
        'Apache Spark',
        'Airflow',
        'GCP',
        'BigQuery',
        'Dataflow',
        'dbt',
    ]);

    await prisma.jobPosition.upsert({
        where: { id: 'seed-novadata-data-eng' },
        update: {},
        create: {
            id: 'seed-novadata-data-eng',
            title: 'Data Engineer',
            provider: 'NovaData',
            location: 'São Paulo',
            workingScheme: WorkingScheme.ONSITE,
            seniority: Seniority.SENIOR,
            englishLevel: EnglishLevel.B2,
            currency: 'USD',
            salaryMin: 6000,
            salaryMax: 8000,
            isActive: true,
            description: `
**Company**: NovaData

## Overview
Pipelines batch/streaming en GCP (BigQuery, Dataflow) con Airflow y Spark.

## Must Have
Python, Spark, Airflow, GCP/BigQuery, modelado de datos, orquestación y dbt.
      `.trim(),
            technologies: { create: techsNova },
        },
    });

    console.log('✅ Seed completado: 6 ofertas creadas y limpieza aplicada.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
