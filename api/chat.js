// BCH Live Chat - Vercel Serverless Function v2
// Tieši izmanto Anthropic Claude API - sinhrona atbilde

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const BCH_SYSTEM_PROMPT = `Tu esi BCH (bestcontenthosting.com) hosting konsultants. Atbildi latviski, draudzīgi un kodolīgi.

BCH pakalpojumi un cenas:
- Linux Starter: EUR 2/mēn — 1 vietne, 5GB SSD, SSL, CDN
- Linux Pro: EUR 4/mēn — 3 vietnes, 20GB SSD, SSL, CDN
- WordPress Premium: EUR 4/mēn — optimizēts WP, LiteSpeed, SSL
- WordPress Business: EUR 8/mēn — neierobežotas WP, 50GB SSD
- Kopage Pro: EUR 6/mēn — drag-and-drop vietnes veidotājs
- VPS Basic: EUR 12/mēn — 2 vCPU, 4GB RAM, 80GB SSD
- Reseller Starter: EUR 15/mēn — pārdod hosting saviem klientiem

Visi plāni iekļauj:
- Bezmaksas SSL sertifikāts
- CDN (ātrāka lapa)
- 99.9% uptime garantija
- Latviešu atbalsts
- 30 dienu naudas atpakaļ garantija

Ja klients ir gatavs pirkt, sūti uz: https://bestcontenthosting.com/#pricing
Ja jautājums nav par hosting, piedāvā sazināties: info@bestcontenthosting.com

Atbildi īsi — 2-3 teikumos maksimums. Neizmanto markdown.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ reply: 'Konfigurācijas kļūda. Sazinieties: info@bestcontenthosting.com' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-3-5-20241022',
        max_tokens: 300,
        system: BCH_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: message.substring(0, 500) }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Atvainojiet, nevarēju apstrādāt jautājumu.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(200).json({
      reply: 'Atvainojiet, ir tehniska problēma. Sazinieties tieši: info@bestcontenthosting.com vai +371 20000000'
    });
  }
}
