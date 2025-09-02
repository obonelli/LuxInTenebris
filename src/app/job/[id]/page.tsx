'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    Link as MuiLink,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { useSession } from 'next-auth/react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

import { useParams, useRouter } from 'next/navigation';
import NextLink from 'next/link';

import JobOverviewCards from './JobOverviewCards';

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
    const { data: session } = useSession();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [job, setJob] = useState<JobDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (!res.ok) throw new Error('Not found');
                const data = (await res.json()) as JobDetail;
                if (alive) setJob(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'Error loading job';
                if (alive) setErr(msg);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    const salary = useMemo(
        () => (job ? formatSalary(job.salaryMin, job.salaryMax, job.currency) : '—'),
        [job]
    );

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

    const onCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1100);
        } catch { }
    };

    const providerUrl = guessUrl(job.provider);

    return (
        <Box
            sx={{
                background: 'linear-gradient(180deg,#0B0C10,#0E1016)',
                minHeight: '100dvh',
                py: 6,
                pb: { xs: 12, sm: 6 }, // space for mobile action bar
            }}
        >
            <Container maxWidth="lg">
                {/* Back */}
                <Button onClick={() => router.back()} sx={{ mb: 2 }} startIcon={<ArrowBackIosNewRoundedIcon />}>
                    Back
                </Button>

                {/* HERO */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
                    }}
                >
                    <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
                        <Grid size={{ xs: 12, md: 9 }}>
                            <Stack spacing={1.25}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#E6E7FF',
                                        lineHeight: 1.15,
                                        textWrap: 'balance',
                                        fontSize: { xs: 28, sm: 34 },
                                    }}
                                >
                                    {job.title}
                                </Typography>

                                {/* Chips */}
                                {isMobile ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            overflowX: 'auto',
                                            WebkitOverflowScrolling: 'touch',
                                            pr: 1,
                                            pb: 0.5,
                                            scrollbarWidth: 'none',
                                            '&::-webkit-scrollbar': { display: 'none' },
                                            // Use white for visible zones in mask
                                            maskImage:
                                                'linear-gradient(90deg, transparent 0, #fff 16px, #fff calc(100% - 16px), transparent 100%)',
                                            WebkitMaskImage:
                                                'linear-gradient(90deg, transparent 0, #fff 16px, #fff calc(100% - 16px), transparent 100%)',
                                        }}
                                    >
                                        {job.provider && (
                                            <Chip
                                                label={job.provider}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(124,77,255,.12)',
                                                    color: 'primary.main',
                                                    border: '1px solid rgba(124,77,255,.35)',
                                                    flex: '0 0 auto',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            />
                                        )}
                                        {salary !== '—' && (
                                            <Chip
                                                label={salary}
                                                size="small"
                                                icon={<PaymentsRoundedIcon />}
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,.06)',
                                                    border: '1px solid rgba(255,255,255,.08)',
                                                    flex: '0 0 auto',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            />
                                        )}
                                        {job.technologies.map((t) => (
                                            <Chip
                                                key={t.id}
                                                size="small"
                                                label={t.name}
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,.06)',
                                                    border: '1px solid rgba(255,255,255,.08)',
                                                    flex: '0 0 auto',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                        {job.provider && (
                                            <Chip
                                                label={job.provider}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(124,77,255,.12)',
                                                    color: 'primary.main',
                                                    border: '1px solid rgba(124,77,255,.35)',
                                                }}
                                            />
                                        )}
                                        {salary !== '—' && (
                                            <Chip
                                                label={salary}
                                                size="small"
                                                icon={<PaymentsRoundedIcon />}
                                                sx={{ bgcolor: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}
                                            />
                                        )}
                                        {job.technologies.map((t) => (
                                            <Chip
                                                key={t.id}
                                                size="small"
                                                label={t.name}
                                                sx={{ bgcolor: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}
                                            />
                                        ))}
                                    </Stack>
                                )}

                                {/* External provider link if it looks like a URL */}
                                {providerUrl && (
                                    <MuiLink
                                        component="a"
                                        href={providerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="hover"
                                        sx={{ mt: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                                    >
                                        {providerUrl.replace(/^https?:\/\//, '')}
                                        <LaunchRoundedIcon fontSize="small" />
                                    </MuiLink>
                                )}
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            {/* Desktop actions */}
                            <Stack
                                direction="row"
                                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                                spacing={1}
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                <Tooltip title={copied ? 'Copied' : 'Copy link'}>
                                    <IconButton onClick={onCopyLink} color={copied ? 'success' : 'default'}>
                                        {copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                                    </IconButton>
                                </Tooltip>

                                {session ? (
                                    <Button component={NextLink} href={`/apply/${job.id}`} variant="contained">
                                        Apply Now
                                    </Button>
                                ) : (
                                    <Button
                                        component={NextLink}
                                        href={`/api/auth/signin?callbackUrl=/job/${job.id}`}
                                        variant="contained"
                                    >
                                        Sign in to Apply
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {/* DETAILS */}
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                        Job Details
                    </Typography>

                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <IconLabelValue icon={<LocationOnRoundedIcon />} label="Location" value={job.location || '—'} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <IconLabelValue icon={<WorkOutlineRoundedIcon />} label="Work Scheme" value={job.workingScheme} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <IconLabelValue icon={<MilitaryTechRoundedIcon />} label="Seniority" value={job.seniority} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <IconLabelValue icon={<LanguageRoundedIcon />} label="English Level" value={job.englishLevel || '—'} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <IconLabelValue icon={<PaymentsRoundedIcon />} label="Salary (USD)" value={salary} />
                        </Grid>
                        {job.createdAt && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <IconLabelValue icon={<CalendarMonthRoundedIcon />} label="Posted" value={formatDate(job.createdAt)} />
                            </Grid>
                        )}
                    </Grid>
                </Paper>

                {/* OVERVIEW / MARKDOWN */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                        Job Overview
                    </Typography>

                    <JobOverviewCards description={job.description} />
                </Paper>
            </Container>

            {/* MOBILE ACTION BAR */}
            <Box
                sx={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1100,
                    display: { xs: 'block', sm: 'none' },
                }}
            >
                <Container maxWidth="lg" sx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    <Paper
                        elevation={6}
                        sx={{
                            mx: 'auto',
                            mb: 1,
                            p: 1,
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(18,20,32,.9)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <Stack direction="row" spacing={1}>
                            <IconButton onClick={onCopyLink} sx={{ flex: '0 0 auto' }} color={copied ? 'success' : 'default'}>
                                {copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                            </IconButton>

                            {session ? (
                                <Button component={NextLink} href={`/apply/${job.id}`} variant="contained" fullWidth>
                                    Apply Now
                                </Button>
                            ) : (
                                <Button
                                    component={NextLink}
                                    href={`/api/auth/signin?callbackUrl=/job/${job.id}`}
                                    variant="contained"
                                    fullWidth
                                >
                                    Sign in to Apply
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
}

/** Compact card with left accent + icon */
function IconLabelValue({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <Box
            sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
                height: '100%',
                minHeight: { xs: 72, sm: 0 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    bgcolor: 'primary.main',
                    opacity: 0.9,
                },
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Box sx={{ opacity: 0.9, display: 'inline-flex' }}>{icon}</Box>
                <Typography variant="subtitle2" sx={{ color: 'rgba(235,235,255,0.8)' }}>
                    {label}
                </Typography>
            </Stack>
            <Typography sx={{ color: 'rgba(235,235,255,0.98)', fontWeight: 700 }}>{value}</Typography>
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

function formatDate(iso?: string) {
    if (!iso) return '—';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    } catch {
        return '—';
    }
}

/** If provider looks like a domain or URL, return normalized https:// URL; else undefined */
function guessUrl(input?: string | null) {
    if (!input) return undefined;
    const s = input.trim();
    if (!s) return undefined;
    if (/^https?:\/\//i.test(s)) return s;
    if (/^[\w.-]+\.[a-z]{2,}$/i.test(s)) return `https://${s}`;
    return undefined;
}
