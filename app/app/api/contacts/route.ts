
import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/db';
import { requireFeature } from '../../../lib/featureGuard';
import { canAddContact } from '../../../lib/quotas';
export const runtime = 'nodejs';
export async function GET(){ const u=await requireFeature('contacts'); const items=await prisma.contact.findMany({ where:{ userId:u.id }, orderBy:{ createdAt:'desc' } }); return Response.json(items,{status:200}) }
export async function POST(req: NextRequest){ const u=await requireFeature('contacts'); const ok=await canAddContact(u.id); if(!ok) return Response.json({error:'Contact limit reached'}, {status:402}); const b=await req.json(); const name=String(b.name||'').trim().slice(0,200); if(!name) return Response.json({error:'Name required'},{status:400}); const created=await prisma.contact.create({ data:{ userId:u.id, name, roleLabel:b.roleLabel||null, email:b.email||null, phone:b.phone||null } }); return Response.json(created,{status:201}) }
