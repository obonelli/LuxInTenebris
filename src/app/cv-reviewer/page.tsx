'use client';

import { Box, Button, Container } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/navigation';
import CVReviewerForm from '../components/CVReviewerForm';

export default function CVReviewerPage() {
    const router = useRouter();

    const neonColor = '#7C4DFF';
    const textGradient =
        'linear-gradient(90deg,#E4E4FF 0%,#CBCBFF 50%,#E4E4FF 100%)';

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', pt: 10 }}>
            {/* Styled Back button */}
            <Button
                onClick={() => router.push('/')}
                startIcon={<ArrowBackIosNewIcon fontSize="small" />}
                sx={{
                    mb: 3,
                    ml: '1.3rem',          // ← margen izquierdo solicitado
                    px: 3,
                    py: 0.8,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: `2px solid ${neonColor}`,
                    backdropFilter: 'blur(4px)',
                    transition: 'all .25s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        boxShadow: `0 0 18px ${neonColor}`,
                    },
                }}
            >
                <Box
                    component="span"
                    sx={{
                        background: textGradient,
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Back
                </Box>
            </Button>

            <Box width="100%">
                <CVReviewerForm />
            </Box>
        </Container>
    );
}
