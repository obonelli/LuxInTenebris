'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
    const router = useRouter();

    /* Colores */
    const baseColor = '#E4E4FF';        // plateado-lila
    const neonColor = '#7C4DFF';        // morado neón

    /* Título a dividir en caracteres */
    const title = 'Ignite Your Career in the Dark';

    return (
        <Box
            component="section"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: `
          linear-gradient(rgba(11,12,16,0.85), rgba(11,12,16,0.85)),
          radial-gradient(circle at 50% 0%, rgba(124,77,255,0.35) 0%, transparent 70%),
          linear-gradient(135deg,#275CFF 0%,#7C4DFF 40%,#C158FF 100%)
        `,
            }}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                {/* Tagline */}
                <Typography
                    variant="overline"
                    sx={{ color: neonColor, letterSpacing: 3, fontWeight: 700 }}
                >
                    LUX IN TENEBRIS
                </Typography>

                {/* Title con efecto per-char */}
                <Typography
                    component="h1"
                    variant="h2"
                    sx={{
                        mt: 1,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        color: baseColor,
                        userSelect: 'none',
                        display: 'inline-block',
                    }}
                >
                    {title.split('').map((ch, i) => (
                        <Box
                            key={i}
                            component="span"
                            sx={{
                                display: 'inline-block',
                                transition: 'color .25s, text-shadow .25s',
                                cursor: 'default',
                                '&:hover': {
                                    color: neonColor,
                                    textShadow: `0 0 8px ${neonColor}`,
                                },
                            }}
                        >
                            {ch === ' ' ? '\u00A0' : ch}
                        </Box>
                    ))}
                </Typography>

                {/* Subtitle */}
                <Typography
                    variant="h6"
                    sx={{ mt: 3, color: 'rgba(235,235,255,0.88)' }}
                >
                    AI-powered insights, forged with passion and unstoppable resolve.
                </Typography>

                {/* CTA */}
                <Button
                    size="large"
                    onClick={() => router.push('/cv-reviewer')}
                    sx={{
                        mt: 5,
                        px: 5,
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        textTransform: 'none',
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: `2px solid ${neonColor}`,
                        backdropFilter: 'blur(4px)',
                        transition: 'all .25s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            transform: 'translateY(-2px)',
                            boxShadow: `0 0 18px ${neonColor}`,
                        },
                    }}
                >
                    {/* Texto con gradiente suave */}
                    <Box
                        component="span"
                        sx={{
                            mr: 1,
                            background:
                                'linear-gradient(90deg,#E4E4FF 0%,#CBCBFF 50%,#E4E4FF 100%)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Illuminate&nbsp;my&nbsp;Résumé
                    </Box>

                    {/* Icono animado */}
                    <Box
                        component="img"
                        src="/icons/bolt.gif"
                        alt="⚡"
                        sx={{ width: 20, height: 20 }}
                    />
                </Button>
            </Container>
        </Box>
    );
}
