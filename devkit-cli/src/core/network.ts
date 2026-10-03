import { promises as dns } from 'node:dns';
import { networkInterfaces } from 'node:os';

export interface SubnetCalculation {
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
}

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255
  ].join('.');
}

export function calculateSubnet(cidrStr: string): SubnetCalculation {
  const [ip, maskStr] = cidrStr.trim().split('/');
  const prefix = parseInt(maskStr, 10);

  if (!ip || isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new Error('Invalid CIDR format. Expected format: 192.168.1.0/24');
  }

  const ipLong = ipToLong(ip);
  const maskLong = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const wildcardLong = ~maskLong >>> 0;

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalHosts - 2;

  const firstUsableLong = prefix >= 31 ? networkLong : networkLong + 1;
  const lastUsableLong = prefix >= 31 ? broadcastLong : broadcastLong - 1;

  let ipClass = 'Classless';
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
  else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'Class E (Experimental)';

  return {
    cidr: `${longToIp(networkLong)}/${prefix}`,
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    subnetMask: longToIp(maskLong),
    wildcardMask: longToIp(wildcardLong),
    firstUsableIp: longToIp(firstUsableLong),
    lastUsableIp: longToIp(lastUsableLong),
    totalHosts,
    usableHosts,
    ipClass
  };
}

export async function lookupDns(domain: string): Promise<Record<string, unknown>> {
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
  const results: Record<string, unknown> = {};

  try {
    results.A = await dns.resolve4(cleanDomain);
  } catch {
    results.A = [];
  }

  try {
    results.AAAA = await dns.resolve6(cleanDomain);
  } catch {
    results.AAAA = [];
  }

  try {
    results.MX = await dns.resolveMx(cleanDomain);
  } catch {
    results.MX = [];
  }

  try {
    results.TXT = await dns.resolveTxt(cleanDomain);
  } catch {
    results.TXT = [];
  }

  return results;
}

export function getLocalIpAddresses(): Array<{ interface: string; address: string; family: string }> {
  const nets = networkInterfaces();
  const results: Array<{ interface: string; address: string; family: string }> = [];

  for (const name of Object.keys(nets)) {
    const netList = nets[name];
    if (netList) {
      for (const net of netList) {
        if (!net.internal) {
          results.push({
            interface: name,
            address: net.address,
            family: net.family
          });
        }
      }
    }
  }

  return results;
}
