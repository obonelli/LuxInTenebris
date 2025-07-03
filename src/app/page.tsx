'use client';

import CVReviewerForm from './components/CVReviewerForm';
import { Container, Box } from '@mui/material';

export default function Home() {
    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                pt: 4,
                alignItems: 'center',
            }}
        >
            <Box width="100%">
                <CVReviewerForm />
            </Box>
        </Container>
    );
}
