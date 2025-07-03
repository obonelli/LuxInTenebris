import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o';

// ─── Helper ─────────────────────────────────────────────────────────────
const chatWith = (model: string, prompt: string) =>
    openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

// ─── POST /api/analyze ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const { cvText, targetRole } = await req.json();

        if (!cvText || !targetRole) {
            return NextResponse.json(
                { error: 'Missing CV text or target role' },
                { status: 400 },
            );
        }

        // ─── Prompt v2 ─────────────────────────────────────────────────────
        const prompt = `
You are **Coach Aurora**, a seasoned career mentor (15 + years) known for
giving honest yet encouraging feedback.

Review the résumé below for a **“${targetRole}”** application and deliver:

1. **Brief snapshot** (2 – 3 sentences): highlight their unique value & tone-set.
2. **Five standout strengths**
   • Quote specific evidence from the résumé (metrics, keywords, results).
3. **Three frank growth opportunities**
   • For each, explain *why it matters* for ${targetRole}.
   • Include one clear fix (“Add X metric”, “Reorder Y section”, etc.).
4. **STAR bullets (2 – 3)** — one bullet each, formatted **exactly**:

   • *Situation:* …
   • *Task:* …
   • *Action:* …
   • *Result:* …

   (No text on the same line; four separate lines per bullet.)
5. **Motivational close** (1 sentence) — upbeat but realistic.

Be warm and human, but do **not** sugar-coat weaknesses; the mentee wants the truth to improve quickly.

Résumé ↓↓↓
------------
${cvText}
------------
`.trim();
        // ── First call ─────────────────────────────────────────────────────
        try {
            const completion = await chatWith(DEFAULT_MODEL, prompt);
            const feedback = completion.choices[0]?.message?.content ?? '';
            return NextResponse.json({ feedback });
        } catch (err: unknown) {
            const e = err as { status?: number; code?: string };

            // Downgrade if cuota agotada
            if (
                (e.status === 429 || e.code === 'insufficient_quota') &&
                DEFAULT_MODEL !== 'gpt-3.5-turbo'
            ) {
                const fallback = await chatWith('gpt-3.5-turbo', prompt);
                const feedback = fallback.choices[0]?.message?.content ?? '';
                return NextResponse.json({ feedback, downgraded: true });
            }

            console.error('[OpenAI]', err);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } catch (parseErr) {
        console.error('[analyze] bad body', parseErr);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
