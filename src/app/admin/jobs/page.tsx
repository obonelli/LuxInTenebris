'use client';

import { useState } from 'react';
import { Box, Button, Container, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

export default function AdminJobs() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        salaryMin: '',
        salaryMax: '',
        currency: 'USD',
        seniority: 'SENIOR',
        workingScheme: 'REMOTE',
        englishLevel: 'C1',
        location: 'LATAM',
        provider: 'Ryscode',
        technologies: 'react,typescript',
    });

    const onChange = (k: string, v: any) => setForm(s => ({ ...s, [k]: v }));

    const submit = async () => {
        const res = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
                salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
                technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
            }),
        });
        alert(res.ok ? 'Created!' : 'Error');
    };

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="md">
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Create Job</Typography>
                <Stack spacing={2}>
                    <TextField label="Title" value={form.title} onChange={e => onChange('title', e.target.value)} />
                    <TextField label="Description" multiline minRows={4} value={form.description} onChange={e => onChange('description', e.target.value)} />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}><TextField label="Salary Min" value={form.salaryMin} onChange={e => onChange('salaryMin', e.target.value)} /></Grid>
                        <Grid size={{ xs: 12, sm: 4 }}><TextField label="Salary Max" value={form.salaryMax} onChange={e => onChange('salaryMax', e.target.value)} /></Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Select fullWidth value={form.currency} onChange={e => onChange('currency', e.target.value)}>
                                <MenuItem value="USD">USD</MenuItem>
                                <MenuItem value="MXN">MXN</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Select fullWidth value={form.seniority} onChange={e => onChange('seniority', e.target.value)}>
                                {['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'STAFF', 'LEAD', 'PRINCIPAL'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Select fullWidth value={form.workingScheme} onChange={e => onChange('workingScheme', e.target.value)}>
                                {['ONSITE', 'HYBRID', 'REMOTE'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Select fullWidth value={form.englishLevel} onChange={e => onChange('englishLevel', e.target.value)}>
                                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </Grid>
                    </Grid>
                    <TextField label="Location" value={form.location} onChange={e => onChange('location', e.target.value)} />
                    <TextField label="Provider" value={form.provider} onChange={e => onChange('provider', e.target.value)} />
                    <TextField label="Technologies (slugs separados por coma)" value={form.technologies} onChange={e => onChange('technologies', e.target.value)} />
                    <Button variant="contained" onClick={submit}>Create</Button>
                </Stack>
            </Container>
        </Box>
    );
}
