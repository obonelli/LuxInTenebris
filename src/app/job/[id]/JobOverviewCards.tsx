'use client';

import { Card, CardContent, Typography, Divider, Stack, Box } from '@mui/material';
import Grid from '@mui/material/Grid'; // v7 API (size prop)
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';

type Props = { description: string };

// Split markdown by "## ..." headings
function splitSections(md: string) {
    const lines = md.split('\n');
    const sections: Record<string, string[]> = {};
    let current = 'Description';
    sections[current] = [];

    for (const line of lines) {
        const m = line.match(/^##\s+(.+?)\s*$/);
        if (m) {
            current = m[1].trim();
            if (!sections[current]) sections[current] = [];
            continue;
        }
        sections[current].push(line);
    }
    return Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.join('\n').trim()]));
}

const TITLE_ICON: Record<string, React.ReactNode> = {
    Description: <DescriptionRoundedIcon />,
    Overview: <DescriptionRoundedIcon />,
    'Job Overview': <DescriptionRoundedIcon />,
    Responsibilities: <ChecklistRoundedIcon />,
    'Must have': <WorkspacePremiumRoundedIcon />,
    'Must Have': <WorkspacePremiumRoundedIcon />,
    'Qualifications — Must have': <WorkspacePremiumRoundedIcon />,
    'Nice to have': <StarBorderRoundedIcon />,
    Benefits: <StarBorderRoundedIcon />,
    'Additional Information': <InfoRoundedIcon />,
    'About the Company': <CorporateFareRoundedIcon />,
    'Interview Stages': <TimelineRoundedIcon />,
};

function SectionCard({ title, content }: { title: string; content: string }) {
    if (!content?.trim()) return null;
    return (
        <Card
            variant="outlined"
            sx={{
                background: '#121420',
                borderColor: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(1200px 400px at -10% -10%, rgba(124,77,255,0.09), transparent 40%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ display: 'inline-flex', opacity: 0.9 }}>
                        {TITLE_ICON[title] ?? <DescriptionRoundedIcon />}
                    </Box>
                    <Typography variant="h6">{title}</Typography>
                </Stack>
                <Divider sx={{ my: 1.5, opacity: 0.15 }} />
                <Box sx={{ '& ul': { mt: 0 }, '& p': { mb: 1.1 } }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function JobOverviewCards({ description }: Props) {
    const sections = splitSections(description);

    // Order priority; unknown titles go last.
    const ORDER = [
        'Description',
        'Overview',
        'Job Overview',
        'Responsibilities',
        'Qualifications — Must have',
        'Must Have',
        'Must have',
        'Nice to have',
        'Benefits',
        'Additional Information',
        'About the Company',
        'Interview Stages',
    ];

    const ordered: [string, string][] = ORDER
        .flatMap((k) => (sections[k] ? [[k, sections[k]] as [string, string]] : []))
        .concat(Object.entries(sections).filter(([k]) => !ORDER.includes(k)));

    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            {ordered.map(([title, content]) => (
                <Grid key={title} size={{ xs: 12 }}>
                    <SectionCard title={title} content={content} />
                </Grid>
            ))}
        </Grid>
    );
}
