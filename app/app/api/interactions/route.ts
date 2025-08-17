
import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/db';
import { requireFeature } from '../../../lib/featureGuard';
import { sendEmail } from '../../../lib/providers/email';
import { sendSms } from '../../../lib/providers/sms';
import { hasFeature } from '../../../lib/entitlements';
import { canSendSms } from '../../../lib/quotas';
export const runtime = 'nodejs';
export async function POST(req: NextRequest){
  const u = await requireFeature('interactions');
  const b = await req.json();
  const contactId = String(b.contactId || '');
  const prompt = String(b.prompt || '').slice(0, 1000);
  const scheduledAt = new Date(b.scheduledAt || Date.now());
  const contact = await prisma.contact.findFirst({ where: { id: contactId, userId: u.id } });
  if (!contact) return Response.json({ error: 'Contact not found' }, { status: 404 });
  const itx = await prisma.interaction.create({ data: { userId: u.id, contactId: contact.id, prompt, scheduledAt } });
  const token = Math.random().toString(36).slice(2,10) + Math.random().toString(36).slice(2,10);
  const expiresAt = new Date(scheduledAt.getTime() + 1000*60*60*24*7);
  await prisma.feedbackToken.create({ data: { token, interactionId: itx.id, expiresAt } });
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/f/${token}`;
  const title = `Check-in: ${contact.name}`;
  const message = `${prompt}\n\nDid it happen? Tap to answer: ${url}`;
  const channel: 'email'|'sms' = b.channel === 'sms' ? 'sms' : 'email';
  if (channel === 'sms') { const ok=await hasFeature(u.id,'sms_nudges'); if(!ok) return Response.json({error:'SMS nudges require Plus'},{status:402}); const q=await canSendSms(u.id); if(!q) return Response.json({error:'Monthly SMS limit reached'},{status:402}); await sendSms(contact.phone || '', message); }
  else { await sendEmail(contact.email || '', title, `<p>${message.replace(/\n/g,'<br/>')}</p>`); }
  const nudge = await prisma.nudge.create({ data: { creatorId: u.id, recipientId: u.id, title, message, channel, scheduledAt } });
  await prisma.interaction.update({ where: { id: itx.id }, data: { nudgeId: nudge.id } });
  return Response.json({ interaction: itx, nudgeId: nudge.id, feedbackUrl: url }, { status: 201 });
}
