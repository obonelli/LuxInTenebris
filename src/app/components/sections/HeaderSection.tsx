'use client';

import {
    Box,
    Typography,
    Button,
    Menu,
    MenuItem,
    Container,
    IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginButton from '../layout/LoginButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const HEADER_HEIGHT = { xs: 72, md: 64 };

export default function HeaderSection() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isAuthed = status === 'authenticated';

    const [servicesAnchor, setServicesAnchor] = useState<null | HTMLElement>(null);
    const [mobileAnchor, setMobileAnchor] = useState<null | HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);

    const servicesOpen = Boolean(servicesAnchor);
    const mobileOpen = Boolean(mobileAnchor);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleServicesClick = (e: React.MouseEvent<HTMLElement>) =>
        setServicesAnchor(e.currentTarget);
    const closeServices = () => setServicesAnchor(null);

    const handleMobileClick = (e: React.MouseEvent<HTMLElement>) =>
        setMobileAnchor(e.currentTarget);
    const closeMobile = () => setMobileAnchor(null);

    return (
        <>
            {/* Fixed header */}
            <Box
                component="header"
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1100,
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(6px)',
                    background: scrolled
                        ? 'rgba(10,11,14,0.80)'
                        : 'linear-gradient(180deg, rgba(10,11,14,.55), rgba(10,11,14,.20) 60%, transparent)',
                    transition: 'background 200ms ease',
                }}
            >
                <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
                    <Box
                        sx={{
                            height: HEADER_HEIGHT,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {/* Logo */}
                        <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                            onClick={() => router.push('/')}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                Lux In Tenebris
                            </Typography>
                            <Box
                                component="img"
                                src="/icons/bolt.gif"
                                alt="⚡"
                                sx={{ width: 20, height: 20, position: 'relative', top: '-3.5px' }}
                            />
                        </Box>

                        {/* Actions — Desktop */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                onClick={() => router.push('/job-positions-list')}
                                sx={{
                                    color: 'primary.main',
                                    border: '1px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 0.5,
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    minWidth: 'auto',
                                    '&:hover': {
                                        backgroundColor: 'rgba(124,77,255,0.15)',
                                        boxShadow: '0 0 10px #7C4DFF',
                                    },
                                }}
                            >
                                Open Roles
                            </Button>

                            {isAuthed && (
                                <>
                                    <Button
                                        onClick={handleServicesClick}
                                        endIcon={
                                            <KeyboardArrowDownIcon
                                                sx={{
                                                    transition: 'transform 0.3s ease',
                                                    transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        }
                                        sx={{
                                            color: 'primary.main',
                                            border: '1px solid',
                                            borderColor: 'primary.main',
                                            borderRadius: 2,
                                            px: 2,
                                            py: 0.5,
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            textTransform: 'none',
                                            whiteSpace: 'nowrap',
                                            minWidth: 'auto',
                                            '&:hover': {
                                                backgroundColor: 'rgba(124,77,255,0.15)',
                                                boxShadow: '0 0 10px #7C4DFF',
                                            },
                                        }}
                                    >
                                        Services
                                    </Button>

                                    <Menu
                                        anchorEl={servicesAnchor}
                                        open={servicesOpen}
                                        onClose={closeServices}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        PaperProps={{
                                            sx: {
                                                mt: 1,
                                                borderRadius: 2,
                                                backgroundColor: '#1b1b2f',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: 'white',
                                                minWidth: 220,
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                closeServices();
                                                router.push('/cv-reviewer');
                                            }}
                                            sx={{ '&:hover': { backgroundColor: 'rgba(124,77,255,0.2)' } }}
                                        >
                                            CV Reviewer
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}

                            {/* Login/Logout desktop (existing component) */}
                            <LoginButton />
                        </Box>

                        {/* Acciones — Mobile */}
                        <Box
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            {/* Sign in / Sign out according to session */}
                            {status === 'authenticated' ? (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    sx={{
                                        color: 'primary.main',
                                        borderColor: 'primary.main',
                                        borderRadius: 2,
                                        px: 1.25,
                                        py: 0.25,
                                        fontWeight: 700,
                                        fontSize: '.8rem',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto',
                                    }}
                                >
                                    Sign out
                                </Button>
                            ) : (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => signIn()}
                                    sx={{
                                        color: 'primary.main',
                                        borderColor: 'primary.main',
                                        borderRadius: 2,
                                        px: 1.25,
                                        py: 0.25,
                                        fontWeight: 700,
                                        fontSize: '.8rem',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto',
                                    }}
                                >
                                    Sign in
                                </Button>
                            )}

                            {/* Collapsed menu (Open Roles / Services / Auth) */}
                            <IconButton
                                onClick={handleMobileClick}
                                aria-label="open menu"
                                sx={{ color: 'primary.main' }}
                            >
                                <MoreVertIcon />
                            </IconButton>

                            <Menu
                                anchorEl={mobileAnchor}
                                open={mobileOpen}
                                onClose={closeMobile}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        borderRadius: 2,
                                        backgroundColor: '#1b1b2f',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        minWidth: 220,
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        closeMobile();
                                        router.push('/job-positions-list');
                                    }}
                                >
                                    Open Roles
                                </MenuItem>

                                {isAuthed && (
                                    <MenuItem
                                        onClick={() => {
                                            closeMobile();
                                            router.push('/cv-reviewer');
                                        }}
                                    >
                                        CV Reviewer
                                    </MenuItem>
                                )}

                                {/* Opción de auth dentro del menú (extra) */}
                                {isAuthed ? (
                                    <MenuItem
                                        onClick={() => {
                                            closeMobile();
                                            signOut({ callbackUrl: '/' });
                                        }}
                                    >
                                        Sign out{session?.user?.name ? ` (${session.user.name})` : ''}
                                    </MenuItem>
                                ) : (
                                    <MenuItem
                                        onClick={() => {
                                            closeMobile();
                                            signIn();
                                        }}
                                    >
                                        Sign in
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Spacer */}
            <Box sx={{ height: HEADER_HEIGHT }} />
        </>
    );
}
