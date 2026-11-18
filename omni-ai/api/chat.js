export const config = {
  maxDuration: 60
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method Not Allowed' } });
    return;
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = {};
      }
    }
    payload = payload || {};

    const customAuth = req.headers['authorization'] || '';
    const providedKey = customAuth.startsWith('Bearer ') ? customAuth.slice(7).trim() : '';
    const isServerDefault = !providedKey || providedKey === '__SERVER_DEFAULT__' || providedKey === 'server_default';
    const requestedModel = payload.model || 'gemini-flash-latest';

    // Direct proxy to 9Router when requesting ThirtyStore, Kiro, OpenRouter, or combo models
    if (
      requestedModel.startsWith('thirtystore/') ||
      requestedModel.startsWith('kr/') ||
      requestedModel.startsWith('openrouter/') ||
      requestedModel.startsWith('oc/') ||
      requestedModel.startsWith('ag/') ||
      requestedModel === 'ultra-1' ||
      requestedModel === 'gpt-6-astra' ||
      requestedModel === 'gpt6-astra' ||
      requestedModel === 'agy' ||
      requestedModel === 'skensa-failover'
    ) {
      const rawRouterBase = (process.env.NINE_ROUTER_URL || 'http://localhost:20128').replace(/\/+$/, '');
      const routerUrl = `${rawRouterBase}/v1/chat/completions`;
      const routerApiKey = (
        (!isServerDefault ? providedKey : '') ||
        process.env.NINE_ROUTER_KEY ||
        ''
      ).trim();

      if (!routerApiKey) {
        res.status(400).json({
          error: { message: 'NINE_ROUTER_KEY belum dikonfigurasi di server environment.' }
        });
        return;
      }

      try {
        const routerRes = await fetch(routerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${routerApiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (!routerRes.ok) {
          const errData = await routerRes.json().catch(() => ({}));
          res.status(routerRes.status).json(errData.error ? errData : { error: { message: `9Router error: ${routerRes.status}` } });
          return;
        }

        if (payload.stream) {
          res.setHeader('Content-Type', routerRes.headers.get('content-type') || 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          if (typeof res.flushHeaders === 'function') res.flushHeaders();

          const reader = routerRes.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
          return;
        }

        const rawText = await routerRes.text();
        try {
          const cleanJson = rawText.replace(/data:\s*\[DONE\].*$/s, '').trim();
          const data = JSON.parse(cleanJson);
          res.status(200).json(data);
        } catch {
          res.status(200).send(rawText);
        }
        return;
      } catch (routerErr) {
        console.error('9Router proxy error:', routerErr);
        res.status(502).json({ error: { message: `Gagal terhubung ke 9Router (${routerUrl}): ${routerErr.message}` } });
        return;
      }
    }

    let apiKey = isServerDefault
      ? (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || process.env.OMNI_AI_KEY || '').trim()
      : providedKey;

    if (!apiKey) {
      res.status(400).json({
        error: {
          message: 'Tidak ada API Key yang dikonfigurasi. Silakan masukkan Google AI Key Anda di menu Pengaturan (ikon gear ⚙️).'
        }
      });
      return;
    }
    const messages = payload.messages || [];

    // Convert standard OpenAI messages to Gemini contents
    const contents = [];
    let systemText = '';

    for (const m of messages) {
      if (m.role === 'system') {
        const sysContent = typeof m.content === 'string' ? m.content : JSON.stringify(m.content || '');
        systemText += (systemText ? '\n' : '') + sysContent;
      } else {
        const role = m.role === 'user' ? 'user' : 'model';
        const parts = [];

        if (Array.isArray(m.content)) {
          for (const part of m.content) {
            if (part.type === 'text' && part.text) {
              parts.push({ text: part.text });
            } else if (part.type === 'image_url' && part.image_url?.url) {
              const url = part.image_url.url;
              const match = url.match(/^data:([^;]+);base64,(.+)$/);
              if (match) {
                parts.push({
                  inlineData: {
                    mimeType: match[1],
                    data: match[2]
                  }
                });
              }
            }
          }
        } else if (typeof m.content === 'string') {
          parts.push({ text: m.content || ' ' });
        }

        contents.push({
          role: role,
          parts: parts.length > 0 ? parts : [{ text: ' ' }]
        });
      }
    }

    const geminiPayload = {
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Halo' }] }],
      generationConfig: {
        temperature: payload.temperature ?? 0.7,
        topP: 0.95,
        topK: 40
      }
    };

    if (systemText) {
      geminiPayload.systemInstruction = {
        parts: [{ text: systemText }]
      };
    }

    function resolveModelName(raw) {
      if (raw === 'antigravity-agent') return 'gemini-3.1-pro-preview';
      if (raw?.startsWith('thirtystore/') || raw === 'ultra-1') return 'gemini-flash-latest';
      return raw;
    }

    const candidateModels = [
      resolveModelName(requestedModel),
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
      'gemini-3-flash-preview',
      'gemini-robotics-er-2-preview',
      'gemma-4-26b-a4b-it',
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

    let lastErrorMessage = '';

    if (payload.stream) {
      let streamResponse = null;
      let usedStreamModel = candidateModels[0];

      for (let i = 0; i < candidateModels.length; i++) {
        usedStreamModel = candidateModels[i];
        const googleStreamEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${usedStreamModel}:streamGenerateContent?alt=sse&key=${apiKey}`;
        try {
          const resAttempt = await fetch(googleStreamEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload)
          });
          if (resAttempt.ok) {
            streamResponse = resAttempt;
            break;
          }
          const errData = await resAttempt.json().catch(() => ({}));
          lastErrorMessage = errData.error?.message || `HTTP ${resAttempt.status}`;
        } catch (e) {
          lastErrorMessage = e.message;
        }
      }

      if (!streamResponse) {
        res.status(503).json({
          error: {
            message: lastErrorMessage || 'Model Google AI sedang sibuk. Silakan coba lagi beberapa saat.'
          }
        });
        return;
      }

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
      }

      const reader = streamResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '').trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const data = JSON.parse(jsonStr);
              const candidate = data.candidates?.[0];
              const parts = candidate?.content?.parts || [];
              for (const part of parts) {
                if (part.text && !part.thought) {
                  const chunkPayload = {
                    id: `chatcmpl-${Date.now()}`,
                    object: 'chat.completion.chunk',
                    created: Math.floor(Date.now() / 1000),
                    model: usedStreamModel,
                    choices: [
                      {
                        index: 0,
                        delta: { content: part.text },
                        finish_reason: null
                      }
                    ]
                  };
                  res.write(`data: ${JSON.stringify(chunkPayload)}\n\n`);
                }
              }
            } catch {
              // ignore
            }
          }
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    // Non-streaming response
    let gResponse = null;
    let usedModel = candidateModels[0];

    for (let i = 0; i < candidateModels.length; i++) {
      usedModel = candidateModels[i];
      const googleEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${usedModel}:generateContent?key=${apiKey}`;
      try {
        const attempt = await fetch(googleEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload)
        });
        if (attempt.ok) {
          gResponse = attempt;
          break;
        }
        const errData = await attempt.json().catch(() => ({}));
        lastErrorMessage = errData.error?.message || `HTTP ${attempt.status}`;
      } catch (e) {
        lastErrorMessage = e.message;
      }
    }

    if (!gResponse || !gResponse.ok) {
      res.status(503).json({
        error: {
          message: lastErrorMessage || 'Model Google AI sedang sibuk. Silakan coba lagi.'
        }
      });
      return;
    }

    const gData = await gResponse.json();
    const candidate = gData.candidates?.[0];
    const replyText = candidate?.content?.parts?.map(p => p.text || '').join('') || '';

    res.status(200).json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: usedModel,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: replyText
          },
          finish_reason: 'stop'
        }
      ]
    });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({
        error: {
          message: `Proxy Error: ${err.message}`
        }
      });
    }
  }
}
