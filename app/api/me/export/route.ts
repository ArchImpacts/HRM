
import { requireUser } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
export const runtime='nodejs';
export async function GET(){ const u=await requireUser(); const user=await prisma.user.findUnique({ where:{ id:u.id } }); const profile=await prisma.profile.findUnique({ where:{ userId:u.id } }); const contacts=await prisma.contact.findMany({ where:{ userId:u.id }, include:{ interactions:{ include:{ feedback:true } } } }); const conversations=await prisma.conversation.findMany({ where:{ userId:u.id }, include:{ messages:{ include:{ tags:true } } } }); const favorites=await prisma.favorite.findMany({ where:{ userId:u.id }, include:{ resource:true } }); return Response.json({ user, profile, contacts, conversations, favorites }, { status:200 }); }
