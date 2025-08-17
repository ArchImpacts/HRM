
'use client';
import React from 'react';
export default function Profile() {
  const [p, setP] = React.useState<any>(null);
  const [msg, setMsg] = React.useState('');
  React.useEffect(()=>{ (async()=>{ const r = await fetch('/api/profile'); if(r.ok) setP(await r.json()); })() }, []);
  async function save(){ const r = await fetch('/api/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)}); setMsg(r.ok?'Saved.':'Error'); }
  if (!p) return <div className="container py-8">Loading…</div>;
  return (<div className="container py-8">
    <h1 className="text-2xl font-semibold mb-2">Profile</h1>
    <div className="card p-4 grid gap-3">
      <label className="grid gap-1 text-sm"><span className="text-gray-500">Preferred name</span><input className="rounded-xl border border-gray-200 px-3 py-2" value={p.preferredName||''} onChange={e=>setP({...p, preferredName:e.target.value})} /></label>
      <label className="grid gap-1 text-sm"><span className="text-gray-500">Mobile number</span><input className="rounded-xl border border-gray-200 px-3 py-2" value={p.phone||''} onChange={e=>setP({...p, phone:e.target.value})} /></label>
      <div className="grid gap-2 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.emailOptIn} onChange={e=>setP({...p, emailOptIn:e.target.checked})}/> Accept nudges by email</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.smsOptIn} onChange={e=>setP({...p, smsOptIn:e.target.checked})}/> Accept nudges by text</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.trackOptIn} onChange={e=>setP({...p, trackOptIn:e.target.checked})}/> Track my conversations for analytics</label>
      </div>
      <div className="flex gap-2 items-center"><button onClick={save} className="btn btn-primary">Save</button>{msg && <span className="text-sm text-gray-500">{msg}</span>}</div>
    </div>
  </div>);
}
