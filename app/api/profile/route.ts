
import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';
export const runtime = 'nodejs';
export async function GET(){ const u=await requireUser(); const p=await prisma.profile.findUnique({ where:{ userId:u.id } }) || await prisma.profile.create({ data:{ userId:u.id } }); return Response.json(p,{status:200}) }
export async function POST(req:NextRequest){ const u=await requireUser(); const b=await req.json(); const p=await prisma.profile.upsert({ where:{ userId:u.id }, create:{ userId:u.id, preferredName:b.preferredName||null, phone:b.phone||null, emailOptIn:!!b.emailOptIn, smsOptIn:!!b.smsOptIn, trackOptIn:!!b.trackOptIn }, update:{ preferredName:b.preferredName||null, phone:b.phone||null, emailOptIn:!!b.emailOptIn, smsOptIn:!!b.smsOptIn, trackOptIn:!!b.trackOptIn } }); return Response.json(p,{status:200}) }
