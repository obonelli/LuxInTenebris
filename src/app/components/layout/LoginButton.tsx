'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button, Box } from '@mui/material';

export default function LoginButton() {
    const { data: session, status } = useSession();

    if (status === 'loading') return null;

    return (
        <Box sx={{ textAlign: 'center', mt: 0 }}>
            {session ? (
                <Button variant="outlined" color="secondary" onClick={() => signOut()}>
                    Sign out ({session.user?.name})
                </Button>
            ) : (
                <Button variant="contained" color="primary" onClick={() => signIn('google')}>
                    Sign in with Google
                </Button>
            )}
        </Box>
    );
}
