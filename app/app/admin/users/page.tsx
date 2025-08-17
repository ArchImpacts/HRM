
'use client';
import React from 'react';
type User = { id:string; email:string; role:'USER'|'ADMIN'; plan:'FREE'|'PLUS'|'PREMIUM'; profile?: any; createdAt: string };
export default function AdminUsers(){
  const [users, setUsers] = React.useState<User[]>([]);
  const [msg, setMsg] = React.useState('');
  async function load(){ const r=await fetch('/api/admin/users'); if(r.ok) setUsers(await r.json()); else setMsg('Not authorized or error.'); }
  React.useEffect(()=>{ load(); }, []);
  async function setRole(id:string, role:'USER'|'ADMIN'){ await fetch(`/api/admin/users/${id}/role`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ role }) }); load(); }
  async function setPlan(id:string, plan:'FREE'|'PLUS'|'PREMIUM'){ await fetch(`/api/admin/users/${id}/plan`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan }) }); load(); }
  return (<div className="container py-8"><h1 className="text-2xl font-semibold mb-4">Admin — Users</h1>{msg && <div className="text-sm text-gray-500 mb-3">{msg}</div>}<div className="card"><table className="w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2 px-3">Email</th><th className="px-3">Name</th><th className="px-3">Role</th><th className="px-3">Plan</th><th className="px-3">Actions</th></tr></thead><tbody>{users.map(u=>(<tr key={u.id} className="border-t border-gray-200"><td className="py-2 px-3">{u.email}</td><td className="px-3">{u.profile?.preferredName||'—'}</td><td className="px-3">{u.role}</td><td className="px-3">{u.plan}</td><td className="px-3"><div className="flex flex-wrap gap-2"><button onClick={()=>setRole(u.id,'USER')} className="btn">User</button><button onClick={()=>setRole(u.id,'ADMIN')} className="btn">Admin</button><button onClick={()=>setPlan(u.id,'FREE')} className="btn">Free</button><button onClick={()=>setPlan(u.id,'PLUS')} className="btn">Plus</button><button onClick={()=>setPlan(u.id,'PREMIUM')} className="btn">Premium</button></div></td></tr>))}{!users.length && <tr><td className="py-3 px-3 text-gray-500">No users found.</td></tr>}</tbody></table></div></div>);
}
