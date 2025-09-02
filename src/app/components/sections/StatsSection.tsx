'use client';

import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import GroupIcon from '@mui/icons-material/Group';
import GradeIcon from '@mui/icons-material/Grade';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useEffect, useMemo, useRef, useState } from 'react';

const BASE = '#E4E4FF';
const BLUE = '#4C7CFF';
const VIOLET = '#7C4DFF';
const CYAN = '#58E1FF';
const RED = '#FF6B6B';
const GOLD = '#D3A84C';

function useCountUp(target: number, duration = 1200, inView = true) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!inView) return;
        let raf = 0;
        const start = performance.now();
        const animate = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            setVal(Math.round(target * (1 - Math.pow(1 - t, 3))));
            if (t < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [target, duration, inView]);
    return val;
}

export default function StatsSection() {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!rootRef.current) return;
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
        io.observe(rootRef.current);
        return () => io.disconnect();
    }, []);

    const companies = useCountUp(100, 900, inView);
    const placements = useCountUp(1000, 1100, inView);
    const satisfaction = useCountUp(95, 1000, inView);

    const items = useMemo(
        () => [
            { icon: <GroupIcon />, ring: `linear-gradient(180deg, ${BLUE}, ${VIOLET})`, value: `${companies}+`, label: 'Companies Served', color: BLUE },
            { icon: <GradeIcon />, ring: `linear-gradient(180deg, ${GOLD}, #B9842A)`, value: `${placements}+`, label: 'Successful Placements', color: GOLD },
            { icon: <FavoriteBorderIcon />, ring: `linear-gradient(180deg, ${RED}, #B33B3B)`, value: `${satisfaction}%`, label: 'Client Satisfaction', color: RED },
        ],
        [companies, placements, satisfaction]
    );

    return (
        <Box
            ref={rootRef}
            component="section"
            sx={{
                py: { xs: 8, md: 10 },
                position: 'relative',
                overflow: 'hidden',
                background: `
          radial-gradient(1000px 360px at 50% -10%, rgba(124,77,255,.18), transparent 60%),
          linear-gradient(180deg, #0B0C10 0%, #0D1016 100%)
        `,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <Box
                sx={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    opacity: 0.18,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', textAlign: 'center' }}>
                <Typography
                    component="h2"
                    sx={{
                        fontWeight: 900,
                        fontSize: { xs: 26, md: 34 },
                        lineHeight: 1.2,
                        color: BASE,
                        mb: { xs: 6, md: 8 },
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            background: `linear-gradient(90deg, ${CYAN} 0%, ${BLUE} 40%, ${VIOLET} 100%)`,
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            letterSpacing: '0.04em',
                        }}
                    >
                        Results
                    </Box>{' '}
                    that matter
                </Typography>

                {/* Grid clásico con API `size` (sin `item`) */}
                <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
                    {items.map((it, idx) => (
                        <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 76, height: 76, borderRadius: '50%',
                                        display: 'grid', placeItems: 'center',
                                        background: it.ring, boxShadow: '0 8px 30px rgba(0,0,0,.35)',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 64, height: 64, borderRadius: '50%',
                                            display: 'grid', placeItems: 'center',
                                            background: 'rgba(9,10,14,.9)', color: it.color,
                                        }}
                                    >
                                        <Box sx={{ '& svg': { fontSize: 30 } }}>{it.icon}</Box>
                                    </Box>
                                </Box>

                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: { xs: 36, md: 44 },
                                        letterSpacing: '0.02em',
                                        color: BASE,
                                        textShadow: '0 0 16px rgba(124,77,255,.18)',
                                    }}
                                >
                                    {it.value}
                                </Typography>

                                <Typography sx={{ color: 'rgba(235,235,255,0.78)', fontSize: 14 }}>
                                    {it.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
