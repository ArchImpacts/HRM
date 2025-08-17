
import { prisma } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth';
export const runtime='nodejs';
export async function GET(){ await requireAdmin(); const users=await prisma.user.findMany({ orderBy:{ createdAt:'desc' }, include:{ profile:true } }); return Response.json(users,{status:200}) }
