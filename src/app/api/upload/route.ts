import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js'; // <- evita el bug

export const runtime = 'nodejs'; // necesario en Vercel para usar Buffer/Node APIs

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const uint8 = new Uint8Array(await file.arrayBuffer());
        const { text } = await pdfParse(uint8);

        return NextResponse.json({ text });
    } catch (err) {
        console.error('[upload] PDF parse error:', err);
        return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }
}
