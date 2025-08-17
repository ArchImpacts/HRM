
import { prisma } from '../../../lib/db'
import { requireUser } from '../../../lib/auth'
export const runtime = 'nodejs';
export default async function BootstrapAdmin(){
  const me = await requireUser()
  const admins = await prisma.user.count({ where: { role: 'ADMIN' } })
  async function promote(){ 'use server'; const me2 = await requireUser(); await prisma.user.update({ where: { id: me2.id }, data: { role: 'ADMIN' } }); return null }
  return (<div className="container py-8"><h1 className="text-2xl font-semibold mb-2">Admin Bootstrap</h1><p className="text-sm text-gray-500 mb-4">Signed in as <span className="font-medium">{me.email}</span></p><p className="text-sm mb-4">Existing admins: {admins}</p><form action={promote}><button className="btn">Make me Admin</button></form></div>)
}
