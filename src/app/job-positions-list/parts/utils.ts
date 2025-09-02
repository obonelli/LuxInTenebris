export function toAlpha(color: string, alpha: number = 0.2): string {
    const a = Math.max(0, Math.min(1, alpha));
    if (!color) return `rgba(255,255,255,${a})`;

    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        let r: number, g: number, b: number;
        if (hex.length === 3 || hex.length === 4) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6 || hex.length === 8) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        } else {
            return `rgba(255,255,255,${a})`;
        }
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    const m = color.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)/i);
    if (m) {
        const r = Math.min(255, parseInt(m[1], 10));
        const g = Math.min(255, parseInt(m[2], 10));
        const b = Math.min(255, parseInt(m[3], 10));
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return `rgba(255,255,255,${a})`;
}
