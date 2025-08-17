
import { prisma } from '../../../lib/db';
import { requireFeature } from '../../../lib/featureGuard';
export const runtime = 'nodejs';
export async function GET(){ const u=await requireFeature('resources'); const items=await prisma.resource.findMany({ orderBy:{ createdAt:'desc' } }); const favs=await prisma.favorite.findMany({ where:{ userId:u.id } }); const favSet=new Set(favs.map(f=>f.resourceId)); return Response.json(items.map(r=>({ ...r, favorite: favSet.has(r.id) })),{status:200}); }
