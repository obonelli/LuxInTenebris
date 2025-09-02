'use client';

import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

/* Colors */
const BASE = '#E4E4FF';
const BLUE = '#4C7CFF';
const VIOLET = '#7C4DFF';

/* Logos */
const LOGOS = [
    { name: 'Inceptio', src: '/logos/inceptio.png' },
    { name: 'Valitana', src: '/logos/valitana.png' },
    { name: 'Michelada', src: '/logos/michelada.png' },
    { name: 'Riot Games', src: '/logos/riot.webp' },
    { name: 'Valitana', src: '/logos/valitana.png' },
    { name: 'Michelada', src: '/logos/michelada.png' },
];

/* Tuning */
const SPEED_PX_S = 38;     // lower = slower
const ITEM_W = 132;        // fixed card width
const ITEM_H = 40;         // fixed card height
const GAP_PX = 48;         // fixed gap

export default function TrustedBySection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 7, md: 9 },
                background: `
          radial-gradient(900px 280px at 50% -10%, rgba(124,77,255,.10), transparent 60%),
          linear-gradient(180deg, #0B0C10 0%, #0E0F14 100%)
        `,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Typography
                    component="h2"
                    sx={{
                        fontWeight: 900,
                        fontSize: { xs: 28, md: 36 },
                        letterSpacing: '0.05em',
                        lineHeight: 1.2,
                        color: BASE,
                    }}
                >
                    Trusted by{' '}
                    <Box
                        component="span"
                        sx={{
                            background: `linear-gradient(90deg, ${BLUE} 0%, ${VIOLET} 100%)`,
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Industry Leaders
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        color: 'rgba(235,235,255,0.78)',
                        fontSize: { xs: 13, md: 15 },
                        mt: 1,
                        mb: { xs: 4, md: 6 },
                    }}
                >
                    Join hundreds of companies already using our platform to find and hire top tech talent
                </Typography>

                <Box
                    sx={{
                        mx: 'auto',
                        mb: { xs: 3, md: 4 },
                        width: 120,
                        height: 2,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, transparent, ${BLUE}, ${VIOLET}, transparent)`,
                        opacity: 0.7,
                    }}
                />

                <SmoothMarquee />
            </Container>
        </Box>
    );
}

/* ==== Pixel-perfect marquee with rAF (no % rounding at loop) ==== */
function SmoothMarquee() {
    const wrapRef = React.useRef<HTMLDivElement | null>(null);   // moving track (3 strips)
    const stripRef = React.useRef<HTMLDivElement | null>(null);  // first strip to measure width
    const req = React.useRef<number | null>(null);
    const lastTs = React.useRef<number | null>(null);
    const offset = React.useRef(0);       // current translateX in px
    const stripW = React.useRef(0);       // measured width of one strip
    const [ready, setReady] = React.useState(false);
    const [paused, setPaused] = React.useState(false);

    // Measure strip width (reacts to image load & resize)
    React.useEffect(() => {
        if (!stripRef.current) return;

        const ro = new ResizeObserver(() => {
            stripW.current = stripRef.current?.getBoundingClientRect().width ?? 0;
            // keep offset inside [0, stripW)
            if (stripW.current > 0) {
                offset.current = ((offset.current % stripW.current) + stripW.current) % stripW.current;
            }
            setReady(stripW.current > 0);
        });
        ro.observe(stripRef.current);
        return () => ro.disconnect();
    }, []);

    // rAF loop (pixel-based)
    React.useEffect(() => {
        if (!wrapRef.current || !ready) return;

        const step = (ts: number) => {
            if (paused) {
                lastTs.current = ts;
                req.current = requestAnimationFrame(step);
                return;
            }
            const last = lastTs.current ?? ts;
            const dt = (ts - last) / 1000; // seconds
            lastTs.current = ts;

            const w = stripW.current || 1;
            // move left
            offset.current += -SPEED_PX_S * dt;
            // wrap seamlessly (pure modulo)
            if (offset.current <= -w) offset.current += w;

            // apply transform in px (GPU)
            if (wrapRef.current) {
                wrapRef.current.style.transform = `translate3d(${offset.current}px,0,0)`;
            }
            req.current = requestAnimationFrame(step);
        };

        req.current = requestAnimationFrame(step);
        return () => {
            if (req.current) cancelAnimationFrame(req.current);
            req.current = null;
            lastTs.current = null;
        };
    }, [ready, paused]);

    return (
        <Box
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                maskImage:
                    'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage:
                    'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
                '@media (prefers-reduced-motion: reduce)': {
                    // stop animation for motion-sensitive users
                    '& > div': { transform: 'none !important' },
                },
            }}
        >
            <Box
                ref={wrapRef}
                sx={{
                    display: 'flex',
                    gap: `${GAP_PX}px`,
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translate3d(0,0,0)',
                    width: 'max-content',
                }}
            >
                {/* 3 identical strips to guarantee coverage */}
                <LogosStrip ref={stripRef} eager />
                <LogosStrip aria-hidden />
                <LogosStrip aria-hidden />
            </Box>
        </Box>
    );
}

/* One strip. Forward ref so we can measure width precisely. */
const LogosStrip = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof Box> & { eager?: boolean }
>(function LogosStrip({ eager, ...props }, ref) {
    return (
        <Box ref={ref} {...props} sx={{ display: 'flex', alignItems: 'center', gap: `${GAP_PX}px` }}>
            {LOGOS.map((c, i) => (
                <Box
                    key={`${c.name}-${i}`}
                    sx={{
                        flex: '0 0 auto',
                        width: ITEM_W,
                        height: ITEM_H,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.9,
                        filter: 'grayscale(1) brightness(0.95)',
                        transition: 'opacity .2s, filter .25s, transform .25s',
                        '&:hover': {
                            opacity: 1,
                            filter: 'grayscale(0) brightness(1)',
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    <Image
                        src={c.src}
                        alt={c.name}
                        width={ITEM_W}
                        height={ITEM_H}
                        loading={eager ? 'eager' : 'lazy'}
                        priority={!!eager}
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                </Box>
            ))}
        </Box>
    );
});
