export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const defaultKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_KEY ||
    process.env.OMNI_AI_KEY ||
    ''
  ).trim();

  res.status(200).json({
    hasServerKey: Boolean(defaultKey),
    keyLength: defaultKey ? defaultKey.length : 0,
    maskedKey: defaultKey ? `${defaultKey.slice(0, 4)}••••${defaultKey.slice(-4)}` : null,
    serverTime: new Date().toISOString()
  });
}
