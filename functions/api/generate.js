// functions/api/generate.js — Cloudflare Pages Function
// If deploying to Cloudflare Pages instead of Vercel, this file handles the OpenAI proxy.
// Place this file at: functions/api/generate.js (relative to project root)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestPost(context) {
  const { request, env } = context

  if (!env.OPENAI_API_KEY) {
    return Response.json(
      { error: 'OPENAI_API_KEY is not configured in Cloudflare environment variables.' },
      { status: 500, headers: corsHeaders }
    )
  }

  try {
    const { systemPrompt, messages } = await request.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    })

    const data = await response.json()
    return Response.json(data, { headers: corsHeaders })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders })
  }
}
