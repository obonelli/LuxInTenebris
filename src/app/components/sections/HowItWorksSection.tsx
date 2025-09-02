// src/components/HowItWorksSection.tsx
'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TuneIcon from '@mui/icons-material/Tune';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LoginIcon from '@mui/icons-material/Login';
import { useSession } from 'next-auth/react';

const NEON_CYAN = '#00E1FF';
const ELECTRIC_VIOLET = '#7C4DFF';
const MAGENTA_FLARE = '#C158FF';

export default function HowItWorksSection() {
    const { status } = useSession();
    const isAuthed = status === 'authenticated';

    // Pasos base del CV Reviewer
    const baseSteps = [
        { icon: CloudUploadIcon, title: 'Upload your CV', text: 'Drag a PDF or paste your résumé in seconds.' },
        { icon: TuneIcon, title: 'Pick a Role', text: 'Frontend, Backend—or any dream job. Aurora adapts.' },
        { icon: FlashOnIcon, title: 'Get Instant Feedback', text: 'Actionable tips ready to make you shine.' },
    ];

    // Insertamos el paso de autenticación al inicio si no está logeado
    const steps = !isAuthed
        ? [{ icon: LoginIcon, title: 'Sign in to start', text: 'Access the CV Reviewer with your account.' }, ...baseSteps]
        : baseSteps;

    return (
        <Box
            component="section"
            id="cv-reviewer"
            sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}
        >
            {/* Título limpio */}
            <Typography
                variant="h3"
                textAlign="center"
                fontWeight={800}
                sx={{
                    mb: { xs: 5, md: 6 },
                    color: ELECTRIC_VIOLET,
                    transition: 'color .25s, text-shadow .25s',
                    userSelect: 'none',
                    cursor: 'default',
                    '&:hover': { color: NEON_CYAN, textShadow: `0 0 4px ${NEON_CYAN}` },
                }}
            >
                CV Reviewer
            </Typography>

            {/* Pasos */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                alignItems="stretch"
                justifyContent="center"
            >
                {steps.map(({ icon: Icon, title, text }) => (
                    <Box
                        key={title}
                        flex={1}
                        textAlign="center"
                        px={3}
                        maxWidth={{ xs: '100%', md: 320 }}
                        mx="auto"
                        sx={{ transition: 'transform .25s', '&:hover': { transform: 'translateY(-4px)' } }}
                    >
                        <Icon
                            sx={{
                                fontSize: 56,
                                mb: 2,
                                color: NEON_CYAN,
                                transition: 'color .25s, text-shadow .25s',
                                '&:hover': { color: MAGENTA_FLARE, textShadow: `0 0 10px ${MAGENTA_FLARE}` },
                            }}
                        />
                        <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>
                        <Typography color="text.secondary">{text}</Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
