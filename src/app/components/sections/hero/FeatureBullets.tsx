import { Box, Stack } from '@mui/material';

export default function FeatureBullets({ bullets, base }: { bullets: string[]; base: string }) {
    return (
        <Stack spacing={1.5}>
            {bullets.map((b) => (
                <Box
                    key={b}
                    sx={{
                        px: 2,
                        py: 1.25,
                        borderRadius: 2,
                        color: base,
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        fontWeight: 700,
                    }}
                >
                    {b.toUpperCase()}
                </Box>
            ))}
        </Stack>
    );
}
