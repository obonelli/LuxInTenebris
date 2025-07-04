import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o';

// ─── Helper para hora local (CST) ───────────────────────────────────────
const getGreeting = () => {
    const hour = Number(
        new Date().toLocaleString('en-US', {
            timeZone: 'America/Mexico_City',
            hour: 'numeric',
            hour12: false,
        }),
    );
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

// ─── Helper OpenAI ──────────────────────────────────────────────────────
const chatWith = (model: string, prompt: string) =>
    openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

// ─── POST /api/analyze ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const { cvText, targetRole, userNote } = await req.json();

        if (!cvText || !targetRole) {
            return NextResponse.json(
                { error: 'Missing CV text or target role' },
                { status: 400 },
            );
        }

        // Nota extra del usuario (opcional)
        const noteSection = userNote
            ? `
The mentee adds the following context (address this first):
"""
${userNote}
"""
`
            : '';

        const greeting = getGreeting();

        // ─── Prompt v5 ─────────────────────────────────────────────────────
        const prompt = `
You are **Coach Aurora**, a seasoned career mentor with 15+ years of experience, known for honest yet encouraging feedback.

Begin with a warm but professional greeting that respects the current time **and addresses the candidate by their first name**.
• Extract the most likely first name from the résumé header/contact section; if uncertain, use a neutral “there”.
• Use exactly this structure (replace the placeholder):
**"${greeting}, <first-name>. I'm Coach Aurora."**

${noteSection}
Review the résumé below for a **“${targetRole}”** application and deliver:

1. **Brief Snapshot:** (2 – 3 sentences) highlight their unique value & set the tone.
2. **Five Standout Strengths**
   • Quote specific evidence from the résumé (metrics, keywords, results).
3. **Three Frank Growth Opportunities**
   • For each, explain *why it matters* for ${targetRole}.
   • Include one clear fix (“Add X metric”, “Reorder Y section”, etc.).
4. **STAR Bullets (2 – 3)** — one bullet each, formatted **exactly**:

   • *Situation:* …
   • *Task:* …
   • *Action:* …
   • *Result:* …

   (Put each label on its own line; no text on the same line as the label.)

5. **Motivational Close** — one sentence only.
   • Start a new line with the exact label **"Motivational Close:"** (colon included).
   • Write the single upbeat but realistic sentence immediately after.

Be warm and human, but do **not** sugar-coat weaknesses; the mentee wants the truth to improve quickly.

Résumé ↓↓↓
------------
${cvText}
------------
`.trim();

        // ─── Llamada OpenAI ────────────────────────────────────────────────
        try {
            const completion = await chatWith(DEFAULT_MODEL, prompt);
            const feedback = completion.choices[0]?.message?.content ?? '';
            return NextResponse.json({ feedback });
        } catch (err: unknown) {
            const e = err as { status?: number; code?: string };

            // Downgrade automático si se agota la cuota
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
