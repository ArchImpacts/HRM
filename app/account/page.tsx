
import { prisma } from '../../lib/db';
import { requireUser } from '../../lib/auth';
import { featuresFor } from '../../lib/entitlements';
export const runtime = 'nodejs';
export default async function Account(){
  const u = await requireUser();
  const fresh = await prisma.user.findUnique({ where: { id: u.id } }) as any;
  const plan = fresh?.plan || 'FREE';
  return (<div className="container py-8"><h1 className="text-2xl font-semibold mb-2">Your Plan</h1><p className="text-sm text-gray-500 mb-6">Current: <span className="font-medium">{plan}</span></p><div className="grid gap-4 sm:grid-cols-3">{(['FREE','PLUS','PREMIUM'] as const).map(p=>(<form key={p} action="/api/account/plan" method="POST" className="card p-4"><div className="font-semibold">{p}</div><ul className="text-xs text-gray-500 mt-2 list-disc list-inside">{featuresFor(p).map(f=><li key={f}>{f}</li>)}</ul><input type="hidden" name="plan" value={p} /><button className={`mt-3 btn ${p===plan?'btn-primary':''}`} type="submit">{p===plan?'Selected (dev)':'Select (dev)'}</button></form>))}</div></div>); }
