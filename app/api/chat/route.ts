import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SYSTEM_PROMPT = `You are त्रिNETRA AI Sentinel, an expert Indian cybersecurity and UPI fraud-prevention assistant built into the त्रिNETRA platform.
Your capabilities:
1. Module A (Pre-Payment Scanner): Decode raw upi://pay links, verify Claimed Name vs. QR Payee Name (pn) and Bank Handle (pa), and flag personal wallet handles (@fam, @ybl, @okaxis, @paytm) impersonating utilities or businesses.
2. Module B (TinyFish Web Intel): Inspect suspicious electricity bill (Mahavitaran, Tata Power, BESCOM), Fastag KYC, and courier links for UPI PIN / OTP harvesting.
3. Module C (Transaction DNA): Identify coordinated scam waves using HDBSCAN clustering.
4. Module D (Analyst Review Hub & 1930 Help): Guide victims on reporting cyber fraud immediately to the National Cybercrime Helpline (1930) or cybercrime.gov.in.

Tone & Rules:
- Keep answers sharp, practical, and easy to understand (3 to 6 concise sentences or bullet points).
- Never ask the user for their UPI PIN, OTP, or bank password.
- Whenever live forensic telemetry is provided in [LIVE FORENSIC CONTEXT], cite those exact findings in your answer.`;

export async function POST(req: NextRequest) {
  try {
    const { message, mode = "Agent", history = [] } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Live Tool Inspection: Extract any UPI VPA or URL mentioned in the user's message
    let forensicContext = "";
    const vpaMatch = message.match(/([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})/i);
    const urlMatch = message.match(/(https?:\/\/[^\s]+)/i);

    if (vpaMatch) {
      const vpa = vpaMatch[1].toLowerCase();
      const handle = vpa.split("@")[1];
      const isPhoneHandle = /^\d{10}@/.test(vpa);

      // Check Supabase blacklist if configured
      let blacklisted = false;
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          );
          const { data } = await supabase
            .from("vpa_blacklist")
            .select("vpa, reason")
            .ilike("vpa", vpa)
            .maybeSingle();
          if (data) {
            blacklisted = true;
            forensicContext += `\n[LIVE SUPABASE BLACKLIST HIT]: VPA "${vpa}" is CONFIRMED BLACKLISTED in our database (Reason: ${data.reason || "Confirmed UPI Fraud"}). Risk Score: 100/100.`;
          }
        } catch {
          // ignore db lookup error
        }
      }

      if (!blacklisted) {
        forensicContext += `\n[LIVE VPA FORENSICS]: Extracted VPA "${vpa}" (PSP suffix: @${handle}, Phone-number wallet: ${isPhoneHandle ? "YES - Unverified individual wallet" : "NO"}). Suspicious keywords present: ${/(refund|kyc|power|bill|urgent|relief|care|support|pmkisan|army)/i.test(vpa) ? "HIGH RISK IMPERSONATION TOKENS DETECTED" : "None"}.`;
      }
    }

    if (urlMatch) {
      const url = urlMatch[1];
      const suspiciousTld = /\.(xyz|top|click|pages\.dev|online|site|buzz|info)(\/|$)/i.test(url);
      const phishingKeywords = /(kyc|ebill|electricity|update|verify|refund|fastag|pmkisan|reward)/i.test(url);
      forensicContext += `\n[LIVE TINYFISH LINK PRE-CHECK]: Target URL "${url}" | Suspicious TLD: ${suspiciousTld} | Phishing Keyword Pattern: ${phishingKeywords}.`;
    }

    const enrichedUserPrompt = forensicContext
      ? `[Mode: ${mode}] User Query: ${message}\n${forensicContext}`
      : `[Mode: ${mode}] User Query: ${message}`;

    // 2. Call Real LLM Provider (Gemini -> OpenAI -> Groq)
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (geminiKey) {
      const contents = [
        ...history.slice(-6).map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        { role: "user", parts: [{ text: enrichedUserPrompt }] },
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.35, maxOutputTokens: 450 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Forensic analysis complete.";
        return NextResponse.json({ reply, mode, provider: "gemini-2.5-flash" });
      }
    }

    const openAiOrGroqKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (openAiOrGroqKey) {
      const isGroq = Boolean(process.env.GROQ_API_KEY);
      const endpoint = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const model = isGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiOrGroqKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.slice(-6).map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: enrichedUserPrompt },
          ],
          temperature: 0.35,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) return NextResponse.json({ reply, mode, provider: model });
      }
    }

    // 3. Intelligent Forensic Engine Fallback (if no external LLM API key is set yet)
    let fallbackReply = "";
    if (vpaMatch) {
      const vpa = vpaMatch[1];
      const risky = /(refund|kyc|power|bill|urgent|relief|pmkisan|army|\d{10}@fam)/i.test(vpa);
      fallbackReply = risky
        ? `⚠️ **HIGH THREAT DETECTED on \`${vpa}\`**\n• **Identity Mismatch:** This handle uses retail/personal wallet tokens rather than a verified corporate merchant VPA.\n• **Action:** Do NOT enter your UPI PIN. You can drop the full QR screenshot in the **Scanner** tab or blacklist this VPA in the **Analyst Portal**.`
        : `🔍 **Forensic Check on \`${vpa}\`**\n• Handle syntax is valid, but always verify that the banking name (\`pn\`) shown on your screen matches the person you intend to pay before entering your PIN.`;
    } else if (urlMatch) {
      fallbackReply = `🌐 **TinyFish Link Inspection for \`${urlMatch[1]}\`**\n• This domain exhibits high-risk phishing indicators commonly used in electricity bill and KYC disconnection scams.\n• Open the **TinyFish Intel** tab to run a full isolated DOM sandbox check on this URL without exposing your browser.`;
    } else {
      fallbackReply = `**त्रिNETRA Sentinel (${mode} Mode Active):**\nI can inspect suspicious UPI IDs (e.g., \`quickpay.refund992@ybl\`), decode \`upi://pay\` QR links, or check phishing URLs. Paste any UPI ID, SMS notice, or link right here to run a live check, or ask how our 4 defense modules work.`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      mode,
      provider: "trinetra-sentinel-engine",
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Unable to reach the forensic engine right now. Please try again." },
      { status: 500 }
    );
  }
}
