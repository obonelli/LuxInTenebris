'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Button,
    Pagination,
    LinearProgress,
    InputAdornment,
    IconButton,
    Tooltip,
    Chip,
    Popper,
    Paper,
    ClickAwayListener,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSearchParams, useRouter } from 'next/navigation';

import {
    Job,
    SENIORITIES,
    SCHEMES,
    ENGLISH,
    PAGE_SIZE,
    TECH_SLUG_OPTIONS,
} from './parts/types';
import { JobCard } from './parts/JobCard';
import { TechMultiSelect } from './parts/TechMultiSelect';

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

    const [jobs, setJobs] = useState<Job[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const firstLoad = useRef(true);
    const [initializing, setInitializing] = useState(true); // avoid first render flicker
    const [refetching, setRefetching] = useState(false);

    const queryString = useMemo(() => {
        const p = new URLSearchParams();
        if (q) p.set('q', q);
        if (seniority) p.set('seniority', seniority);
        if (scheme) p.set('scheme', scheme);
        if (english) p.set('english', english);
        if (location) p.set('location', location);
        tech.forEach((t) => p.append('tech', t));
        p.set('page', String(page));
        p.set('pageSize', String(PAGE_SIZE));
        return p.toString();
    }, [q, seniority, scheme, english, location, tech, page]);

    // ---- Search UX extras ----
    const searchRef = useRef<HTMLInputElement | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    // press "/" anywhere to focus search (common pattern)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            // ignore when typing inside inputs/textareas
            const el = document.activeElement as HTMLElement | null;
            const typing =
                el &&
                (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.getAttribute('contenteditable') === 'true');

            if (e.key === '/' && !typing) {
                e.preventDefault();
                searchRef.current?.focus();
            } else if (e.key === 'Escape' && searchFocused) {
                // Esc clears when there is text; otherwise blur
                if (q) setQ('');
                else searchRef.current?.blur();
            }
        };
        window.addEventListener('keydown', onKey, { passive: false });
        return () => window.removeEventListener('keydown', onKey);
    }, [q, searchFocused]);

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debouncedFetch = (qs: string) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => fetchData(qs), 220);
    };

    const fetchData = async (qs: string) => {
        try {
            if (!firstLoad.current) setRefetching(true);
            const r = await fetch(`/api/jobs?${qs}`);
            const res = await r.json();
            setJobs(res.data || []);
            setTotalPages(Math.max(1, res.totalPages || 1));
        } finally {
            if (firstLoad.current) {
                firstLoad.current = false;
                setInitializing(false);
            }
            setRefetching(false);
        }
    };

    useEffect(() => {
        const url = `/job-positions-list?${queryString}`;
        router.replace(url);

        // first load: immediate fetch. further changes: debounced.
        if (firstLoad.current) fetchData(queryString);
        else debouncedFetch(queryString);
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

    const showPagination = !initializing && jobs.length > 0 && totalPages > 1;

    // Quick example queries (click to apply)
    const exampleQueries = [
        'react remote senior',
        'python data engineer onsite',
        'typescript mid hybrid',
        'gcp airflow b2',
    ];

    return (
        <Box sx={{ background: 'linear-gradient(180deg,#0B0C10,#0E1016)', minHeight: '100dvh', py: 6 }}>
            {refetching && (
                <Box sx={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 10 }}>
                    <LinearProgress />
                </Box>
            )}

            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                    Open Roles
                </Typography>

                {/* Enhanced Search */}
                <Box sx={{ mb: 2, position: 'relative' }}>
                    <TextField
                        fullWidth
                        inputRef={searchRef}
                        placeholder="Search roles, tech, company…"
                        value={q}
                        onFocus={(e) => {
                            setSearchFocused(true);
                            setAnchorEl(e.currentTarget);
                        }}
                        onBlur={() => setSearchFocused(false)}
                        onChange={(e) => {
                            setQ(e.target.value);
                            setPage(1);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ pl: 1 }}>
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end" sx={{ pr: 1 }}>
                                    {q ? (
                                        <Tooltip title="Clear (Esc)">
                                            <IconButton
                                                size="small"
                                                aria-label="Clear search"
                                                onClick={() => {
                                                    setQ('');
                                                    setPage(1);
                                                    searchRef.current?.focus();
                                                }}
                                            >
                                                <CloseRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        // Small “/” keycap hint when empty
                                        <Tooltip title="Press / to focus">
                                            <Box
                                                aria-hidden
                                                sx={{
                                                    fontSize: 12,
                                                    px: 1,
                                                    py: 0.25,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 1,
                                                    opacity: 0.7,
                                                    lineHeight: 1.2,
                                                    userSelect: 'none',
                                                }}
                                            >
                                                /
                                            </Box>
                                        </Tooltip>
                                    )}
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 999,
                                backdropFilter: 'blur(6px)',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                '& fieldset': { borderWidth: 1 },
                                '&:hover fieldset': { borderColor: 'primary.light' },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}33`,
                                },
                            },
                        }}
                    />

                    {/* Popper with examples (only when empty + focused) */}
                    <Popper
                        open={searchFocused && !q}
                        anchorEl={anchorEl}
                        placement="bottom-start"
                        style={{ zIndex: 11 }}
                    >
                        <ClickAwayListener onClickAway={() => setSearchFocused(false)}>
                            <Paper
                                elevation={8}
                                sx={{
                                    mt: 1,
                                    p: 1,
                                    bgcolor: 'rgba(21,23,28,0.9)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    maxWidth: 560,
                                }}
                            >
                                <Typography variant="caption" sx={{ opacity: 0.8, pl: 0.5 }}>
                                    Try a quick search:
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                                    {exampleQueries.map((ex) => (
                                        <Chip
                                            key={ex}
                                            size="small"
                                            label={ex}
                                            onClick={() => {
                                                setQ(ex);
                                                setPage(1);
                                                setSearchFocused(false);
                                                // Let debounce trigger; optional immediate fetch if you want:
                                                // fetchData(new URLSearchParams({...}).toString())
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </Stack>
                            </Paper>
                        </ClickAwayListener>
                    </Popper>
                </Box>

                <Grid container spacing={{ xs: 4, md: 4 }}>
                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Stack spacing={1.75}>
                            <TechMultiSelect
                                value={tech}
                                onChange={(v) => {
                                    setTech(v);
                                    setPage(1);
                                }}
                                options={TECH_SLUG_OPTIONS}
                            />

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
                        {initializing ? (
                            <LoadingBlock />
                        ) : (
                            <>
                                {showPagination && (
                                    <Box sx={{ my: 1.5, display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Pagination
                                            color="primary"
                                            count={totalPages}
                                            page={Math.min(page, totalPages)}
                                            onChange={(_, p) => setPage(p)}
                                            siblingCount={1}
                                            boundaryCount={1}
                                        />
                                    </Box>
                                )}

                                <Stack spacing={2}>
                                    {jobs.length === 0 ? (
                                        <Typography sx={{ color: 'rgba(235,235,255,0.75)' }}>
                                            {refetching ? 'Loading…' : 'No results'}
                                        </Typography>
                                    ) : (
                                        jobs.map((j) => <JobCard key={j.id} job={j} />)
                                    )}
                                </Stack>

                                {showPagination && (
                                    <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Pagination
                                            color="primary"
                                            count={totalPages}
                                            page={Math.min(page, totalPages)}
                                            onChange={(_, p) => setPage(p)}
                                            siblingCount={1}
                                            boundaryCount={1}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function LoadingBlock() {
    return (
        <Stack spacing={2}>
            <Box sx={{ height: 44, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ height: 164, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ height: 164, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ height: 164, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }} />
        </Stack>
    );
}
