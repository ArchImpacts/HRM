
import { prisma } from '../../../../lib/db';
import { requireFeature } from '../../../../lib/featureGuard';
export const runtime = 'nodejs';
export async function GET(){ const u=await requireFeature('interactions'); const now=new Date(); const items=await prisma.interaction.findMany({ where:{ userId:u.id, scheduledAt:{ gte: now } }, include:{ contact:true }, orderBy:{ scheduledAt:'asc' }, take:10 }); return Response.json(items.map(i=>({ id:i.id, when:i.scheduledAt, prompt:i.prompt, contact:{ id:i.contact.id, name:i.contact.name, roleLabel:i.contact.roleLabel } })), {status:200}); }
