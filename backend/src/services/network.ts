import { execFile } from 'child_process';
import { promisify } from 'util';
import dns from 'dns';
import { lookup } from 'dns/promises';
import fetch from 'node-fetch';
import net from 'net';
import ping from 'ping';
import traceroute from 'traceroute';
import { config } from '../config';

const execFileAsync = promisify(execFile);
const dnsResolve = promisify(dns.resolve);
const dnsResolveAny = promisify(dns.resolveAny);

export async function dnsLookup(domain: string) {
  const start = Date.now();
  try {
    const [addresses, mxRecords, txtRecords, nsRecords, cnameRecords] = await Promise.allSettled([
      dnsResolve(domain, 'A'),
      dnsResolve(domain, 'MX'),
      dnsResolve(domain, 'TXT'),
      dnsResolve(domain, 'NS'),
      dnsResolve(domain, 'CNAME'),
    ]);

    const results: Record<string, any> = {};
    if (addresses.status === 'fulfilled') results.A = addresses.value;
    if (mxRecords.status === 'fulfilled') results.MX = mxRecords.value;
    if (txtRecords.status === 'fulfilled') results.TXT = txtRecords.value;
    if (nsRecords.status === 'fulfilled') results.NS = nsRecords.value;
    if (cnameRecords.status === 'fulfilled') results.CNAME = cnameRecords.value;

    return { success: true, data: results, executionTime: Date.now() - start };
  } catch (err) {
    return { success: false, error: 'DNS lookup failed', executionTime: Date.now() - start };
  }
}

function queryWhoisSocket(query: string, server: string, port = 43, timeout = 7000): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: server, port, timeout }, () => {
      socket.write(query + '\r\n');
    });
    let data = '';
    socket.setEncoding('utf8');
    socket.on('data', chunk => { data += chunk; });
    socket.on('end', () => resolve(data));
    socket.on('error', err => reject(err));
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('WHOIS query timed out'));
    });
  });
}

export async function whoisLookup(domain: string) {
  const start = Date.now();
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  // Strategy 1: System whois CLI if available
  try {
    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(execFile);
    const { stdout } = await execAsync('whois', [cleanDomain], { timeout: 8000 });
    if (stdout && stdout.length > 50) {
      return { success: true, data: { domain: cleanDomain, whois: stdout.slice(0, 10000) }, executionTime: Date.now() - start };
    }
  } catch (err) {
    // Continue to socket fallback
  }

  // Strategy 2: Direct TCP socket query to IANA -> TLD WHOIS
  try {
    const tld = cleanDomain.split('.').pop() || '';
    let targetServer = 'whois.iana.org';
    
    // Common TLD whois servers map for speed
    const tldServers: Record<string, string> = {
      com: 'whois.verisign-grs.com',
      net: 'whois.verisign-grs.com',
      org: 'whois.pir.org',
      id: 'whois.idnic.net',
      my: 'whois.mynic.my',
      io: 'whois.nic.io',
      dev: 'whois.nic.google',
      app: 'whois.nic.google',
      me: 'whois.nic.me',
      info: 'whois.afilias.net',
    };

    if (tldServers[tld]) {
      targetServer = tldServers[tld];
    } else {
      // Query IANA first
      const ianaData = await queryWhoisSocket(cleanDomain, 'whois.iana.org');
      const match = ianaData.match(/whois:\s*([^\s]+)/i) || ianaData.match(/refer:\s*([^\s]+)/i);
      if (match && match[1]) {
        targetServer = match[1];
      }
    }

    const whoisText = await queryWhoisSocket(cleanDomain, targetServer);
    return {
      success: true,
      data: { domain: cleanDomain, whois: whoisText.slice(0, 10000), server: targetServer },
      executionTime: Date.now() - start,
    };
  } catch (socketErr: any) {
    return {
      success: false,
      error: socketErr?.message || 'WHOIS lookup failed',
      executionTime: Date.now() - start,
    };
  }
}

export async function pingHost(host: string) {
  const start = Date.now();
  try {
    const result = await ping.promise.probe(host, { timeout: 5, extra: ['-c', '3'] });
    return {
      success: result.alive,
      data: {
        host: result.host,
        alive: result.alive,
        time: result.time,
        min: result.min,
        max: result.max,
        avg: result.avg,
        packetLoss: result.packetLoss,
      },
      executionTime: Date.now() - start,
    };
  } catch (err) {
    return { success: false, error: 'Ping failed', executionTime: Date.now() - start };
  }
}

export async function checkPort(host: string, port: number, timeout = 4000) {
  const start = Date.now();
  return new Promise<{ success: boolean; data: { host: string; port: number; status: 'open' | 'closed' | 'filtered' | 'timeout'; message: string }; executionTime: number }>((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({
        success: true,
        data: { host, port, status: 'open', message: `Port ${port} is OPEN and accepting connections.` },
        executionTime: Date.now() - start,
      });
    });

    socket.on('timeout', () => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({
        success: true,
        data: { host, port, status: 'timeout', message: `Connection to port ${port} TIMED OUT after ${timeout}ms (likely filtered/firewalled).` },
        executionTime: Date.now() - start,
      });
    });

    socket.on('error', (err: any) => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      const isRefused = err?.code === 'ECONNREFUSED';
      resolve({
        success: true,
        data: { 
          host, 
          port, 
          status: isRefused ? 'closed' : 'filtered', 
          message: isRefused ? `Port ${port} is CLOSED (Connection refused by host).` : `Error connecting to port ${port}: ${err.message || 'Unknown error'}` 
        },
        executionTime: Date.now() - start,
      });
    });

    try {
      socket.connect(port, host);
    } catch (err: any) {
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          data: { host, port, status: 'closed', message: err.message || 'Failed to connect' },
          executionTime: Date.now() - start,
        });
      }
    }
  });
}

export async function tracerouteHost(host: string) {
  const start = Date.now();
  try {
    const hops = await new Promise<any[]>((resolve, reject) => {
      traceroute.trace(host, (err: Error | null, hops: any[]) => {
        if (err) reject(err);
        else resolve(hops);
      });
    });
    return { success: true, data: { host, hops: hops.slice(0, 30) }, executionTime: Date.now() - start };
  } catch (err) {
    return { success: false, error: 'Traceroute failed', executionTime: Date.now() - start };
  }
}

export async function httpHeaders(url: string) {
  const start = Date.now();
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000), redirect: 'follow' });
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => { headers[key] = value; });
    return { success: true, data: { url, status: response.status, headers }, executionTime: Date.now() - start };
  } catch (err) {
    return { success: false, error: 'Failed to fetch headers', executionTime: Date.now() - start };
  }
}

export async function publicIp() {
  const start = Date.now();
  try {
    const response = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
    const data = (await response.json()) as { ip: string };
    return { success: true, data: { ip: data.ip }, executionTime: Date.now() - start };
  } catch (err) {
    return { success: false, error: 'Failed to get public IP', executionTime: Date.now() - start };
  }
}

export function calculateIpInfo(ip: string, cidr: number) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => p < 0 || p > 255) || cidr < 0 || cidr > 32) {
    return { success: false, error: 'Invalid IP or CIDR' };
  }

  const mask = ~((1 << (32 - cidr)) - 1);
  const network = parts.map((p, i) => p & ((mask >> (8 * (3 - i))) & 0xff)).join('.');
  const broadcast = parts.map((p, i) => p | (~((mask >> (8 * (3 - i))) & 0xff) & 0xff)).join('.');
  const first = network.split('.').map((p, i) => i === 3 ? parseInt(p) + 1 : p).join('.');
  const last = broadcast.split('.').map((p, i) => i === 3 ? parseInt(p) - 1 : p).join('.');
  const hosts = Math.max(0, (1 << (32 - cidr)) - 2);
  const maskStr = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join('.');
  let ipClass = '';
  const firstOctet = parts[0];
  if (firstOctet <= 127) ipClass = 'A';
  else if (firstOctet <= 191) ipClass = 'B';
  else if (firstOctet <= 223) ipClass = 'C';
  else if (firstOctet <= 239) ipClass = 'D (Multicast)';
  else ipClass = 'E (Reserved)';

  return {
    success: true,
    data: {
      network, broadcast, first, last,
      hosts: hosts.toLocaleString(),
      mask: maskStr,
      cidr: `/${cidr}`,
      class: ipClass,
    },
  };
}

export function calculateSubnets(ip: string, cidr: number, subnets: number) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) {
    return { success: false, error: 'Invalid IP' };
  }

  const newCidr = cidr + Math.ceil(Math.log2(subnets));
  if (newCidr > 30) return { success: false, error: 'Too many subnets for given CIDR' };

  const blockSize = 1 << (32 - newCidr);
  const baseIp = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
  const results = [];

  for (let i = 0; i < subnets; i++) {
    const networkIp = baseIp + i * blockSize;
    const network = [
      (networkIp >>> 24) & 0xff,
      (networkIp >>> 16) & 0xff,
      (networkIp >>> 8) & 0xff,
      networkIp & 0xff,
    ].join('.');
    const broadcastIp = networkIp + blockSize - 1;
    const broadcast = [
      (broadcastIp >>> 24) & 0xff,
      (broadcastIp >>> 16) & 0xff,
      (broadcastIp >>> 8) & 0xff,
      broadcastIp & 0xff,
    ].join('.');
    const first = network.split('.').map((p, idx) => idx === 3 ? parseInt(p) + 1 : p).join('.');
    const last = broadcast.split('.').map((p, idx) => idx === 3 ? parseInt(p) - 1 : p).join('.');
    const hosts = Math.max(0, blockSize - 2);

    results.push({ network: `${network}/${newCidr}`, broadcast, range: `${first} - ${last}`, hosts });
  }

  return { success: true, data: results };
}

export function convertCidr(value: string, type: 'cidr' | 'mask') {
  if (type === 'cidr') {
    const cidr = parseInt(value, 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return { success: false, error: 'Invalid CIDR' };
    const mask = ~((1 << (32 - cidr)) - 1);
    const maskStr = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join('.');
    return { success: true, data: { cidr: `/${cidr}`, mask: maskStr } };
  } else {
    const parts = value.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) return { success: false, error: 'Invalid subnet mask' };
    let mask = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
    let cidr = 0;
    while (mask & 0x80000000) { cidr++; mask <<= 1; }
    return { success: true, data: { cidr: `/${cidr}`, mask: value } };
  }
}