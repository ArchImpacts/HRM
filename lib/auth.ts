
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './db'
export async function requireUser(){
  const { userId } = auth()
  if (!userId) throw new Response('Unauthorized', { status: 401 })
  let u = await prisma.user.findUnique({ where: { id: userId } })
  if (!u) {
    const cu = await currentUser()
    const email = cu?.primaryEmailAddress?.emailAddress || 'unknown@example.com'
    u = await prisma.user.create({ data: { id: userId, email } })
    await prisma.profile.create({ data: { userId } })
  }
  return { id: u.id, email: u.email }
}
export async function requireAdmin(){
  const { userId } = auth()
  if (!userId) throw new Response('Unauthorized', { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: userId } })
  if (!u || u.role !== 'ADMIN') throw new Response('Forbidden', { status: 403 })
  return { id: u.id, email: u.email }
}
