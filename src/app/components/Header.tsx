'use client';

import React from 'react';
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Toolbar,
    Typography,
    useScrollTrigger,
} from '@mui/material';
import type { AppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

/* ---------- Elevation on scroll ---------- */
function ElevationScroll({
    children,
}: {
    children: React.ReactElement<AppBarProps>;
}) {
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

    // TS acepta la prop extra si la casteamos como Partial<AppBarProps>
    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    } as Partial<AppBarProps>);
}

/* ---------- Header ---------- */
export default function Header() {
    const router = useRouter();

    const navItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Cómo funciona', href: '#como-funciona' },
        { label: 'Analizar CV', href: '/cv-reviewer' },
    ];

    /* helper para anchors */
    const handleNav = (href: string) => {
        if (href.startsWith('#')) {
            document
                .querySelector(href)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            router.push(href);
        }
    };

    return (
        <ElevationScroll>
            <AppBar
                position="fixed"
                color="transparent"
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(11,12,16,0.65)',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        {/* Logo / wordmark */}
                        <Typography
                            variant="h6"
                            component="button"
                            onClick={() => router.push('/')}
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                background: 'none',
                                border: 0,
                                color: 'primary.main',
                                cursor: 'pointer',
                            }}
                        >
                            Lux in Tenebris
                        </Typography>

                        {/* Burger (mobile) — placeholder por ahora */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton color="inherit" edge="end">
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* Links desktop */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            {navItems.map(({ label, href }) => (
                                <Button
                                    key={label}
                                    color="inherit"
                                    onClick={() => handleNav(href)}
                                    sx={{ fontWeight: 500 }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ElevationScroll>
    );
}
