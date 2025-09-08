'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type CVHistoryItem = {
    id: string;
    summary?: string | null;
    motivationalClose?: string | null;
    rawText: string;
    source?: string | null;
    createdAt: string;
};

export default function CVReviewerHistory() {
    const [items, setItems] = useState<CVHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/cv-history');
                if (!res.ok) throw new Error('Failed to fetch history');
                const data = await res.json();
                setItems(data.items ?? []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    if (items.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No history yet. Run a new CV analysis to get started.
            </Typography>
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            {items.map((item) => (
                <Accordion
                    key={item.id}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '&:before': { display: 'none' }, // quita la línea divisoria
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: 36,
                            '& .MuiAccordionSummary-content': {
                                margin: 0,
                            },
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {new Date(item.createdAt).toLocaleString()}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0.5, pb: 1 }}>
                        {item.summary && (
                            <Box>
                                <Typography variant="subtitle2">Summary</Typography>
                                <Typography variant="body2">{item.summary}</Typography>
                            </Box>
                        )}

                        {item.motivationalClose && (
                            <Box mt={1}>
                                <Typography variant="subtitle2">Motivational Close</Typography>
                                <Typography variant="body2">
                                    {item.motivationalClose}
                                </Typography>
                            </Box>
                        )}

                        <Box mt={1}>
                            <details>
                                <summary style={{ cursor: 'pointer' }}>Full Text</summary>
                                <Typography
                                    variant="body2"
                                    sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}
                                >
                                    {item.rawText}
                                </Typography>
                            </details>
                        </Box>

                        <Box mt={1}>
                            <Button
                                size="small"
                                variant="outlined"
                                href={`/api/download-txt?id=${item.id}`}
                            >
                                Download .txt
                            </Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
