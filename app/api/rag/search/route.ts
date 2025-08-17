
import { searchCorpus } from '../../../../lib/rag';
export const runtime = 'nodejs';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (!q) return Response.json({ results: [] }, { status: 200 });
  const results = await searchCorpus(q, 6);
  return Response.json({ results }, { status: 200 });
}
