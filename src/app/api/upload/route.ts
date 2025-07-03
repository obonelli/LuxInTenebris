import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

// 🔑  Importamos el worker y obtenemos su URL como string
//     (el sufijo ?url hace que Next/webpack lo exporte como ruta/asset).
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.js?url';

// Tipos para evitar any
import type {
    TextItem,
    TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api';

// ─── Next.js runtime flags ───────────────────────────────────────────────
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // s

// Indicamos a pdfjs dónde está el worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// ─── Handler POST /api/upload ────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (file.size > 4_500_000) {
            return NextResponse.json(
                { error: 'PDF too large (4.5 MB limit)' },
                { status: 413 },
            );
        }

        const uint8 = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;

        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const contents = await page.getTextContent();

            text += contents.items
                .map((it: TextItem | TextMarkedContent) => ('str' in it ? it.str : ''))
                .join(' ') + '\n';
        }

        return NextResponse.json({ text });
    } catch (err: unknown) {
        console.error('[upload] parse error:', err);
        return NextResponse.json(
            { error: 'Failed to parse PDF' },
            { status: 500 },
        );
    }
}
