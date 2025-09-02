export type Feature = {
    key: 'matching' | 'pool' | 'screening';
    title: string;
    copy: string;
    bullets: string[];
    rightImg: { src: string; alt: string };
    kpis: { value: string; label: string }[];
};

export const FEATURES: Feature[] = [
    {
        key: 'matching',
        title: 'SMART MATCHING',
        copy:
            'AI + experts conectan tu perfil con oportunidades que encajan de verdad — sin pérdida de tiempo.',
        bullets: ['97% match accuracy', '2× faster hires', 'Data‑driven decisions'],
        rightImg: { src: '/illustrations/robot.png', alt: 'AI hand' },
        kpis: [
            { value: '97%', label: 'Match Accuracy' },
            { value: '2×', label: 'Faster Matches' },
            { value: '100%', label: 'Data‑Driven' },
        ],
    },
    {
        key: 'pool',
        title: 'GLOBAL TALENT POOL',
        copy:
            'Acceso curado a talento LATAM + global, con filtros inteligentes por stack, seniority y cultura.',
        bullets: ['Curated sourcing', 'Culture fit signals', 'Time‑zone aligned'],
        rightImg: { src: '/illustrations/world-grid.png', alt: 'Global network' },
        kpis: [
            { value: '15k+', label: 'Profiles' },
            { value: '48h', label: 'Avg. Intro' },
            { value: '90%', label: 'Offer Acceptance' },
        ],
    },
    {
        key: 'screening',
        title: 'TECHNICAL SCREENING',
        copy:
            'Evaluaciones técnicas y de soft skills asistidas por IA, listas antes de la entrevista.',
        bullets: ['Live & async tests', 'Soft‑skills signals', 'Bias‑reduced flow'],
        rightImg: { src: '/illustrations/terminal-hud.png', alt: 'Code HUD' },
        kpis: [
            { value: '70%', label: 'Less Bias' },
            { value: '3×', label: 'Faster Screening' },
            { value: 'A/B', label: 'Benchmarked' },
        ],
    },
];
