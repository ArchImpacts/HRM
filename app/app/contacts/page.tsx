
'use client';
import React from 'react';
export default function Contacts(){
  const [items,setItems]=React.useState<any[]>([]); const [name,setName]=React.useState('');
  React.useEffect(()=>{ (async()=>{ const r=await fetch('/api/contacts'); if(r.ok) setItems(await r.json()); })() },[]);
  async function add(){ const r=await fetch('/api/contacts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})}); if(r.ok){ setName(''); const rr=await fetch('/api/contacts'); setItems(await rr.json()); } }
  return (<div className="container py-8"><h1 className="text-2xl font-semibold mb-2">Contacts</h1>
    <div className="flex gap-2 mb-3"><input className="rounded-xl border border-gray-200 px-3 py-2" value={name} onChange={e=>setName(e.target.value)} /><button onClick={add} className="btn btn-primary">Add</button></div>
    <div className="grid gap-2">{items.map(c=>(<a key={c.id} href={`/contacts/${c.id}`} className="card p-3 flex justify-between"><div><div className="font-medium">{c.name}</div><div className="text-xs text-gray-500">{c.roleLabel||''}</div></div></a>))}</div>
  </div>);
}
