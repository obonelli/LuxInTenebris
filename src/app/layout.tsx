'use client';

import './globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// 💜 Tu tema personalizado
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
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
