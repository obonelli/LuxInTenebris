'use client';

import { Box, Chip, Link, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, PROVIDER_COLORS } from './types';
import { toAlpha } from './utils';
import { HardDivider } from './HardDivider';
import { TechPill } from './TechPill';

export function JobCard({ job }: { job: Job }) {
    const router = useRouter();
    const accent = PROVIDER_COLORS[job.provider || ''] || PROVIDER_COLORS.default;

    const salary =
        job.salaryMin && job.salaryMax
            ? `$${job.salaryMin.toLocaleString()}–$${job.salaryMax.toLocaleString()} ${job.currency}`
            : job.salaryMin
                ? `From $${job.salaryMin.toLocaleString()} ${job.currency}`
                : job.salaryMax
                    ? `Up to $${job.salaryMax.toLocaleString()} ${job.currency}`
                    : '—';

    return (
        <Paper
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/job/${job.id}`)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && router.push(`/job/${job.id}`)}
            elevation={0}
            sx={{
                p: 1.75,
                borderRadius: 3,
                border: `1px solid ${toAlpha(accent, 0.35)}`,
                background: '#121420',
                cursor: 'pointer',
                transition: 'transform .12s ease, box-shadow .12s ease, border-color .12s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 10px 30px ${toAlpha(accent, 0.25)}`,
                    borderColor: toAlpha(accent, 0.65),
                },
                outline: 'none',
                '&:focus-visible': { boxShadow: `0 0 0 3px ${toAlpha(accent, 0.35)}` },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Link component={NextLink} href={`/job/${job.id}`} underline="none" onClick={(e) => e.stopPropagation()}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 0.5, fontWeight: 800, color: '#E6E7FF', '&:hover': { textDecoration: 'underline' } }}
                    >
                        {job.title}
                    </Typography>
                </Link>

                {job.provider && (
                    <Chip
                        label={job.provider}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            fontWeight: 700,
                            color: accent,
                            borderColor: toAlpha(accent, 0.55),
                            backgroundColor: toAlpha(accent, 0.12),
                            '&:hover': { backgroundColor: toAlpha(accent, 0.18) },
                        }}
                        variant="outlined"
                    />
                )}
            </Stack>

            <HardDivider mt={1.25} mb={1.25} color={accent} />

            <Box sx={{ mt: 0.75, display: 'flex', flexWrap: 'wrap', gap: 0.75 }} onClick={(e) => e.stopPropagation()}>
                {job.technologies.map((t) => (
                    <TechPill key={t.id} name={t.name} slug={t.slug} />
                ))}
            </Box>

            <HardDivider mt={3} mb={3} color={accent} />

            <Grid container spacing={1.25}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <LabelValue label="Salary (USD)" value={salary} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <LabelValue label="Seniority" value={job.seniority} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <LabelValue label="Working Scheme" value={job.workingScheme} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <LabelValue label="English Level" value={job.englishLevel || '—'} />
                </Grid>
            </Grid>

            <HardDivider mt={3} mb={3} color={accent} />

            <Grid container spacing={1.25}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <LabelValue label="Location" value={job.location || '—'} />
                </Grid>
            </Grid>
        </Paper>
    );
}

function LabelValue({ label, value }: { label: string; value: string }) {
    return (
        <Box>
            <Typography variant="body2" sx={{ color: 'rgba(235,235,255,0.7)' }}>
                {label}
            </Typography>
            <Typography sx={{ color: 'rgba(235,235,255,0.95)', fontWeight: 700 }}>{value}</Typography>
        </Box>
    );
}
