
import { prisma } from '../../../../lib/db';
import { requireUser } from '../../../../lib/auth';
export const runtime = 'nodejs';
export async function GET(){ const u=await requireUser(); const since=new Date(); since.setMonth(since.getMonth()-6); const items=await prisma.interaction.findMany({ where:{ userId:u.id, createdAt:{ gte: since } }, select:{ createdAt:true } }); const counts=new Map<string,number>(); for(const it of items){ const k=it.createdAt.toISOString().slice(0,7); counts.set(k,(counts.get(k)||0)+1) } const series=Array.from(counts.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([period,count])=>({period,count})); return Response.json({ series }, { status: 200 }); }
