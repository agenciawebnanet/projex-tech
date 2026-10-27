import { NextRequest, NextResponse } from 'next/server';

const validKinds = ['presentation', 'proposal', 'content', 'analysis'];
export async function POST(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey || request.headers.get('x-admin-key') !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json().catch(() => null) as { kind?: string; company?: string; segment?: string; notes?: string; language?: string } | null;
  if (!body || !validKinds.includes(body.kind || '')) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  const url = process.env.AI_API_URL, key = process.env.AI_API_KEY, model = process.env.AI_MODEL;
  if (!url || !key || !model) return NextResponse.json({ error: 'AI Studio no está configurado. Defina AI_API_URL, AI_API_KEY y AI_MODEL en Vercel.', code: 'AI_NOT_CONFIGURED' }, { status: 503 });
  const prompt = `Eres consultor comercial de Projex Tech. Crea un ${body.kind} en ${body.language === 'pt' ? 'portugués' : 'español'} para empresa: ${body.company || 'no informada'}, segmento: ${body.segment || 'no informado'}. Evidencias/notas: ${body.notes || 'ninguna'}. Separa estrictamente hechos proporcionados de hipótesis. Nunca inventes auditorías, clientes, testimonios, resultados o garantías. Incluye próximos pasos y contactos: WhatsApp +55 66 99977-5501 / https://wa.me/5566999775501, Telegram @Projexbr / https://t.me/Projexbr. Devuelve contenido estructurado, claro y listo para revisión humana.`;
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model, messages: [{ role: 'system', content: 'No afirmes datos no proporcionados. Tu contenido será revisado antes de enviarse.' }, { role: 'user', content: prompt }], temperature: 0.35, max_tokens: Math.min(Number(process.env.AI_MAX_TOKENS || 1400), 3000) }), signal: AbortSignal.timeout(30000) });
    if (!response.ok) return NextResponse.json({ error: 'El proveedor de IA no pudo completar la solicitud.', code: 'AI_PROVIDER_ERROR' }, { status: 502 });
    const data = await response.json(); const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return NextResponse.json({ error: 'El proveedor devolvió una respuesta vacía.', code: 'AI_EMPTY_RESPONSE' }, { status: 502 });
    return NextResponse.json({ content, model });
  } catch { return NextResponse.json({ error: 'No fue posible conectar con el proveedor de IA.', code: 'AI_CONNECTION_ERROR' }, { status: 502 }); }
}
