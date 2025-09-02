'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Container, Typography, CircularProgress } from '@mui/material';

export default function RedirectPage() {
    const router = useRouter();
    const params = useSearchParams();

    const to = params.get('to') || '/';
    const reason = params.get('reason') || '';

    useEffect(() => {
        const t = setTimeout(() => router.replace(to), 1200);
        return () => clearTimeout(t);
    }, [to, router]);

    const message =
        reason === 'signin-required'
            ? 'Please sign in to continue. Redirecting…'
            : reason === 'forbidden'
                ? 'You do not have permission to view that page. Redirecting…'
                : 'Redirecting…';

    return (
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    {message}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    If this takes too long,{' '}
                    <Box
                        component="span"
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => router.replace(to)}
                    >
                        click here
                    </Box>
                    .
                </Typography>
            </Box>
        </Container>
    );
}
