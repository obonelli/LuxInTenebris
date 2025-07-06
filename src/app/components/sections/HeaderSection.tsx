'use client';

import {
    Box,
    Typography,
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginButton from '../layout/LoginButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeaderSection() {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                position: 'absolute',
                width: '100%',
                top: 0,
                zIndex: 1000,
                backdropFilter: 'blur(6px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            {/* Logo */}
            <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer' }}
                onClick={() => router.push('/')}
            >
                Lux In Tenebris
            </Typography>

            {/* Navegación */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Botón de menú desplegable */}
                <Button
                    onClick={handleMenuClick}
                    endIcon={
                        <KeyboardArrowDownIcon
                            sx={{
                                transition: 'transform 0.3s ease',
                                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
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
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                            backgroundColor: 'rgba(124,77,255,0.15)',
                            boxShadow: '0 0 10px #7C4DFF',
                        },
                    }}
                >
                    Services
                </Button>

                {/* Menú desplegable */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            borderRadius: 2,
                            backgroundColor: '#1b1b2f',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            router.push('/cv-reviewer');
                        }}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(124,77,255,0.2)',
                            },
                        }}
                    >
                        Illuminate my Résumé
                    </MenuItem>
                </Menu>

                {/* Login / Logout */}
                <LoginButton />
            </Box>
        </Box>
    );
}
