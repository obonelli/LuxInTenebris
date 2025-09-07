'use client';

import { useState } from 'react';
import { Box, Button, Container, Tabs, Tab } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/navigation';
import CVReviewerForm from '@/app/components/feedback/CVReviewerForm';
import CVReviewerHistory from '@/app/components/feedback/CVReviewerHistory';

export default function CVReviewerPage() {
    const router = useRouter();
    const [tab, setTab] = useState(0);

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
                    ml: '1.3rem',
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

            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                centered
                sx={{ mb: 4 }}
            >
                <Tab label="New Analysis" />
                <Tab label="History" />
            </Tabs>

            <Box width="100%">
                {tab === 0 && <CVReviewerForm />}
                {tab === 1 && <CVReviewerHistory />}
            </Box>
        </Container>
    );
}
