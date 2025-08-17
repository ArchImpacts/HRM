
import { NextRequest } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { requireFeature } from '../../../../../lib/featureGuard';
export const runtime='nodejs';
export async function POST(req:NextRequest,{ params }:{ params:{ id:string } }){ const u=await requireFeature('resources'); const body=await req.json().catch(()=>({favorite:true})); const favorite=!!body.favorite; const exists=await prisma.favorite.findFirst({ where:{ userId:u.id, resourceId:params.id } }); if(favorite && !exists){ await prisma.favorite.create({ data:{ userId:u.id, resourceId: params.id } }) } else if(!favorite && exists){ await prisma.favorite.delete({ where:{ id: exists.id } }) } return Response.json({ ok:true }, { status:200 }); }
