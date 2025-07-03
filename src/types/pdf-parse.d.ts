declare module 'pdf-parse' {
    interface PDFData {
        text: string;
        numpages: number;
        numrender: number;
        metadata: any;
        version: string;
    }
    function pdfParse(data: Buffer | Uint8Array, options?: any): Promise<PDFData>;
    export default pdfParse;
}

declare module 'pdfjs-dist/legacy/build/pdf.js';

declare module 'pdfjs-dist/build/pdf.js';

declare module 'pdf-parse/lib/pdf-parse.js' {
    interface PDFData {
        text: string;
        // puedes añadir más campos si los necesitas (numpages, metadata, etc.)
    }
    export default function pdfParse(
        data: Buffer | Uint8Array,
        options?: Record<string, unknown>
    ): Promise<PDFData>;
}
