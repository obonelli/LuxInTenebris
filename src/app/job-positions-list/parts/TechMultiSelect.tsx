'use client';

import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type Props = {
    value: string[];
    onChange: (v: string[]) => void;
    options: string[];
};

export function TechMultiSelect({ value, onChange, options }: Props) {
    return (
        <FormControl fullWidth>
            <InputLabel>Technologies (slug)</InputLabel>
            <Select
                multiple
                value={value}
                label="Technologies (slug)"
                onChange={(e) => onChange(e.target.value as string[])}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((v) => {
                            const remove = () => onChange((selected as string[]).filter((x) => x !== v));
                            return (
                                <Chip
                                    key={v}
                                    label={v}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        remove();
                                    }}
                                    onDelete={() => remove()}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                        color: '#E6E7FF',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'rgba(255,255,255,0.55)',
                                            '&:hover': { color: 'rgba(255,255,255,0.85)' },
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            maxHeight: 280,
                            bgcolor: '#0E1016',
                            border: '1px solid rgba(255,255,255,0.08)',
                            '&::-webkit-scrollbar': { width: 8 },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(124,77,255,0.4)',
                                borderRadius: 4,
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: 'rgba(124,77,255,0.7)',
                            },
                        },
                    },
                }}
            >
                {options.map((s) => (
                    <MenuItem key={s} value={s}>
                        {s}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
