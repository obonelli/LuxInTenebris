'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';

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
        <Box display="flex" flexDirection="column" gap={2}>
            {items.map((item) => (
                <Card
                    key={item.id}
                    variant="outlined"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(255,255,255,0.1)',
                    }}
                >
                    <CardContent>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(item.createdAt).toLocaleString()}
                        </Typography>

                        {item.summary && (
                            <Box mt={1}>
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
                                    sx={{ whiteSpace: 'pre-wrap', mt: 1 }}
                                >
                                    {item.rawText}
                                </Typography>
                            </details>
                        </Box>

                        <Box mt={2}>
                            <Button
                                size="small"
                                variant="outlined"
                                href={`/api/download-txt?id=${item.id}`}
                            >
                                Download .txt
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
