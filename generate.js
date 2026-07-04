// api/generate.js — Vercel Serverless Function
// Proxies OpenAI calls. OPENAI_API_KEY stays server-side, never exposed to the browser.

export default async function handler(req, res) {
  // CORS headers (needed so the React frontend can call this API)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { systemPrompt, messages } = req.body

  if (!systemPrompt || !messages) {
    return res.status(400).json({ error: 'Missing systemPrompt or messages' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured in environment variables.' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        response_format: { type: 'json_object' }, // Forces clean JSON output — no markdown, no preamble
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 3000, // Raised from 2000 to comfortably cover clarification follow-ups + longer line-item sets
        temperature: 0.2, // Low temperature = consistent, reliable quotation structure
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenAI error:', data)
      return res.status(response.status).json({
        error: data.error?.message || 'OpenAI API returned an error',
      })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}
