
import { prisma } from './db'
export const PLAN_LIMITS = { FREE:{chatsPerMonth:100,contacts:5,smsPerMonth:0}, PLUS:{chatsPerMonth:1000,contacts:100,smsPerMonth:200}, PREMIUM:{chatsPerMonth:5000,contacts:1000,smsPerMonth:1000} } as const
export async function canUseChat(userId: string){
  const m = new Date(); m.setDate(1); m.setHours(0,0,0,0)
  const count = await prisma.message.count({ where: { conversation: { userId }, role: 'user', createdAt: { gte: m } } })
  const u = await prisma.user.findUnique({ where: { id: userId } })
  return count < PLAN_LIMITS[(u?.plan as any)||'FREE'].chatsPerMonth
}
export async function canAddContact(userId: string){
  const n = await prisma.contact.count({ where: { userId } })
  const u = await prisma.user.findUnique({ where: { id: userId } })
  return n < PLAN_LIMITS[(u?.plan as any)||'FREE'].contacts
}
export async function canSendSms(userId: string){
  const m = new Date(); m.setDate(1); m.setHours(0,0,0,0)
  const n = await prisma.nudge.count({ where: { creatorId: userId, channel: 'sms', createdAt: { gte: m } } })
  const u = await prisma.user.findUnique({ where: { id: userId } })
  return n < PLAN_LIMITS[(u?.plan as any)||'FREE'].smsPerMonth
}
