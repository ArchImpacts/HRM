
'use client';
import React from 'react';
export default function CorpusAdmin(){
  const [title,setTitle]=React.useState('');
  const [text,setText]=React.useState('');
  const [msg,setMsg]=React.useState('');
  async function upload(){ const r=await fetch('/api/admin/corpus/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ title, text })}); const j=await r.json(); setMsg(r.ok?`Ingested ${j.ingested} docs`:(j.error||'Error')); }
  return (<div className="container py-8"><h1 className="text-2xl font-semibold mb-2">Corpus Upload</h1><div className="card p-4 grid gap-3"><input className="rounded-xl border border-gray-200 px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} /><textarea className="rounded-xl border border-gray-200 px-3 py-2 min-h-[160px]" placeholder="Paste text to ingest" value={text} onChange={e=>setText(e.target.value)} /><button onClick={upload} className="btn btn-primary">Ingest</button>{msg && <div className="text-sm text-gray-500">{msg}</div>}</div></div>);
}
