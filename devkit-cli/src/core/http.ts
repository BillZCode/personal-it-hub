import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

export interface HttpTimingResult {
  dnsLookupMs: number;
  tcpConnectionMs: number;
  tlsHandshakeMs: number;
  firstByteMs: number;
  totalMs: number;
  statusCode?: number;
  headers: Record<string, string | string[] | undefined>;
}

export async function measureHttpTiming(targetUrl: string): Promise<HttpTimingResult> {
  return new Promise((resolve, reject) => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    } catch {
      return reject(new Error(`Invalid URL: "${targetUrl}"`));
    }

    const client = parsedUrl.protocol === 'https:' ? https : http;
    const startTime = process.hrtime.bigint();

    let dnsTime = 0n;
    let tcpTime = 0n;
    let tlsTime = 0n;
    let firstByteTime = 0n;

    const req = client.request(
      parsedUrl,
      {
        method: 'GET',
        headers: { 'User-Agent': 'devkit-cli/1.0.0' }
      },
      (res) => {
        firstByteTime = process.hrtime.bigint();

        res.on('data', () => {});
        res.on('end', () => {
          const endTime = process.hrtime.bigint();

          const toMs = (diffNs: bigint) => Number(diffNs) / 1e6;

          resolve({
            dnsLookupMs: dnsTime > 0n ? Number(toMs(dnsTime - startTime).toFixed(2)) : 0,
            tcpConnectionMs: tcpTime > 0n ? Number(toMs(tcpTime - (dnsTime || startTime)).toFixed(2)) : 0,
            tlsHandshakeMs: tlsTime > 0n ? Number(toMs(tlsTime - tcpTime).toFixed(2)) : 0,
            firstByteMs: Number(toMs(firstByteTime - startTime).toFixed(2)),
            totalMs: Number(toMs(endTime - startTime).toFixed(2)),
            statusCode: res.statusCode,
            headers: res.headers as Record<string, string | string[] | undefined>
          });
        });
      }
    );

    req.on('socket', (socket) => {
      socket.on('lookup', () => {
        dnsTime = process.hrtime.bigint();
      });
      socket.on('connect', () => {
        tcpTime = process.hrtime.bigint();
      });
      socket.on('secureConnect', () => {
        tlsTime = process.hrtime.bigint();
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('HTTP request timed out after 10000ms'));
    });

    req.end();
  });
}

export async function requestApi(
  method: string,
  urlStr: string,
  options: {
    headers?: Record<string, string>;
    data?: string;
    json?: boolean;
    timeout?: number;
  } = {}
): Promise<{
  status: number;
  statusText: string;
  durationMs: number;
  headers: Record<string, string>;
  body: string;
  json?: unknown;
}> {
  const parsedUrl = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
  const reqHeaders: Record<string, string> = {
    'User-Agent': 'devkit-cli/1.0.0',
    ...(options.headers || {})
  };

  if (options.json && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  const start = Date.now();
  const res = await fetch(parsedUrl.toString(), {
    method: method.toUpperCase(),
    headers: reqHeaders,
    body: options.data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) ? options.data : undefined,
    signal: AbortSignal.timeout(options.timeout || 10000)
  });

  const durationMs = Date.now() - start;
  const rawBody = await res.text();
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    parsedJson = undefined;
  }

  const resHeaders: Record<string, string> = {};
  res.headers.forEach((val, key) => {
    resHeaders[key] = val;
  });

  return {
    status: res.status,
    statusText: res.statusText,
    durationMs,
    headers: resHeaders,
    body: rawBody,
    json: parsedJson
  };
}
