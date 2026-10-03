import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OMNI_DIR = path.resolve(__dirname, '../omni-ai');
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3002;

// Load server environment API key if present in .env
function getServerApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  if (process.env.GOOGLE_AI_KEY) return process.env.GOOGLE_AI_KEY.trim();
  if (process.env.OMNI_AI_KEY) return process.env.OMNI_AI_KEY.trim();

  // Try reading from .env file
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*(?:GEMINI_API_KEY|GOOGLE_AI_KEY|OMNI_AI_KEY)\s*=\s*["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    } catch {
      // ignore
    }
  }
  return '';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // 1. Status & Config Endpoint (Safely indicates if server default key is configured without exposing it)
  const isConfigRoute = (
    pathname === '/api/config' ||
    pathname === '/v1/config' ||
    pathname === '/chatbot/api/config' ||
    pathname === '/chatbot/v1/config'
  );
  if (isConfigRoute) {
    const defaultKey = getServerApiKey();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify({
      hasServerKey: !!defaultKey,
      keyLength: defaultKey ? defaultKey.length : 0,
      maskedKey: defaultKey ? `${defaultKey.slice(0, 4)}••••${defaultKey.slice(-4)}` : null,
      serverTime: new Date().toISOString()
    }));
    return;
  }

  // 2. Chat Completions Proxy (OpenAI / OpenRouter / Custom compatible + Server fallback support)
  const isChatRoute = (
    pathname === '/v1/chat/completions' ||
    pathname === '/api/chat' ||
    pathname === '/chatbot/v1/chat/completions' ||
    pathname === '/chatbot/api/chat'
  );
  if (isChatRoute && req.method === 'POST') {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyData || '{}');
        const customAuth = req.headers['authorization'] || '';
        let apiKey = '';

        if (customAuth.startsWith('Bearer ')) {
          apiKey = customAuth.slice(7).trim();
        }

        // If client sends placeholder or empty key, fallback to server default key
        if (!apiKey || apiKey === '__SERVER_DEFAULT__' || apiKey === 'server_default') {
          apiKey = getServerApiKey();
        }

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            error: {
              message: 'Tidak ada API Key yang dikonfigurasi. Silakan masukkan API Key Anda di menu Pengaturan Model (ikon gear ⚙️).'
            }
          }));
          return;
        }

        const requestedModel = payload.model || 'gemini-flash-latest';
        const messages = payload.messages || [];

        // Convert standard OpenAI-format messages to Gemini contents format
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
                if (part.type === 'text') {
                  if (part.text) parts.push({ text: part.text });
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

        const candidateModels = [
          requestedModel,
          'gemini-flash-latest',
          'gemini-flash-lite-latest',
          'gemini-3-flash-preview',
          'gemini-robotics-er-2-preview',
          'gemma-4-26b-a4b-it'
        ].filter((v, i, a) => a.indexOf(v) === i);

        let lastErrorMessage = '';

        if (payload.stream) {
          // Stream SSE response with automatic model fallback
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
              console.warn(`Model ${usedStreamModel} returned ${resAttempt.status}: ${lastErrorMessage}`);
            } catch (e) {
              lastErrorMessage = e.message;
              console.warn(`Error attempting model ${usedStreamModel}:`, e.message);
            }
          }

          if (!streamResponse) {
            res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
              error: {
                message: lastErrorMessage || 'Semua model Google AI sedang sibuk atau mengalami spike antrean. Silakan coba lagi beberapa saat.'
              }
            }));
            return;
          }

          res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          });

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
                  // ignore malformed SSE line
                }
              }
            }
          }

          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }

        // Non-streaming response with model cascade
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
            console.warn(`Non-stream attempt failed for ${usedModel}: ${lastErrorMessage}`);
          } catch (e) {
            lastErrorMessage = e.message;
            console.warn(`Non-stream attempt failed for ${usedModel}:`, e.message);
          }
        }

        if (!gResponse || !gResponse.ok) {
          res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            error: {
              message: lastErrorMessage || 'Semua model Google AI sedang sibuk. Silakan coba beberapa saat lagi.'
            }
          }));
          return;
        }

        const gData = await gResponse.json();
        const candidate = gData.candidates?.[0];
        const replyText = candidate?.content?.parts?.map(p => p.text || '').join('') || '';

        // Return OpenAI compatible response format
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
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
        }));
      } catch (err) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            error: {
              message: `Internal Proxy Error: ${err.message}`
            }
          }));
        }
      }
    });
    return;
  }

  // 3. Static File Serving
  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(OMNI_DIR, safePath);

  // If path is a directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  const hasKey = !!getServerApiKey();
  console.log(`🤖 Omni AI running at http://localhost:${PORT} (proxy: http://localhost:3000/chatbot)`);
  console.log(`🔑 Server Default API Key configured: ${hasKey ? 'YES (Protected)' : 'NO (User BYOK Mode)'}`);
});
