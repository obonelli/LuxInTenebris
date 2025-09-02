'use client';

import { Card, CardContent, Typography, Divider, Stack, Box } from '@mui/material';
import Grid from '@mui/material/Grid'; // ← igual que tu Footer (API con `size`)
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = { description: string };

// Separa el markdown en secciones por encabezado "## ..."
function splitSections(md: string) {
    const lines = md.split('\n');
    const sections: Record<string, string[]> = {};
    let current = 'Summary';
    sections[current] = [];

    for (const line of lines) {
        const m = line.match(/^##\s+(.+?)\s*$/);
        if (m) {
            current = m[1].trim();
            if (!sections[current]) sections[current] = [];
            continue;
        }
        sections[current].push(line);
    }
    return Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.join('\n').trim()]));
}

// Extrae "**Label**: Valor" del bloque Summary
function parseFacts(md: string) {
    const out: { label: string; value: string }[] = [];
    const rx = /^\*\*(.+?)\*\*:\s*(.+)\s*$/;
    for (const raw of md.split('\n')) {
        const m = raw.match(rx);
        if (m) out.push({ label: m[1], value: m[2] });
    }
    return out;
}

function FactsCard({ content }: { content: string }) {
    const facts = parseFacts(content);
    if (!facts.length) return null;

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>Description</Typography>
                <Divider sx={{ mb: 2, opacity: 0.15 }} />
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {facts.map((f) => (
                        <Grid key={f.label} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Stack spacing={0.5}>
                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                    {f.label}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {f.value}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}

function SectionCard({ title, content }: { title: string; content: string }) {
    if (!content?.trim()) return null;
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Divider sx={{ mb: 2, opacity: 0.15 }} />
                <Box sx={{ '& ul': { mt: 0 } }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function JobOverviewCards({ description }: Props) {
    const sections = splitSections(description);

    // Orden recomendado; lo que no esté aquí cae al final.
    const ORDER = [
        'Summary',
        'Job Overview',
        'Responsibilities',
        'Qualifications — Must have',
        'Must have',
        'Nice to have',
        'Additional Information',
        'About the Company',
        'Interview Stages',
    ];

    const entries: [string, string][] = ORDER
        .flatMap((k) => (sections[k] ? [[k, sections[k]] as [string, string]] : []))
        .concat(Object.entries(sections).filter(([k]) => !ORDER.includes(k)));

    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            {entries.map(([title, content]) =>
                title === 'Summary' ? (
                    <Grid key={title} size={{ xs: 12 }}>
                        <FactsCard content={content} />
                    </Grid>
                ) : (
                    <Grid key={title} size={{ xs: 12 }}>
                        <SectionCard title={title} content={content} />
                    </Grid>
                )
            )}
        </Grid>
    );
}
