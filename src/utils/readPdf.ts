'use client';

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type {
    TextItem,
    TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// type-guard para distinguir los ítems que sí traen texto
function isTextItem(
    item: TextItem | TextMarkedContent,
): item is TextItem {
    return 'str' in item;
}

export async function extractTextFromPdf(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                const typedArray = new Uint8Array(reader.result as ArrayBuffer);
                const pdf = await getDocument({ data: typedArray }).promise;

                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();

                    const pageText = content.items
                        .filter(isTextItem)               // descarta marcas sin texto
                        .map((item) => item.str)
                        .join(' ');

                    text += pageText + '\n';
                }

                resolve(text);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}
