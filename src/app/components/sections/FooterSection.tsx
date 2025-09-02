'use client';

import NextLink from 'next/link';
import {
    Box,
    Container,
    Stack,
    Typography,
    Link,
    IconButton,
    Divider,
    List,
    ListItemButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import YouTube from '@mui/icons-material/YouTube';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';

const YEAR = new Date().getFullYear();

const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
    {
        title: "Info Dev's",
        links: [
            { label: 'Front-End Developer', href: '/roles/frontend' },
            { label: 'Back-End Developer', href: '/roles/backend' },
            { label: 'DevOps Developer', href: '/roles/devops' },
            { label: 'Cloud Engineer', href: '/roles/cloud' },
            { label: 'Site Reliability Engineer', href: '/roles/sre' },
            { label: 'Machine Learning', href: '/roles/ml' },
        ],
    },
    {
        title: '+info',
        links: [
            { label: 'Mobile Developer', href: '/roles/mobile' },
            { label: 'Site Reliability Engineer', href: '/roles/sre' },
            { label: 'IA Engineer', href: '/roles/ai' },
            { label: 'Data Engineer', href: '/roles/data-engineer' },
            { label: 'Data Scientist', href: '/roles/data-scientist' },
        ],
    },
    {
        title: 'Positions',
        links: [
            { label: 'Open Roles', href: '/positions/open' },
            { label: 'Internships', href: '/positions/internships' },
            { label: 'Diversity', href: '/about/diversity' },
            { label: 'Culture', href: '/about/culture' },
            { label: 'Benefits', href: '/about/benefits' },
        ],
    },
    {
        title: 'More',
        links: [
            { label: 'Blog', href: '/blog' },
            { label: 'About Us', href: '/about' },
            { label: 'News', href: '/news' },
            { label: 'Community', href: '/community' },
            { label: 'Contact', href: '/contact' },
        ],
    },
];

export default function FooterSection() {
    return (
        <Box
            component="footer"
            sx={{
                color: 'rgba(235,235,255,0.9)',
                background:
                    'linear-gradient(180deg, #0B0C10 0%, #0E0F14 55%, #0A0B0E 100%)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
                <Box
                    sx={{
                        px: { xs: 3, md: 5 },
                        py: { xs: 4, md: 6 },
                        borderRadius: 3,
                        background:
                            'radial-gradient(1200px 200px at 50% 0%, rgba(124,77,255,.10), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    <Grid container spacing={{ xs: 4, md: 6 }}>
                        {/* Marca */}
                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                            <Stack spacing={2.5}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: 0.3,
                                        background:
                                            'linear-gradient(90deg,#E4E4FF 0%,#9FA8FF 60%,#C158FF 100%)',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                    }}
                                >
                                    Lux in Tenebris
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ color: 'rgba(235,235,255,0.75)', maxWidth: 300 }}
                                >
                                    Lighting the path from talent to opportunity.
                                </Typography>

                                <Stack direction="row" spacing={1.5}>
                                    <IconButton
                                        aria-label="YouTube"
                                        component={Link}
                                        href="https://youtube.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ color: 'rgba(235,235,255,0.8)' }}
                                    >
                                        <YouTube />
                                    </IconButton>
                                    <IconButton
                                        aria-label="LinkedIn"
                                        component={Link}
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ color: 'rgba(235,235,255,0.8)' }}
                                    >
                                        <LinkedIn />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Facebook"
                                        component={Link}
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ color: 'rgba(235,235,255,0.8)' }}
                                    >
                                        <Facebook />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Instagram"
                                        component={Link}
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ color: 'rgba(235,235,255,0.8)' }}
                                    >
                                        <Instagram />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Grid>

                        {/* Columnas */}
                        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                            <Grid container spacing={{ xs: 3, md: 4 }}>
                                {columns.map((col) => (
                                    <Grid key={col.title} size={{ xs: 6, sm: 3 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 700, mb: 1.5, color: '#E6E7FF' }}
                                        >
                                            {col.title}
                                        </Typography>

                                        <List disablePadding>
                                            {col.links.map((l) => (
                                                <ListItemButton
                                                    key={l.label}
                                                    component="div"    // 👈 evita que ListItemButton sea <a>
                                                    sx={{
                                                        px: 0,
                                                        py: 0.5,
                                                        alignItems: 'flex-start',
                                                        '&::before': {
                                                            content: '""',
                                                            display: 'inline-block',
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            mt: '10px',
                                                            mr: 1.25,
                                                            flex: '0 0 auto',
                                                            backgroundColor: 'rgba(255,255,255,0.45)',
                                                        },
                                                        '&:hover::before': { backgroundColor: '#00E1FF' },
                                                    }}
                                                >
                                                    <Link
                                                        component={NextLink}
                                                        href={l.href}
                                                        underline="none"
                                                        sx={{
                                                            color: 'rgba(235,235,255,0.82)',
                                                            fontSize: 14,
                                                            '&:hover': { color: '#00E1FF', textDecoration: 'underline' },
                                                        }}
                                                    >
                                                        {l.label}
                                                    </Link>
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mt: { xs: 4, md: 6 }, borderColor: 'rgba(255,255,255,0.08)' }} />

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1.5}
                        sx={{ color: 'rgba(235,235,255,0.65)', fontSize: 13, mt: 3 }}
                    >
                        <Typography>© {YEAR} Lux in Tenebris. All rights reserved.</Typography>
                        <Stack direction="row" spacing={3}>
                            <Link component={NextLink} href="/terms" underline="hover" sx={{ color: 'inherit' }}>
                                Terms
                            </Link>
                            <Link component={NextLink} href="/privacy" underline="hover" sx={{ color: 'inherit' }}>
                                Privacy
                            </Link>
                            <Link component={NextLink} href="/cookies" underline="hover" sx={{ color: 'inherit' }}>
                                Cookies
                            </Link>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
