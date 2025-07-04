'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
    Alert,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import CVFeedbackModal from './CVFeedbackModal';

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
    const [userNote, setUserNote] = useState(''); // NUEVO
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false); // analizar CV
    const [uploading, setUploading] = useState(false); // leer PDF
    const [openModal, setOpenModal] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const MAX_FILE_SIZE = 4_500_000; // 4.5 MB

    // ───────── Cool-down timer ─────────
    useEffect(() => {
        if (!cooldown) return;
        const id = setInterval(() => setCooldown((s) => Math.max(s - 1, 0)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    // markdown → html
    const formattedFeedback = useMemo(() => {
        return feedback
            // ### ...
            .replace(/^### (.*)$/gm, '<h3 class="sectionTitle">$1</h3>')
            // “STAR Bullets:”, “Motivational Close:”, etc.
            .replace(/^([\w\s]+?):$/gm, '<h3 class="sectionTitle">$1</h3>')
            // “1. Brief Snapshot:”  (sólo si termina en ‘:’)
            .replace(/^\d+\.\s+([\w\s]+?):$/gm, '<h3 class="sectionTitle">$1</h3>')
            // negritas dentro del texto
            .replace(/\*\*(.*?)\*\*/g, '<span class="feedbackHeading">$1</span>');
    }, [feedback]);


    // ───────── Upload handler ─────────
    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert(
                '📄 El PDF supera el límite de 4.5 MB permitido. Por favor sube un archivo más ligero.',
            );
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        setUploading(false);

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

    // ───────── Analyze handler ─────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cvText || cooldown) return;

        setLoading(true);
        setFeedback('');
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cvText, targetRole, userNote }),
        });
        const data = await res.json();
        setLoading(false);

        setFeedback(res.ok ? data.feedback : data.error || 'Error');
        setOpenModal(true);
        setCooldown(30);
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

    // ───────── UI ─────────
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* Backdrop mientras se lee el PDF */}
            <Backdrop open={uploading} sx={{ zIndex: theme.zIndex.modal + 1 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Reading PDF…</Typography>
            </Backdrop>

            <Container
                maxWidth="sm"
                sx={{ mt: 14, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Typography variant="h4" gutterBottom color="primary" sx={{ textAlign: 'center' }}>
                    CV Reviewer
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}
                >
                    {/* Upload */}
                    <Button
                        variant="outlined"
                        component="label"
                        color="primary"
                        disabled={uploading || loading}
                    >
                        Upload PDF
                        <input
                            type="file"
                            hidden
                            accept="application/pdf"
                            onChange={handlePdfUpload}
                            ref={fileInputRef}
                        />
                    </Button>

                    {/* Archivo cargado */}
                    {fileName && (
                        <Alert
                            severity="success"
                            action={
                                <IconButton size="small" color="inherit" onClick={handleClearFile}>
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            ✅ {fileName} loaded and ready to analyze
                        </Alert>
                    )}

                    {/* Rol objetivo */}
                    <FormControl fullWidth disabled={uploading || loading}>
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

                    {/* Nota opcional para Coach Aurora */}
                    <TextField
                        label="Message to Coach Aurora (optional)"
                        multiline
                        minRows={3}
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="e.g. I'm applying to Company X as a Y. Please focus on ..."
                        disabled={uploading || loading}
                    />

                    {/* Botón de análisis */}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || uploading || !cvText || cooldown > 0}
                    >
                        {loading ? <CircularProgress size={24} /> : cooldown ? `Wait ${cooldown}s` : 'Analyze CV'}
                    </Button>

                    {/* Mostrar feedback si ya existe */}
                    {feedback && !openModal && (
                        <Button variant="outlined" color="secondary" onClick={() => setOpenModal(true)}>
                            Show Feedback
                        </Button>
                    )}
                </Box>

                {/* Modal de feedback */}
                <CVFeedbackModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    feedbackHtml={formattedFeedback}
                    onDownload={handleDownload}
                />
            </Container>
        </ThemeProvider>
    );
}
