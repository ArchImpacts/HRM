
import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';
import { hasFeature } from '../../../lib/entitlements';
import { canUseChat } from '../../../lib/quotas';
import { classifyMessage } from '../../../lib/classify';
import { searchCorpus } from '../../../lib/rag';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const body = await req.json();
  const messages = body.messages || [];
  let conversationId: string | undefined = body.conversationId || undefined;

  const okChat = await canUseChat(user.id);
  if (!okChat) return new Response('Chat quota reached.', { status: 402 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (profile?.trackOptIn) {
    if (!conversationId) {
      const c = await prisma.conversation.create({ data: { userId: user.id } });
      conversationId = c.id;
    }
    const lastUser = [...messages].reverse().find((m:any)=>m.role==='user');
    if (lastUser) {
      const rec = await prisma.message.create({ data: { conversationId, role: 'user', text: String(lastUser.content).slice(0, 4000) } });
      const labels = await classifyMessage(String(lastUser.content));
      const entries = Object.entries(labels).filter(([,v])=>!!v).map(([k,v])=>({ key:k, value:String(v) }));
      if (entries.length) await prisma.messageTag.createMany({ data: entries.map(t=>({ messageId: rec.id, ...t })) });
    }
  }

  const userQ = (messages[messages.length-1]?.content || '').toString();
  const canRag = await hasFeature(user.id, 'rag_search');
  const hits = (userQ && canRag) ? await searchCorpus(userQ, 6) : [];
  const context = hits.map((h,i)=>`[${i+1}] ${h.title}${h.url?` (${h.url})`:''}\n${h.content}`).join('\n\n');
  const citeNote = hits.length ? `\n\nSOURCES:\n${hits.map((h,i)=>`[${i+1}] ${h.title}${h.url?` (${h.url})`:''}`).join('\n')}` : '';

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const sys = `You are the GENUINE™ Relationship Coach. Warm, encouraging, non-judgmental. Be concise and actionable. If context sources are provided, cite them inline as [1], [2], etc., and end with a SOURCES list.`;
  const r = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1',
    messages: [
      { role: 'system', content: sys },
      ...(context ? [{ role: 'system', content: `Context (use if relevant):\n\n${context}${citeNote}` }] as any[] : []),
      ...messages.map((m:any)=>({ role:m.role, content:String(m.content) }))
    ]
  });
  const text = r.choices?.[0]?.message?.content || '';

  if (profile?.trackOptIn && conversationId && text.trim()) {
    const am = await prisma.message.create({ data: { conversationId, role: 'assistant', text: text.slice(0, 10000) } });
    try {
      const labels = await classifyMessage(text.slice(0, 4000));
      if (labels?.principal) await prisma.messageTag.create({ data: { messageId: am.id, key: 'principal_reply', value: String(labels.principal) } });
    } catch {}
  }

  const headers:Record<string,string> = { 'Content-Type': 'application/json' };
  if (conversationId) headers['X-Conversation-Id'] = conversationId;
  return new Response(JSON.stringify({ text }), { status: 200, headers });
}
