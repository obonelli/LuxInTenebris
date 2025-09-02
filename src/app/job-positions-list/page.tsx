'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Typography,
    Chip,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Button,
    Pagination,
    Link,
} from '@mui/material';
import Grid from '@mui/material/Grid'; // 👈 igual que en el Footer (API v7)
import NextLink from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

type Job = {
    id: string;
    title: string;
    description: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency: string;
    seniority: string;
    workingScheme: string;
    englishLevel?: string | null;
    location?: string | null;
    provider?: string | null;
    technologies: { id: number; name: string; slug: string }[];
};

const SENIORITIES = ['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'STAFF', 'LEAD', 'PRINCIPAL'] as const;
const SCHEMES = ['ONSITE', 'HYBRID', 'REMOTE'] as const;
const ENGLISH = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export default function JobsPage() {
    const sp = useSearchParams();
    const router = useRouter();

    const [q, setQ] = useState(sp.get('q') || '');
    const [seniority, setSeniority] = useState(sp.get('seniority') || '');
    const [scheme, setScheme] = useState(sp.get('scheme') || '');
    const [english, setEnglish] = useState(sp.get('english') || '');
    const [location, setLocation] = useState(sp.get('location') || '');
    const [tech, setTech] = useState<string[]>(sp.getAll('tech') || []);
    const [page, setPage] = useState(Number(sp.get('page') || 1));

    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const queryString = useMemo(() => {
        const p = new URLSearchParams();
        if (q) p.set('q', q);
        if (seniority) p.set('seniority', seniority);
        if (scheme) p.set('scheme', scheme);
        if (english) p.set('english', english);
        if (location) p.set('location', location);
        tech.forEach((t) => p.append('tech', t));
        p.set('page', String(page));
        p.set('pageSize', '6');
        return p.toString();
    }, [q, seniority, scheme, english, location, tech, page]);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/jobs?${queryString}`)
            .then((r) => r.json())
            .then((res) => {
                setJobs(res.data);
                setTotalPages(res.totalPages);
            })
            .finally(() => setLoading(false));

        router.replace(`/job-positions-list?${queryString}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryString]);

    const clearFilters = () => {
        setQ('');
        setSeniority('');
        setScheme('');
        setEnglish('');
        setLocation('');
        setTech([]);
        setPage(1);
    };

    return (
        <Box sx={{ background: 'linear-gradient(180deg, #0B0C10, #0E1016)', minHeight: '100dvh', py: 6 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 3 }}>
                    Open Roles
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search"
                        value={q}
                        onChange={(e) => {
                            setQ(e.target.value);
                            setPage(1);
                        }}
                        InputProps={{ sx: { borderRadius: 999 } }}
                    />
                </Box>

                <Grid container spacing={4}>
                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel>Technologies (slug)</InputLabel>
                                <Select
                                    multiple
                                    value={tech}
                                    label="Technologies (slug)"
                                    onChange={(e) => {
                                        const v = e.target.value as string[];
                                        setTech(v);
                                        setPage(1);
                                    }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((v) => (
                                                <Chip key={v} label={v} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {['typescript', 'dotnet', 'iam', 'react', 'nodejs'].map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Seniority</InputLabel>
                                <Select
                                    value={seniority}
                                    label="Seniority"
                                    onChange={(e) => {
                                        setSeniority(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Any</em>
                                    </MenuItem>
                                    {SENIORITIES.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Working Scheme</InputLabel>
                                <Select
                                    value={scheme}
                                    label="Working Scheme"
                                    onChange={(e) => {
                                        setScheme(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Any</em>
                                    </MenuItem>
                                    {SCHEMES.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>English Level</InputLabel>
                                <Select
                                    value={english}
                                    label="English Level"
                                    onChange={(e) => {
                                        setEnglish(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Any</em>
                                    </MenuItem>
                                    {ENGLISH.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Location"
                                value={location}
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                    setPage(1);
                                }}
                                fullWidth
                            />

                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" onClick={clearFilters} fullWidth>
                                    Clear
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* List */}
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Stack spacing={2} sx={{ mb: 2, alignItems: 'flex-end' }}>
                            <Pagination color="primary" count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
                        </Stack>

                        <Stack spacing={3}>
                            {loading ? (
                                <Typography sx={{ color: 'rgba(235,235,255,0.75)' }}>Loading…</Typography>
                            ) : jobs.length === 0 ? (
                                <Typography sx={{ color: 'rgba(235,235,255,0.75)' }}>No results</Typography>
                            ) : (
                                jobs.map((j) => <JobCard key={j.id} job={j} />)
                            )}
                        </Stack>

                        <Stack spacing={2} sx={{ mt: 3, alignItems: 'flex-end' }}>
                            <Pagination color="primary" count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function JobCard({ job }: { job: Job }) {
    const router = useRouter(); // 👈 para navegar al detalle

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
                p: 2.5,
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.08)',
                background: '#121420',
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
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                {/* el título sigue siendo un Link, pero toda la card también navega */}
                <Link component={NextLink} href={`/job/${job.id}`} underline="none" onClick={(e) => e.stopPropagation()}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#E6E7FF', '&:hover': { textDecoration: 'underline' } }}>
                        {job.title}
                    </Typography>
                </Link>
                {job.provider && <Chip label={job.provider} variant="outlined" onClick={(e) => e.stopPropagation()} />}
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {job.technologies.map((t) => (
                    <Chip key={t.id} size="small" label={t.name} onClick={(e) => e.stopPropagation()} />
                ))}
            </Stack>

            <Grid container spacing={2} sx={{ mt: 1.5 }}>
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

            <Grid container spacing={2} sx={{ mt: 0.5 }}>
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
