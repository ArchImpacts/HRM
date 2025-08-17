
import { prisma } from '../../../../lib/db';
import { requireUser } from '../../../../lib/auth';
export const runtime = 'nodejs';
export async function GET(){
  const u=await requireUser();
  const profile=await prisma.profile.findUnique({ where:{ userId:u.id } }); if(!profile?.trackOptIn) return Response.json({ message:'Tracking disabled' }, {status:200});
  const since=new Date(); since.setMonth(since.getMonth()-3);
  const feedback=await prisma.interactionFeedback.findMany({ where:{ interaction:{ userId:u.id, createdAt:{ gte: since } } }, select:{ happened:true, rating:true, interaction:{ select:{ contactId:true } } } });
  const byContact=new Map<string,{count:number;happened:number;ratingSum:number}>();
  for(const f of feedback){ const key=f.interaction.contactId; const rec=byContact.get(key)||{count:0,happened:0,ratingSum:0}; rec.count++; if(f.happened) rec.happened++; rec.ratingSum+=(f.rating||0); byContact.set(key,rec); }
  const contacts=await prisma.contact.findMany({ where:{ id:{ in:Array.from(byContact.keys()) } } });
  const cmap=new Map(contacts.map(c=>[c.id,c])); const topContacts=Array.from(byContact.entries()).map(([id,v])=>({ id, name:cmap.get(id)?.name||'Unknown', avgRating:v.count?v.ratingSum/v.count:0, completion:v.count?(v.happened/v.count):0, interactions:v.count })).sort((a,b)=>b.interactions-a.interactions).slice(0,10);
  const tags=await prisma.messageTag.findMany({ where:{ key:'principal', message:{ conversation:{ userId:u.id, startedAt:{ gte: since } } } }, select:{ value:true } });
  const m=new Map<string,number>(); for(const t of tags){ m.set(t.value,(m.get(t.value)||0)+1) } const principalCounts=Array.from(m.entries()).map(([key,value])=>({ key, value })).sort((a,b)=>b.value-a.value);
  const msgs=await prisma.message.findMany({ where:{ conversation:{ userId:u.id }, createdAt:{ gte: new Date(new Date().setMonth(new Date().getMonth()-6)) }, role:'user' }, select:{ createdAt:true } });
  const byMonth=new Map<string,number>(); for(const s of msgs){ const k=s.createdAt.toISOString().slice(0,7); byMonth.set(k,(byMonth.get(k)||0)+1) } const monthly=Array.from(byMonth.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([month,count])=>({month,count}));
  const overall={ completion: feedback.length ? (feedback.filter(f=>f.happened).length/feedback.length) : 0, avgRating: feedback.length ? (feedback.reduce((x,f)=>x+(f.rating||0),0)/feedback.length) : 0 };
  return Response.json({ overall, topContacts, principalCounts, monthly }, { status: 200 });
}
