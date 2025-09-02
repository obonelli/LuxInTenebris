'use client';

import { Box, Container, Skeleton, Stack, Pagination } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function LoadingJobsPage() {
    return (
        <Box sx={{ background: 'linear-gradient(180deg,#0B0C10,#0E1016)', minHeight: '100dvh', py: 6 }}>
            <Container maxWidth="lg">
                <Skeleton variant="text" width={200} height={42} />
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="rounded" height={44} />
                </Box>

                <Grid container spacing={{ xs: 4, md: 4 }}>
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Stack spacing={1.75}>
                            <Skeleton variant="rounded" height={56} />
                            <Skeleton variant="rounded" height={56} />
                            <Skeleton variant="rounded" height={56} />
                            <Skeleton variant="rounded" height={56} />
                            <Skeleton variant="rounded" height={56} />
                            <Skeleton variant="rounded" height={40} />
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Box sx={{ my: 1.5, display: 'flex', justifyContent: 'center' }}>
                            <Pagination count={1} page={1} />
                        </Box>

                        <Stack spacing={2}>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} variant="rounded" height={164} />
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
