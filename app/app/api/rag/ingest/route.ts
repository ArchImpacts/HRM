
import { NextRequest } from 'next/server';
import { requireAdmin } from '../../../../lib/auth';
import { ingestDoc } from '../../../../lib/rag';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  await requireAdmin();
  const body = await req.json();
  const docs = Array.isArray(body?.docs) ? body.docs : [body];
  const results = [];
  for (const d of docs) {
    if (!d?.title || !d?.text) continue;
    const r = await ingestDoc({ title: String(d.title), url: d.url ? String(d.url) : undefined, text: String(d.text), meta: d.meta || undefined });
    results.push(r);
  }
  return Response.json({ ok: true, results }, { status: 200 });
}
