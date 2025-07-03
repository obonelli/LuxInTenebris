'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    ThemeProvider,
    Typography,
    createTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Lux in Tenebris: dark + neon purples
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#7c4dff' },
        secondary: { main: '#c158ff' },
    },
});

export default function CVReviewerForm() {
    const [cvText, setCvText] = useState('');
    const [fileName, setFileName] = useState('');
    const [targetRole, setTargetRole] = useState('Frontend');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // cooldown timer
    useEffect(() => {
        if (!cooldown) return;
        const id = setInterval(() => setCooldown((s) => Math.max(s - 1, 0)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    // markdown-like formatting → HTML
    const formattedFeedback = useMemo(() => {
        let html = feedback;
        // ###+ headings
        html = html.replace(
            /^### (.*)$/gm,
            '<h3 class="sectionTitle">$1</h3>',
        );
        // **bold** highlights
        html = html.replace(
            /\*\*(.*?)\*\*/g,
            '<span class="feedbackHeading">$1</span>',
        );
        return html;
    }, [feedback]);

    // upload handler
    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (res.ok) {
            setCvText(data.text);
            setFileName(file.name);
            setFeedback('');
        } else {
            setCvText('');
            setFileName('');
            alert(data.error || 'Failed to read PDF');
        }
    };

    // analyze handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cvText || cooldown) return;

        setLoading(true);
        setFeedback('');

        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cvText, targetRole }),
        });
        const data = await res.json();
        setFeedback(res.ok ? data.feedback : data.error || 'Error');
        setLoading(false);
        setOpenModal(true);
        setCooldown(30); // 30-second cooldown
    };

    const handleDownload = () => {
        const blob = new Blob([feedback], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName || 'cv'}-feedback.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClearFile = () => {
        setFileName('');
        setCvText('');
        setFeedback('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // render
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                maxWidth="sm"
                sx={{
                    mt: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom color="primary" sx={{ textAlign: 'center' }}>
                    CV Reviewer
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}
                >
                    <Button variant="outlined" component="label" color="primary">
                        Upload PDF
                        <input
                            type="file"
                            hidden
                            accept="application/pdf"
                            onChange={handlePdfUpload}
                            ref={fileInputRef}
                        />
                    </Button>

                    {fileName && (
                        <Alert
                            severity="success"
                            action={
                                <IconButton
                                    aria-label="remove file"
                                    size="small"
                                    color="inherit"
                                    onClick={handleClearFile}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            ✅ {fileName} loaded and ready to analyze
                        </Alert>
                    )}

                    <FormControl fullWidth>
                        <InputLabel>Target Role</InputLabel>
                        <Select
                            value={targetRole}
                            label="Target Role"
                            onChange={(e: SelectChangeEvent) => setTargetRole(e.target.value)}
                        >
                            {['Frontend', 'Backend', 'Fullstack', 'Data Analyst', 'DevOps'].map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !cvText || cooldown > 0}
                    >
                        {loading ? <CircularProgress size={24} /> : cooldown ? `Wait ${cooldown}s` : 'Analyze CV'}
                    </Button>

                    {feedback && !openModal && (
                        <Button variant="outlined" color="secondary" onClick={() => setOpenModal(true)}>
                            Show Feedback
                        </Button>
                    )}
                </Box>

                {/* modal */}
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    scroll="paper"
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle color="primary">Feedback</DialogTitle>

                    <DialogContent
                        dividers
                        sx={{
                            maxHeight: '60vh',
                            '& .feedbackHeading': { color: 'secondary.main', fontWeight: 600 },
                            '& .sectionTitle': {
                                marginTop: 2,
                                marginBottom: 1,
                                paddingBottom: 1,
                                borderBottom: '1px solid',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                fontWeight: 700,
                            },
                            '&::-webkit-scrollbar': { width: 8 },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#7c4dff', borderRadius: 4 },
                        }}
                    >
                        <Typography
                            component="div"
                            sx={{ whiteSpace: 'pre-wrap' }}
                            dangerouslySetInnerHTML={{ __html: formattedFeedback }}
                        />
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleDownload} color="secondary" variant="outlined">
                            Download .txt
                        </Button>
                        <Button onClick={() => setOpenModal(false)} variant="contained">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}
