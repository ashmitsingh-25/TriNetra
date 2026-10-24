// Copy to app/api/model-predict/route.ts in your Next.js project.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const base = process.env.MODEL_API_URL;
  if (!base) return NextResponse.json({error: 'MODEL_API_URL is not configured'}, {status: 503});
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({error: 'Invalid JSON'}, {status: 400}); }
  if (typeof body.messageText !== 'string' || !body.messageText.trim() || body.messageText.length > 10000)
    return NextResponse.json({error: 'messageText must contain 1–10000 characters'}, {status: 400});
  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...(process.env.MODEL_API_KEY ? {'X-API-Key': process.env.MODEL_API_KEY} : {})},
      body: JSON.stringify({messageText: body.messageText}),
      signal: AbortSignal.timeout(20000), cache: 'no-store',
    });
    return NextResponse.json(await response.json(), {status: response.status});
  } catch {
    return NextResponse.json({error: 'Model service unavailable. Do not treat this as a low-risk result.'}, {status: 503});
  }
}
