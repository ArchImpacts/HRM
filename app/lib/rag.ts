
import OpenAI from 'openai'
import { prisma } from './db'
import { randomUUID } from 'crypto'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const EMBED_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
export async function embed(text: string){ const r = await client.embeddings.create({ model: EMBED_MODEL, input: text }); return r.data[0].embedding as any as number[] }
function chunkText(text: string, target = 1000){ const parts:string[]=[]; const paras=text.replace(/\r/g,'').split(/\n\n+/); let buf=''; for(const p of paras){ if((buf+'\n\n'+p).length>target && buf){parts.push(buf.trim()); buf=p}else{buf=buf?buf+'\n\n'+p:p} } if(buf) parts.push(buf.trim()); return parts }
export async function ingestDoc({ title, url, text, meta }:{ title:string; url?:string; text:string; meta?:any }){
  const docId = randomUUID()
  await prisma.document.create({ data: { id: docId, title, url, meta } })
  const chunks = chunkText(text, 1000)
  for (const c of chunks) {
    const e = await embed(c)
    const buf = Buffer.from(JSON.stringify(e), 'utf8')
    await prisma.chunk.create({ data: { documentId: docId, content: c, embedding: buf } })
  }
  return { id: docId, chunks: chunks.length }
}
export async function searchCorpus(query: string, topK=6){
  const q = await embed(query)
  const all = await prisma.chunk.findMany({ include: { document: true } })
  function cosine(a:number[],b:number[]){ let dot=0,as=0,bs=0; for(let i=0;i<Math.min(a.length,b.length);i++){ dot+=a[i]*b[i]; as+=a[i]*a[i]; bs+=b[i]*b[i]; } return dot/(Math.sqrt(as)*Math.sqrt(bs)+1e-9) }
  const scored = all.map(c=>{ const v = JSON.parse(Buffer.from(c.embedding).toString('utf8')) as number[]; return { id:c.id, content:c.content, title:c.document.title, url:c.document.url||undefined, similarity: cosine(q,v)} }).sort((a,b)=>b.similarity-a.similarity).slice(0,topK)
  return scored
}
