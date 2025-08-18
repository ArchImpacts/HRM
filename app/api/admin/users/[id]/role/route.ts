
import { NextRequest } from 'next/server';
import { prisma } from '../../../../../../lib/db';
import { requireAdmin } from '../../../../../../lib/auth';
export const runtime='nodejs';
export async function POST(req:NextRequest,{ params }:{ params:{ id:string } }){ await requireAdmin(); const body=await req.json().catch(()=>({role:'USER'})); const role=String(body.role||'USER').toUpperCase(); if(!['USER','ADMIN'].includes(role)) return Response.json({error:'Invalid role'},{status:400}); await prisma.user.update({ where:{ id: params.id }, data:{ role: role as any } }); return Response.json({ ok:true }, { status:200 }); }
