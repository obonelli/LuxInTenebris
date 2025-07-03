import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';       // ← cambio clave

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    try {
        const uint8 = new Uint8Array(await file.arrayBuffer());      // Buffer también sirve
        const { text } = await pdfParse(uint8);                      // ← extrae texto
        return NextResponse.json({ text });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }
}
