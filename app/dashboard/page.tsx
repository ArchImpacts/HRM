
'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function UpcomingList() {
  const [items, setItems] = React.useState<any[]>([]);
  React.useEffect(() => { (async()=>{ const r = await fetch('/api/interactions/upcoming'); if (r.status===402){ setItems([{locked:true} as any]); return; } if (r.ok) setItems(await r.json()); })() }, []);
  if (!items.length) return <div className="text-sm text-gray-500">Nothing scheduled.</div>;
  if (items[0]?.locked) return <div className="text-sm">Upcoming Interactions is a <span className="font-medium">Plus</span> feature. <a className="underline" href="/account">Upgrade</a>.</div>;
  return (<div className="grid gap-2">{items.map((i:any)=>(<a key={i.id} href={`/contacts/${i.contact.id}`} className="rounded-lg border border-gray-200 p-3 flex justify-between hover:bg-gray-50"><div><div className="font-medium">{i.contact.name}{i.contact.roleLabel?` • ${i.contact.roleLabel}`:''}</div><div className="text-xs text-gray-500">{i.prompt}</div></div><div className="text-xs text-gray-500 self-center">{new Date(i.when).toLocaleString()}</div></a>))}</div>);
}

export default function Dashboard(){
  const [principalCounts, setPrincipalCounts] = React.useState<any[]>([]);
  const [monthly, setMonthly] = React.useState<any[]>([]);
  const [topContacts, setTopContacts] = React.useState<any[]>([]);
  const [overall, setOverall] = React.useState<any>({ completion:0, avgRating:0 });
  const [engagement, setEngagement] = React.useState<any[]>([]);
  const [repliesPrincipal, setRepliesPrincipal] = React.useState<any[]>([]);
  React.useEffect(()=>{
    (async()=>{ const r = await fetch('/api/analytics/me-advanced'); if (r.ok) { const j = await r.json(); setPrincipalCounts(j.principalCounts||[]); setMonthly(j.monthly||[]); setTopContacts(j.topContacts||[]); setOverall(j.overall||{completion:0,avgRating:0}); } })();
    (async()=>{ const r = await fetch('/api/analytics/engagement'); if (r.ok) { const j = await r.json(); setEngagement(j.series||[]); } })();
    (async()=>{ const r = await fetch('/api/analytics/replies-principals'); if (r.ok) { const j = await r.json(); setRepliesPrincipal(j.items||[]); } })();
  }, []);
  return (<main className="min-h-screen"><div className="container py-8"><h1 className="text-2xl font-semibold mb-4">Your Dashboard</h1><p className="text-sm text-gray-500 mb-6">Insights from your (opted-in) conversations.</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="card p-3 text-center"><div className="text-xs text-gray-500">Completion (90d)</div><div className="text-xl font-semibold">{Math.round(overall.completion*100)}%</div></div>
      <div className="card p-3 text-center"><div className="text-xs text-gray-500">Avg Rating (90d)</div><div className="text-xl font-semibold">{overall.avgRating?.toFixed?.(2) ?? '—'}★</div></div>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-4"><h2 className="font-semibold mb-3">Monthly Conversations</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#39b54a" /></BarChart></ResponsiveContainer></div></div>
      <div className="card p-4"><h2 className="font-semibold mb-3">Principal Breakdown (Last 90d)</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={principalCounts}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="key" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#166c9d" /></BarChart></ResponsiveContainer></div></div>
    </div>
    <div className="card p-4 mt-6"><h2 className="font-semibold mb-3">Top Contacts (Last 90d)</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2">Contact</th><th>Interactions</th><th>Completion</th><th>Avg Rating</th></tr></thead><tbody>{topContacts.map((c:any)=>(<tr key={c.id} className="border-t border-gray-200"><td className="py-2"><a className="underline" href={`/contacts/${c.id}`}>{c.name}</a></td><td>{c.interactions}</td><td>{Math.round(c.completion*100)}%</td><td>{c.avgRating.toFixed(2)}★</td></tr>))}</tbody></table></div></div>
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <div className="card p-4"><h2 className="font-semibold mb-3">Interaction Frequency (6 mo)</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={engagement}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#39b54a" /></BarChart></ResponsiveContainer></div></div>
      <div className="card p-4"><h2 className="font-semibold mb-3">Genuine Principals in Replies (90d)</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={repliesPrincipal}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="principal" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#166c9d" /></BarChart></ResponsiveContainer></div></div>
    </div>
    <div className="card p-4 mt-6"><h2 className="font-semibold mb-3">Upcoming Interactions</h2><UpcomingList /></div>
  </div></main>);
}
