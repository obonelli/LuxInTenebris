import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Default model can be overridden in your env vars
const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o';

/**
 * Helper that wraps the OpenAI chat completion call.
 */
const chatWith = (model: string, prompt: string) =>
    openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

export async function POST(req: NextRequest) {
    try {
        // Extract body
        const { cvText, targetRole } = await req.json();

        if (!cvText || !targetRole) {
            return NextResponse.json(
                { error: 'Missing CV text or target role' },
                { status: 400 },
            );
        }

        // Build prompt (versión con “corazón”)
        const prompt = `
You are a warm-hearted, senior career coach with 15 + years helping talented people land their dream roles.
Please review the résumé below as if the candidate were your own mentee applying for a “${targetRole}” position.

1. Open with a short, encouraging overview (2–3 sentences) that shows you understand their unique value.
2. **Five standout strengths** — cite concrete evidence from the résumé.
3. **Three growth opportunities** — explain *why* each matters for this role **and** give a clear, doable fix (e.g. rewrite a bullet, add a metric, reorder a section).
4. Propose 2–3 punchy accomplishment bullets written in STAR format, tailored to the “${targetRole}” position.
5. Finish with a motivational closing line that leaves them confident and inspired.

Be specific, actionable, and human — let them feel you genuinely care about their success.

Résumé:
${cvText}
`.trim();

        // First attempt with the default model
        try {
            const completion = await chatWith(DEFAULT_MODEL, prompt);
            const feedback = completion.choices[0]?.message?.content ?? '';
            return NextResponse.json({ feedback });
        } catch (err: unknown) {
            const e = err as { status?: number; code?: string };
            // If quota/rate-limit error and we're not already on 3.5, retry cheaply
            if (
                (e.status === 429 || e.code === 'insufficient_quota') &&
                DEFAULT_MODEL !== 'gpt-3.5-turbo'
            ) {
                const fallback = await chatWith('gpt-3.5-turbo', prompt);
                const feedback = fallback.choices[0]?.message?.content ?? '';
                return NextResponse.json({ feedback, downgraded: true });
            }

            console.error('OpenAI error:', err);
            return NextResponse.json(
                { error: 'Internal Server Error' },
                { status: 500 },
            );
        }
    } catch (parseErr) {
        console.error('Bad request body:', parseErr);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
