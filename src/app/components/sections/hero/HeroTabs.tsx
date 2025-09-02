import { Tabs, Tab } from '@mui/material';
import type { Feature } from './data';

type Props = {
    value: Feature['key'];
    onChange: (v: Feature['key']) => void;
    baseColor: string;
    accentColor: string;
};

export default function HeroTabs({ value, onChange, baseColor, accentColor }: Props) {
    return (
        <Tabs
            value={value}
            onChange={(_, v) => onChange(v as Feature['key'])}
            aria-label="hero feature tabs"
            variant="scrollable"
            TabIndicatorProps={{ sx: { display: 'none' } }}
            sx={{
                '& .MuiTab-root': {
                    textTransform: 'none',
                    color: 'rgba(235,235,255,0.82)',
                    borderRadius: 999,
                    px: 2,
                    mx: 0.25,
                    minHeight: 36,
                    fontWeight: 700,
                },
                '& .Mui-selected': {
                    color: baseColor,
                    background:
                        'linear-gradient(90deg, rgba(124,77,255,.25), rgba(124,77,255,.18))',
                    border: '1px solid rgba(124,77,255,.45)',
                    boxShadow: `0 0 20px ${accentColor}40 inset`,
                },
            }}
        >
            <Tab value="matching" label="AI‑Powered Matching" />
            <Tab value="pool" label="Global Talent Pool" />
            <Tab value="screening" label="Technical Screening" />
        </Tabs>
    );
}
