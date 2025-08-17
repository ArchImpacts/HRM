
import { prisma } from './db'
export type Feature = 'resources'|'contacts'|'interactions'|'nudges'|'sms_nudges'|'rag_search'|'dashboard_analytics'|'upcoming_list'|'campaigns_admin'
const PLAN_FEATURES: Record<'FREE'|'PLUS'|'PREMIUM', Feature[]> = {
  FREE: ['resources','nudges','dashboard_analytics'],
  PLUS: ['resources','nudges','contacts','interactions','sms_nudges','rag_search','dashboard_analytics','upcoming_list'],
  PREMIUM: ['resources','nudges','contacts','interactions','sms_nudges','rag_search','dashboard_analytics','upcoming_list','campaigns_admin'],
}
export async function userPlan(userId: string): Promise<'FREE'|'PLUS'|'PREMIUM'> {
  const u = await prisma.user.findUnique({ where: { id: userId } }); return (u?.plan as any)||'FREE';
}
export async function hasFeature(userId: string, feature: Feature){ const plan = await userPlan(userId); return PLAN_FEATURES[plan].includes(feature); }
export function featuresFor(plan: 'FREE'|'PLUS'|'PREMIUM'){ return PLAN_FEATURES[plan]; }
