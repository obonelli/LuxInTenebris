'use client';

import { Box, Container, Fade, Typography } from '@mui/material';
import HeroTabs from './hero/HeroTabs';
import HeroPanel from './hero/HeroPanel';
import { FEATURES, type Feature } from './hero/data';
import React from 'react';

export default function HeroSection() {
    const [tab, setTab] = React.useState<Feature['key']>('matching');
    const feature = FEATURES.find((f) => f.key === tab)!;

    const base = '#E4E4FF';
    const accent = '#7C4DFF';

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                minHeight: '92vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: `
          radial-gradient(1200px 320px at 50% -10%, rgba(124,77,255,.18), transparent 60%),
          radial-gradient(600px 600px at 95% 35%, rgba(255,194,39,.18), transparent 60%),
          linear-gradient(180deg, #0B0C10 0%, #0E0F14 55%, #0A0B0E 100%)
        `,
                // 🔹 La línea bajo el header puede molestar en móvil: la quitamos en xs
                borderTop: {
                    xs: 'none',
                    md: '1px solid rgba(255,255,255,0.04)',
                },
            }}
        >
            {/* textura suave */}
            <Box
                sx={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                    opacity: 0.25,
                }}
            />

            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    // 🔹 Aire arriba SOLO en móvil para despegar el título del header
                    pt: { xs: 2, sm: 2.5, md: 0 },
                    // Respetar notch (iOS)
                    paddingTop: { xs: 'calc(env(safe-area-inset-top, 0px) + 16px)', md: 0 },
                    // 🔹 Aire abajo SOLO en móvil para separar de la siguiente sección
                    pb: { xs: 6, md: 2 },
                }}
            >
                {/* Título */}
                <Typography
                    component="h1"
                    sx={{
                        fontWeight: 900,
                        letterSpacing: 0.2,
                        lineHeight: 1.05,
                        fontSize: { xs: 36, md: 72 },
                        color: base,
                        textAlign: 'center',
                    }}
                >
                    <Box component="span" sx={{ mr: 1 }}>
                        Ignite
                    </Box>
                    <Box
                        component="span"
                        sx={{
                            background:
                                'linear-gradient(90deg, #7DB2FF 0%, #4C7CFF 35%, #7C4DFF 70%, #C158FF 100%)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Your Career
                    </Box>
                    <Box component="span" sx={{ ml: 1 }}>
                        in the
                    </Box>{' '}
                    <Box
                        component="span"
                        sx={{
                            background:
                                'linear-gradient(90deg, #C158FF 0%, #7C4DFF 55%, #9FA8FF 100%)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 0 18px rgba(124,77,255,.22)',
                        }}
                    >
                        Dark
                    </Box>
                </Typography>

                {/* Subtítulo */}
                <Typography
                    variant="h6"
                    sx={{
                        mt: 2.5,
                        mx: 'auto',
                        maxWidth: 860,
                        textAlign: 'center',
                        color: 'rgba(235,235,255,0.88)',
                        fontWeight: 500,
                    }}
                >
                    AI-powered insights to accelerate your tech career — precise, fast, and
                    unapologetically bold.
                </Typography>

                {/* Tabs */}
                <Box
                    sx={{
                        mt: 3,
                        mx: 'auto',
                        width: 'fit-content',
                        borderRadius: 999,
                        p: 0.5,
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    <HeroTabs value={tab} onChange={setTab} baseColor={base} accentColor={accent} />
                </Box>

                {/* Panel con transición */}
                <Fade in timeout={350} appear mountOnEnter unmountOnExit>
                    <div>
                        <HeroPanel feature={feature} base={base} accent={accent} tabKey={tab} />
                    </div>
                </Fade>
            </Container>
        </Box>
    );
}
