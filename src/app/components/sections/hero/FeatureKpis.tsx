import { Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import type { Feature } from './data';

export default function FeatureKpis({
    kpis,
    base,
}: Pick<Feature, 'kpis'> & { base: string }) {
    return (
        <>
            <Divider
                sx={{ my: { xs: 2.5, md: 3 }, borderColor: 'rgba(255,255,255,0.08)' }}
            />

            <Grid container spacing={{ xs: 2, md: 3 }}>
                {kpis.map((k) => (
                    <Grid key={k.label} size={{ xs: 12, md: 4 }}>
                        <Stack alignItems="center" spacing={0.5}>
                            <Typography sx={{ fontSize: 24, fontWeight: 900, color: base }}>
                                {k.value}
                            </Typography>
                            <Typography sx={{ color: 'rgba(235,235,255,0.8)' }}>
                                {k.label}
                            </Typography>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
