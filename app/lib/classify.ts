
import OpenAI from 'openai'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
export async function classifyMessage(text: string): Promise<{ principal?: string; relationship?: string; }> {
  if (!process.env.OPENAI_API_KEY) return {}
  const prompt = `You will label a short message with principal (GENUINE) and relationship (spouse/partner, friend, manager, colleague, family, client, other). Return JSON only: {"principal":"...", "relationship":"..."}`
  try {
    const r = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [{ role: 'user', content: `${prompt}\nMessage: ${text}` }],
      temperature: 0
    })
    const raw = r.choices?.[0]?.message?.content || "{}"
    const j = JSON.parse(raw.replace(/```json|```/g,''))
    return { principal: j.principal, relationship: j.relationship }
  } catch { return {} }
}
