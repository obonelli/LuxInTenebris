'use client';

import './globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
} from '@mui/material';

import HeaderSection from './components/sections/HeaderSection';
import FooterSection from './components/sections/FooterSection';

// 💜 Tema
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#7c4dff' },
        secondary: { main: '#c158ff' },
    },
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {/* Header fijo en todas las rutas */}
                        <HeaderSection />

                        {/* Contenedor para sticky footer */}
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '100dvh',
                            }}
                        >
                            {/* Contenido de la página */}
                            <Box component="main" sx={{ flex: 1 }}>
                                {children}
                            </Box>

                            {/* Footer global */}
                            <FooterSection />
                        </Box>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
