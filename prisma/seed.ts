// prisma/seed.ts
import {
    PrismaClient,
    Seniority,
    WorkingScheme,
    EnglishLevel,
} from '@prisma/client';

const prisma = new PrismaClient();

const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function upsertTech(name: string) {
    const slug = slugify(name);
    return prisma.technology.upsert({
        where: { name },          // ← usar name evita el P2002
        update: { slug },         // si existe, solo refresca el slug
        create: { name, slug },
    });
}

async function ensureTechs(names: string[]) {
    const uniques = Array.from(new Set(names)); // evita duplicados
    const techs = await Promise.all(uniques.map(upsertTech));
    return techs.map((t) => ({ technologyId: t.id }));
}

async function main() {
    // ========= Sr Fullstack Developer (Ryscode) =========
    const seniorTechs = await ensureTechs([
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
        where: { id: 'seed-rys-sr-fullstack' },
        update: {},
        create: {
            id: 'seed-rys-sr-fullstack',
            title: 'Sr Fullstack Developer',
            provider: 'Ryscode',
            location: 'LATAM',
            workingScheme: WorkingScheme.REMOTE,
            seniority: Seniority.SENIOR,
            englishLevel: EnglishLevel.C1,
            currency: 'USD',
            salaryMin: 5500,
            salaryMax: 5500,
            isActive: true,
            description: `
**Company**: Ryscode  
**Salary**: $5,500 USD  
**Link**: https://www.ryscode.com.mx/  
**Job Type**: Full-Time  
**Contract Term**: fixed-term  
**Years of Experience**: 7–8 years

## Job Overview
Sr. Full Stack Engineer to work with the team to create a suite of applications and tools for internal and external customers.

## Responsibilities
- Implement authentication and authorization using IAM platforms (Auth0, KeyCloak, Okta, Azure AD).
- Integrate apps with OAuth 2.0, OpenID Connect y otros protocolos de identidad.
- Desarrollar y mantener flujos de usuario seguros: registro, login, password reset, MFA.
- Aplicar RBAC y permisos granulares.
- Código limpio, testeable, seguro y escalable.

## Qualifications — Must have
- IAM con Auth0/KeyCloak/Okta/Azure AD.
- OAuth 2.0, OpenID Connect.
- User management (registro, login, reset, MFA).
- RBAC.
- 10+ años en web apps (fullstack).
- TypeScript/JavaScript; React o Vue.
- REST con .NET/C# (preferido).

## Nice to have
- .NET Core / .NET 5/6.
- SQL Server y NoSQL.
- Unit tests fullstack.
- Pipelines modernas (Babel, Webpack, NPM).
- Responsive, Node.js, microservicios.
- Git, VS Code/Visual Studio, Scrum/Agile.

## About the Company
Recruitment Agency Specialized in IT and Digital Marketing.

## Interview Stages
HR → Technical Interview → Technical Assessment → Offer.
      `.trim(),
            technologies: { create: seniorTechs },
        },
    });

    // ========= Mid React Developer (Ryscode) =========
    const midTechs = await ensureTechs(['React', 'TypeScript', 'MUI']);

    await prisma.jobPosition.upsert({
        where: { id: 'seed-rys-mid-react' },
        update: {},
        create: {
            id: 'seed-rys-mid-react',
            title: 'Mid React Developer',
            provider: 'Ryscode',
            location: 'Mexico City',
            workingScheme: WorkingScheme.HYBRID,
            seniority: Seniority.MID,
            englishLevel: EnglishLevel.B2,
            currency: 'USD',
            salaryMin: 3000,
            salaryMax: 4000,
            isActive: true,
            description: `
**Job Type**: Full-Time  
**English Level**: B2  
**Salary (USD)**: $3,000–$4,000

## Job Overview
Work on modern UI with MUI and React.

## Must Have
- React, TypeScript.
- MUI (Material UI).
      `.trim(),
            technologies: { create: midTechs },
        },
    });

    console.log('✅ Seed completado');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
