'use client';

import { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

interface Props {
    open: boolean;
    onClose: () => void;
    feedbackHtml: string;
    onDownload: () => void;
}

export default function CVFeedbackModal({
    open,
    onClose,
    feedbackHtml,
    onDownload,
}: Props) {
    const [fullScreen, setFullScreen] = useState(false);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll="paper"
            fullWidth
            maxWidth="md"
            fullScreen={fullScreen}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'primary.main',
                    fontWeight: 700,
                }}
            >
                Feedback
                <IconButton size="small" onClick={() => setFullScreen((v) => !v)}>
                    {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    display: 'flex',
                    gap: 3,
                    maxHeight: fullScreen ? '100vh' : '60vh',
                    // 💅 subtítulos llamativos + línea separadora
                    '& .sectionTitle': {
                        color: 'primary.main',
                        fontWeight: 700,
                        marginTop: 3,
                        paddingBottom: 0.5,
                        borderBottom: '2px solid',
                        borderColor: 'secondary.main',
                    },
                    '& .feedbackHeading': { color: 'secondary.main', fontWeight: 600 },
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#7c4dff',
                        borderRadius: 4,
                    },
                }}
            >
                <Box flex="0 0 120px" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                        component="img"
                        src="/coach-aurora.png"
                        alt="Coach Aurora"
                        sx={{
                            width: 110,
                            height: 110,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid',
                            borderColor: 'secondary.main',
                        }}
                    />
                </Box>

                <Box flex="1 1 auto" sx={{ overflowY: 'auto', pr: 1 }}>
                    <Typography
                        component="div"
                        sx={{ whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: feedbackHtml }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onDownload} color="secondary" variant="outlined">
                    Download .txt
                </Button>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
