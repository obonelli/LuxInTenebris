import { Box } from '@mui/material';
import Image from 'next/image';

export default function RightImage({
    src,
    alt,
}: {
    src: string;
    alt: string;
}) {
    return (
        <Box
            sx={{
                position: 'relative',
                width: { xs: 220, md: 260 },
                height: { xs: 220, md: 260 },
                borderRadius: '50%',
                background:
                    'radial-gradient(circle, rgba(124,77,255,.25), rgba(124,77,255,0) 60%)',
            }}
        >
            <Image
                src={src}
                alt={alt}
                fill
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(0,0,0,.6))' }}
                sizes="(max-width: 768px) 220px, 260px"
            />
        </Box>
    );
}
