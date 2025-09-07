// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import OpenAI from 'openai';
import { saveCVHistory } from '@/lib/cvHistory';

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o';

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

const chatWith = (openai: OpenAI, model: string, prompt: string) =>
    openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

function extractSection(label: string, text: string) {
    const rg = new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(\\n\\n|$)`, 'i');
    const m = text.match(rg);
    return m?.[1]?.trim();
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cvText, targetRole, userNote } = await req.json();

        if (!cvText || !targetRole) {
            return NextResponse.json(
                { error: 'Missing CV text or target role' },
                { status: 400 },
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                {
                    ok: false,
                    reason: 'AI analysis disabled: set OPENAI_API_KEY to enable feedback.',
                    suggestions: [],
                },
                { status: 200 },
            );
        }

        const openai = new OpenAI({ apiKey });

        const noteSection = userNote
            ? `\nThe mentee adds the following context (address this first):\n"""\n${userNote}\n"""\n`
            : '';

        const greeting = getGreeting();

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

        try {
            const completion = await chatWith(openai, DEFAULT_MODEL, prompt);
            const feedback = completion.choices[0]?.message?.content ?? '';

            const summary =
                extractSection('Brief Snapshot', feedback) ??
                extractSection('Brief snapshot', feedback) ??
                null;
            const motivationalClose =
                extractSection('Motivational Close', feedback) ??
                extractSection('Motivational close', feedback) ??
                null;

            await saveCVHistory({
                userId: session.user.id as string,
                summary,
                motivationalClose,
                rawText: feedback,
                source: 'api.analyze',
            });

            return NextResponse.json({ feedback }, { status: 200 });
        } catch (err: any) {
            if (
                (err?.status === 429 || err?.code === 'insufficient_quota') &&
                DEFAULT_MODEL !== 'gpt-3.5-turbo'
            ) {
                const fallback = await chatWith(openai, 'gpt-3.5-turbo', prompt);
                const feedback = fallback.choices[0]?.message?.content ?? '';

                const summary =
                    extractSection('Brief Snapshot', feedback) ??
                    extractSection('Brief snapshot', feedback) ??
                    null;
                const motivationalClose =
                    extractSection('Motivational Close', feedback) ??
                    extractSection('Motivational close', feedback) ??
                    null;

                await saveCVHistory({
                    userId: session.user.id as string,
                    summary,
                    motivationalClose,
                    rawText: feedback,
                    source: 'api.analyze(downgraded)',
                });

                return NextResponse.json({ feedback, downgraded: true }, { status: 200 });
            }

            console.error('[OpenAI]', err);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } catch (parseErr) {
        console.error('[analyze] bad body', parseErr);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
