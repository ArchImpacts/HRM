
import { requireUser } from './auth'
import { hasFeature } from './entitlements'
export async function requireFeature(feature: import('./entitlements').Feature){
  const u = await requireUser()
  const ok = await hasFeature(u.id, feature)
  if (!ok) throw new Response(JSON.stringify({ error: 'Upgrade required', feature }), { status: 402 })
  return u
}
