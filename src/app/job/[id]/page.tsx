'use client';

import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import GridMUI from '@mui/material/Grid'; // opcional: alias si prefieres
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type JobDetail = {
    id: string;
    title: string;
    description: string;
    salaryMin: number | null;
    salaryMax: number | null;
    currency: string;
    seniority: string;
    workingScheme: string;
    englishLevel?: string | null;
    location?: string | null;
    provider?: string | null;
    technologies: { id: number; name: string; slug: string }[];
    createdAt?: string;
};

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [job, setJob] = useState<JobDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (!res.ok) throw new Error('Not found');
                const data = (await res.json()) as JobDetail;
                if (alive) setJob(data);
            } catch (e: any) {
                if (alive) setErr(e?.message ?? 'Error loading job');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, color: 'rgba(235,235,255,0.8)' }}>Loading…</Typography>
            </Container>
        );
    }

    if (err || !job) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                    {err ?? 'Job not found'}
                </Typography>
                <Button onClick={() => router.replace('/job-positions-list')} variant="outlined">
                    Back to Open Roles
                </Button>
            </Container>
        );
    }

    const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);

    return (
        <Box sx={{ background: 'linear-gradient(180deg, #0B0C10, #0E1016)', minHeight: '100dvh', py: 6 }}>
            <Container maxWidth="lg">
                <Button onClick={() => router.back()} sx={{ mb: 2 }}>
                    ← Back
                </Button>

                {/* Header + chips */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: '#121420',
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#E6E7FF', mb: 1 }}>
                                {job.title}
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                {job.provider && (
                                    <Chip
                                        label={job.provider}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(124,77,255,.12)', color: 'primary.main' }}
                                    />
                                )}
                                {job.technologies.map((t) => (
                                    <Chip key={t.id} size="small" label={t.name} />
                                ))}
                            </Stack>
                        </Box>

                        {/* CTA: pide login para aplicar */}
                        <Button component={Link} href={`/api/auth/signin?callbackUrl=/job/${job.id}`} variant="contained">
                            Sign in to Apply
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {/* Job Details usando Grid v7 (como en tu Footer) */}
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                        Job Details
                    </Typography>

                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <LabelValue label="Location" value={job.location || '—'} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <LabelValue label="Work Scheme" value={job.workingScheme} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <LabelValue label="Seniority" value={job.seniority} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <LabelValue label="English Level" value={job.englishLevel || '—'} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <LabelValue label="Salary (USD)" value={salary} />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Overview / Description con acordeón */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: '#121420',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                        Job Overview
                    </Typography>

                    <Accordion defaultExpanded disableGutters sx={{ background: 'transparent' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 700 }}>Description</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ whiteSpace: 'pre-wrap', opacity: 0.95 }}>
                                {job.description}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Container>
        </Box>
    );
}

function LabelValue({ label, value }: { label: string; value: string }) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.08)',
                background:
                    'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
                height: '100%',
            }}
        >
            <Typography variant="subtitle2" sx={{ color: 'rgba(235,235,255,0.7)' }}>
                {label}
            </Typography>
            <Typography sx={{ color: 'rgba(235,235,255,0.95)', fontWeight: 700 }}>{value}</Typography>
        </Box>
    );
}

function formatSalary(min: number | null, max: number | null, currency: string) {
    if (!min && !max) return '—';
    const fmt = (n: number) => n.toLocaleString();
    if (min && max) return `$${fmt(min)}–$${fmt(max)} ${currency}`;
    if (min) return `From $${fmt(min)} ${currency}`;
    return `Up to $${fmt(max!)} ${currency}`;
}
