
import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/db';
export const runtime = 'nodejs';
export async function POST(req: NextRequest){
  const b=await req.json(); const token=String(b.token||''); const happened=!!b.happened; const rating=Math.max(1,Math.min(5,Number(b.rating||0))); const notes=b.notes?String(b.notes).slice(0,4000):null;
  const t=await prisma.feedbackToken.findUnique({ where:{ token } });
  if(!t || t.used || new Date(t.expiresAt) < new Date()) return Response.json({ error:'Invalid or expired token' }, {status:400});
  await prisma.interactionFeedback.create({ data:{ interactionId:t.interactionId, happened, rating, notes: notes || undefined } });
  await prisma.feedbackToken.update({ where:{ token }, data:{ used:true } });
  return Response.json({ ok:true }, { status:200 });
}
