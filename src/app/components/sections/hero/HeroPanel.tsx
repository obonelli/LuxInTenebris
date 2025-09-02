import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NextLink from 'next/link';

import FeatureBullets from './FeatureBullets';
import FeatureKpis from './FeatureKpis';
import RightImage from './RightImage';
import type { Feature } from './data';

type Props = {
    feature: Feature;
    base: string;
    accent: string;
    tabKey: string; // re-mount controlado
};

export default function HeroPanel({ feature, base, accent, tabKey }: Props) {
    return (
        <Box
            key={tabKey}
            sx={{
                mt: 4,
                borderRadius: 4,
                p: { xs: 2.5, md: 4 },
                background:
                    'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.10)',
            }}
        >
            <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Izquierda: beneficios */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <FeatureBullets bullets={feature.bullets} base={base} />
                </Grid>

                {/* Centro: copy + CTAs */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 900, color: base, letterSpacing: 0.3, mb: 1.5 }}
                    >
                        {feature.title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(235,235,255,0.9)' }}>
                        {feature.copy}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5 }}>
                        <Button
                            component={NextLink}
                            href="/cv-reviewer"
                            size="large"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: 2,
                                px: 2,
                                background:
                                    'linear-gradient(90deg, rgba(124,77,255,.22), rgba(124,77,255,.15))',
                                border: '1px solid rgba(124,77,255,.45)',
                                color: base,
                                '&:hover': { boxShadow: `0 0 24px ${accent}55` },
                            }}
                        >
                            Try the Demo
                        </Button>
                        <Button
                            component={NextLink}
                            href="/services"
                            size="large"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: 2,
                                px: 2,
                                color: 'rgba(235,235,255,0.92)',
                                backgroundColor: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.10)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.10)' },
                            }}
                        >
                            Learn More
                        </Button>
                    </Box>
                </Grid>

                {/* Derecha: imagen */}
                <Grid
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <RightImage src={feature.rightImg.src} alt={feature.rightImg.alt} />
                </Grid>
            </Grid>

            <FeatureKpis kpis={feature.kpis} base={base} />
        </Box>
    );
}
