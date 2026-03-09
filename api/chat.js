// BCH Live Chat - Vercel Serverless Function
const NEBULA_WEBHOOK_URL = 'https://api.nebula.gg/webhooks/triggers/trig_069af152a492774280005acc188433fb/webhook';
const NEBULA_WEBHOOK_SECRET = process.env.NEBULA_WEBHOOK_SECRET || '';

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

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const nebulaResponse = await fetch(NEBULA_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': NEBULA_WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        message: message.trim(),
        source: 'bch-website-chat',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!nebulaResponse.ok) {
      throw new Error('Nebula webhook error: ' + nebulaResponse.status);
    }

    const data = await nebulaResponse.json();

    const reply =
      data.reply ||
      data.output ||
      data.result ||
      data.message ||
      'Paldies par zinojumu! Musas komanda atbildes drizi.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('BCH Chat error:', error);
    return res.status(200).json({
      reply: 'Atvainojiet, ir tehniskas problemas. Sazinieties: info@bestcontenthosting.com',
    });
  }
}