
'use client';
import { useState } from 'react';
export default function FeedbackPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const [happened, setHappened] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState<string>('');
  async function submit(){ if(happened===null){ setDone('Please select yes or no.'); return; } const res=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ token, happened, rating, notes })}); const j=await res.json(); setDone(res.ok?'Thanks! Your feedback was recorded.':(j.error||'Error')); }
  return (<main className="min-h-screen"><div className="container py-8"><h1 className="text-xl font-semibold mb-2">Quick check-in</h1><p className="text-sm text-gray-500 mb-4">Tell us how your interaction went.</p><div className="card p-4 grid gap-3"><div><div className="text-sm text-gray-500 mb-1">Did the interaction happen?</div><div className="flex gap-2"><button onClick={()=>setHappened(true)} className={`btn ${happened===true?'btn-primary':''}`}>Yes</button><button onClick={()=>setHappened(false)} className={`btn ${happened===false?'btn-primary':''}`}>No</button></div></div><div><div className="text-sm text-gray-500 mb-1">Quality (1–5)</div><div className="flex gap-1">{[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>setRating(n)} className={`btn ${rating===n?'btn-primary':''}`}>{n}★</button>))}</div></div><div className="grid gap-1"><label className="text-sm text-gray-500">Outcomes / next steps</label><textarea className="rounded-xl border border-gray-200 px-3 py-2 min-h-[100px]" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What happened? What will you do next?" /></div><button onClick={submit} className="btn btn-primary">Submit</button>{done && <div className="text-sm text-gray-500">{done}</div>}</div></div></main>); }
