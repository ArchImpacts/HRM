
import { NextRequest } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { requireAdmin } from '../../../../../lib/auth';
export const runtime='nodejs';
export async function POST(req:NextRequest,{ params }:{ params:{ id:string } }){ await requireAdmin(); const body=await req.json().catch(()=>({plan:'FREE'})); const plan=String(body.plan||'FREE').toUpperCase(); if(!['FREE','PLUS','PREMIUM'].includes(plan)) return Response.json({error:'Invalid plan'},{status:400}); await prisma.user.update({ where:{ id: params.id }, data:{ plan: plan as any } }); return Response.json({ ok:true }, { status:200 }); }
