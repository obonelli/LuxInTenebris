'use client';

import { Box } from '@mui/material';
import { toAlpha } from './utils';

const TECH_COLORS: Record<string, string> = {
    typescript: '#3178C6',
    react: '#61DAFB',
    'node-js': '#68A063',
    net: '#5C2D91',
    mui: '#7C4DFF',
    'sql-server': '#E74856',
    nosql: '#7F5AF0',
    microservices: '#9B59B6',
    iam: '#00C2FF',
    auth0: '#EB5424',
    okta: '#007DC1',
    keycloak: '#5B6BBF',
    'azure-ad': '#0078D4',
    'oauth-2-0': '#F4B400',
    'openid-connect': '#00D084',
    mfa: '#FF5F6D',
    rbac: '#C58CFF',
};

function slugifyUI(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function TechPill({ name, slug }: { name: string; slug?: string }) {
    const s = (slug || slugifyUI(name)) as string;
    const color = TECH_COLORS[s] || 'rgba(230,231,255,0.9)';

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.1,
                py: 0.45,
                borderRadius: 999,
                fontSize: 13,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 0.2,
                color: 'rgba(235,235,255,0.95)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                transition: 'transform .15s ease, border-color .15s ease, background .15s ease',
                cursor: 'default',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    borderColor: 'rgba(124,77,255,0.45)',
                    background: 'rgba(255,255,255,0.06)',
                },
            }}
            title={name}
        >
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: `0 0 0 2px ${toAlpha(color, 0.18)}`,
                }}
            />
            {name}
        </Box>
    );
}
