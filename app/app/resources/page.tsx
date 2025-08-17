
'use client';
import React from 'react';
type Resource = { id:string; title:string; description:string; url:string; thumbnail?:string|null; favorite?:boolean };
export default function Resources(){
  const [items,setItems]=React.useState<Resource[]>([]); const [msg,setMsg]=React.useState('');
  async function load(){ const r=await fetch('/api/resources'); if(r.ok){ setItems(await r.json()); } else { setMsg('Upgrade required or error.'); } }
  React.useEffect(()=>{ load(); }, []);
  async function toggleFav(id:string, fav:boolean){ await fetch(`/api/resources/${id}/favorite`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ favorite: !fav }) }); setItems(items.map(i=> i.id===id ? { ...i, favorite: !fav } : i)); }
  return (<div className="container py-8"><h1 className="text-2xl font-semibold mb-4">Resource Library</h1>{msg && <div className="text-sm text-gray-500 mb-3">{msg}</div>}<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(r=>(<div key={r.id} className="card p-3 flex flex-col">{r.thumbnail ? <img src={r.thumbnail} alt="" className="rounded-lg mb-2 w-full h-32 object-cover" /> : <div className="rounded-lg mb-2 w-full h-32 bg-gray-100" />}<div className="font-semibold">{r.title}</div><div className="text-sm text-gray-500 line-clamp-3 mt-1">{r.description}</div><div className="mt-3 flex gap-2"><a href={r.url} target="_blank" className="btn btn-primary text-sm text-center">Launch</a><button onClick={()=>toggleFav(r.id, !!r.favorite)} className="btn text-sm">{r.favorite?'★ Favorited':'☆ Favorite'}</button></div></div>))}</div>{!items.length && <div className="text-sm text-gray-500">No resources yet.</div>}</div>);
}
