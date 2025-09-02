'use client';

import { useRouter } from 'next/navigation';
import {
    Box,
    Chip,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid'; // 👈 igual que en el Footer (API v7)

export type ListJob = {
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
};

export default function JobCard({ job }: { job: ListJob }) {
    const router = useRouter();

    const salary =
        job.salaryMin || job.salaryMax
            ? `${job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : ''}${job.salaryMin && job.salaryMax ? '–' : ''
            }${job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : ''} ${job.currency}`
            : '—';

    return (
        <Paper
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/job/${job.id}`)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && router.push(`/job/${job.id}`)}
            sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                backgroundColor: '#12131a',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'transform .12s ease, box-shadow .12s ease, border-color .12s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,.35)',
                    borderColor: 'rgba(124,77,255,0.45)',
                },
                outline: 'none',
                '&:focus-visible': {
                    boxShadow: '0 0 0 3px rgba(124,77,255,0.45)',
                },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {job.title}
                </Typography>
                {job.provider && (
                    <Chip
                        size="small"
                        label={job.provider}
                        sx={{ bgcolor: 'rgba(124,77,255,.12)', color: 'primary.main' }}
                    />
                )}
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                {job.technologies.map((t) => (
                    <Chip key={t.id} size="small" label={t.name} />
                ))}
            </Stack>

            {/* 👇 Grid v7: hijos usan `size={{ ... }}` en lugar de `item xs sm md` */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Salary (USD)
                    </Typography>
                    <Box sx={{ fontWeight: 700 }}>{salary}</Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Seniority
                    </Typography>
                    <Box sx={{ fontWeight: 700 }}>{job.seniority}</Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Working Scheme
                    </Typography>
                    <Box sx={{ fontWeight: 700 }}>{job.workingScheme}</Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        English Level
                    </Typography>
                    <Box sx={{ fontWeight: 700 }}>{job.englishLevel || '—'}</Box>
                </Grid>

                {job.location && (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            Location
                        </Typography>
                        <Box sx={{ fontWeight: 700 }}>{job.location}</Box>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
}
