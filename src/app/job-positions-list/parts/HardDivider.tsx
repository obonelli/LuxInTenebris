'use client';
import { Box } from '@mui/material';
import { toAlpha } from './utils';

export function HardDivider({
    mt = 3,
    mb = 3,
    color = 'rgba(124,77,255,.8)',
}: { mt?: number; mb?: number; color?: string }) {
    return (
        <Box
            sx={{
                mt,
                mb,
                width: '100%',
                height: 1,
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${toAlpha(color, 0.9)} 50%, rgba(0,0,0,0) 100%)`,
                borderTop: `1px solid ${toAlpha(color, 0.65)}`,
            }}
        />
    );
}
