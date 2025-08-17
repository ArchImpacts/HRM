
import { prisma } from '../../../../lib/db';
import { requireUser } from '../../../../lib/auth';
export const runtime = 'nodejs';
export async function GET(){ const u=await requireUser(); const since=new Date(); since.setMonth(since.getMonth()-3); const rows=await prisma.messageTag.findMany({ where:{ key:'principal_reply', createdAt:{ gte: since }, message:{ conversation:{ userId:u.id }, role:'assistant' } }, select:{ value:true } }); const m=new Map<string,number>(); for(const r of rows){ m.set(r.value,(m.get(r.value)||0)+1) } const items=Array.from(m.entries()).map(([principal,count])=>({principal,count})).sort((a,b)=>b.count-a.count); return Response.json({ items }, { status: 200 }); }
