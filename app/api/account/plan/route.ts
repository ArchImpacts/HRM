
import { NextRequest } from 'next/server';
import { prisma } from '../../../../lib/db';
import { requireUser } from '../../../../lib/auth';
export const runtime = 'nodejs';
export async function POST(req: NextRequest){ const u=await requireUser(); const form=await req.formData(); const plan=String(form.get('plan')||'FREE').toUpperCase(); if(!['FREE','PLUS','PREMIUM'].includes(plan)) return new Response('Invalid plan',{status:400}); await prisma.user.update({ where:{ id:u.id }, data:{ plan: plan as any } }); return new Response(null,{ status:303, headers:{ Location:'/account' } }); }
