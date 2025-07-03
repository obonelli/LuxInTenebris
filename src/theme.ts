import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
        primary: {
            main: '#2979ff',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
});

export default theme;
