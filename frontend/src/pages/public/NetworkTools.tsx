import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { networkToolsApi } from '../../services/api';
import { Card, Badge, Input, Select, Button, Textarea } from '../../components/ui';
import { useCopyToClipboard, useToast, animate, stagger } from '../../hooks';
import {
  Copy, Check, Globe, Terminal, Search, Wifi, Route, Shield,
  RefreshCw, ExternalLink, Activity, Network, Layers, Server, Key, Braces
} from 'lucide-react';
import { cn } from '../../utils';

// Common TKJ port reference
const commonPorts = [
  { port: 21, proto: 'TCP', name: 'FTP', desc: 'File Transfer Protocol' },
  { port: 22, proto: 'TCP', name: 'SSH', desc: 'Secure Shell remote administration' },
  { port: 23, proto: 'TCP', name: 'Telnet', desc: 'Unencrypted terminal protocol' },
  { port: 53, proto: 'UDP/TCP', name: 'DNS', desc: 'Domain Name System resolution (BIND9)' },
  { port: 67, proto: 'UDP', name: 'DHCP', desc: 'Dynamic Host Configuration Protocol server' },
  { port: 80, proto: 'TCP', name: 'HTTP', desc: 'World Wide Web plaintext traffic (Apache/Nginx)' },
  { port: 443, proto: 'TCP', name: 'HTTPS', desc: 'TLS/SSL encrypted web traffic' },
  { port: 3306, proto: 'TCP', name: 'MySQL / MariaDB', desc: 'Relational database default port' },
  { port: 51820, proto: 'UDP', name: 'WireGuard', desc: 'Modern fast kernel-level VPN tunnel' },
  { port: 8006, proto: 'TCP', name: 'Proxmox VE', desc: 'Proxmox Hypervisor Web Management' },
  { port: 8291, proto: 'TCP', name: 'MikroTik Winbox', desc: 'MikroTik RouterOS Winbox GUI utility' },
  { port: 8728, proto: 'TCP', name: 'RouterOS API', desc: 'MikroTik RouterOS API plaintext service' },
];

const cidrCheatSheet = [
  { cidr: '/24', mask: '255.255.255.0', wildcard: '0.0.0.255', total: 256, usable: 254, use: 'Standard LAN / Lab TKJ' },
  { cidr: '/25', mask: '255.255.255.128', wildcard: '0.0.0.127', total: 128, usable: 126, use: 'Medium Subnet' },
  { cidr: '/26', mask: '255.255.255.192', wildcard: '0.0.0.63', total: 64, usable: 62, use: 'VLAN / Lab Segment' },
  { cidr: '/27', mask: '255.255.255.224', wildcard: '0.0.0.31', total: 32, usable: 30, use: 'Server DMZ / WiFi Hotspot' },
  { cidr: '/28', mask: '255.255.255.240', wildcard: '0.0.0.15', total: 16, usable: 14, use: 'Small Infrastructure Subnet' },
  { cidr: '/29', mask: '255.255.255.248', wildcard: '0.0.0.7', total: 8, usable: 6, use: 'Public Static IP Block (/29)' },
  { cidr: '/30', mask: '255.255.255.252', wildcard: '0.0.0.3', total: 4, usable: 2, use: 'Point-to-Point Router Link' },
];

const networkTools = [
  { id: 'ip-calc', name: 'IP Calculator', icon: Search, description: 'Calculate network details and animated bitmask from IP/CIDR', clientSide: true },
  { id: 'subnet-calc', name: 'Subnet Calculator', icon: Route, description: 'Divide networks into multiple subnets', clientSide: true },
  { id: 'cidr-convert', name: 'CIDR Converter', icon: RefreshCw, description: 'Convert between CIDR notation and subnet mask', clientSide: true },
  { id: 'dns', name: 'DNS Lookup', icon: Globe, description: 'Query DNS records with BIND9 local & Cloudflare support', clientSide: false },
  { id: 'whois', name: 'WHOIS Lookup', icon: Shield, description: 'Get domain registration and ASN information', clientSide: false },
  { id: 'ping', name: 'Ping', icon: Wifi, description: 'Test host reachability and round-trip latency', clientSide: false },
  { id: 'traceroute', name: 'Traceroute', icon: Route, description: 'Trace network path and hops to destination', clientSide: false },
  { id: 'http-headers', name: 'HTTP Headers', icon: ExternalLink, description: 'Inspect remote HTTP response headers and security headers', clientSide: false },
  { id: 'public-ip', name: 'Public IP', icon: Globe, description: 'Determine server and client public IP address', clientSide: false },
];

function IPCalculator() {
  const [ip, setIp] = useState('192.168.88.1');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<{
    network: string;
    broadcast: string;
    first: string;
    last: string;
    hosts: number;
    mask: string;
    wildcard: string;
    binaryMask: string[];
    ipClass: string;
    isPrivate: boolean;
  } | null>(null);

  const { copied, copy } = useCopyToClipboard();

  const calculate = () => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return;

    const safeCidr = Math.min(32, Math.max(0, cidr));
    const mask = safeCidr === 0 ? 0 : ~((1 << (32 - safeCidr)) - 1);
    const wildcard = ~mask;

    const networkParts = parts.map((p, i) => p & ((mask >> (8 * (3 - i))) & 0xff));
    const broadcastParts = parts.map((p, i) => p | ((wildcard >> (8 * (3 - i))) & 0xff));

    const network = networkParts.join('.');
    const broadcast = broadcastParts.join('.');

    let first = network;
    let last = broadcast;
    let hosts = 0;

    if (safeCidr < 31) {
      hosts = Math.pow(2, 32 - safeCidr) - 2;
      const firstParts = [...networkParts];
      firstParts[3] += 1;
      first = firstParts.join('.');

      const lastParts = [...broadcastParts];
      lastParts[3] -= 1;
      last = lastParts.join('.');
    } else if (safeCidr === 31) {
      hosts = 2;
    } else {
      hosts = 1;
    }

    const maskStr = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join('.');
    const wildcardStr = [(wildcard >>> 24) & 0xff, (wildcard >>> 16) & 0xff, (wildcard >>> 8) & 0xff, wildcard & 0xff].join('.');

    const binaryMask = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].map((b) =>
      b.toString(2).padStart(8, '0')
    );

    let ipClass = 'Unknown';
    const firstOctet = parts[0];
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'Class E (Experimental)';

    const isPrivate =
      (firstOctet === 10) ||
      (firstOctet === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (firstOctet === 192 && parts[1] === 168);

    setResult({
      network,
      broadcast,
      first,
      last,
      hosts,
      mask: maskStr,
      wildcard: wildcardStr,
      binaryMask,
      ipClass,
      isPrivate,
    });
  };

  useEffect(() => {
    calculate();
  }, []);

  // Anime.js bitmask wave ripple animation
  useEffect(() => {
    if (result) {
      animate('.bit-dot', {
        scale: [0.6, 1.25, 1],
        opacity: [0.4, 1],
        delay: stagger(14),
        duration: 400,
        ease: 'outBack(1.4)',
      });
    }
  }, [result?.binaryMask]);

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-4">
        <div>
          <h3 className="font-semibold text-dark-100 text-lg font-mono">IPv4 Network & Bitmask Visualizer</h3>
          <p className="text-xs text-dark-400">Kalkulasi presisi alokasi host, network address, dan bitmask representasi visual</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-2xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
          Anime.js Micro-Wave Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="IP Address"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.88.1"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-dark-400 mb-1.5">Prefix Length (CIDR)</label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-400 font-bold text-base">/</span>
            <input
              type="number"
              min={0}
              max={32}
              value={cidr}
              onChange={(e) => setCidr(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-dark-950 border border-dark-750 rounded-lg font-mono text-dark-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <Button onClick={calculate} className="w-full py-2.5 font-medium">
        Kalkulasi Parameter Subnet
      </Button>

      {result && (
        <div className="space-y-6 pt-2">
          {/* Visual Bitmask Wave */}
          <div className="p-4 rounded-xl bg-dark-950/90 border border-dark-800 space-y-2">
            <div className="flex items-center justify-between text-2xs font-mono">
              <span className="text-dark-400 font-medium">32-BIT REPRESENTASI BINARY SUBNET MASK</span>
              <span className="text-emerald-400">/{cidr} ({result.hosts.toLocaleString()} usable)</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {result.binaryMask.map((octet, octetIdx) => (
                <div key={octetIdx} className="p-2 rounded-lg bg-dark-900 border border-dark-800 text-center space-y-1">
                  <div className="flex justify-center gap-1">
                    {octet.split('').map((bit, bitIdx) => (
                      <span
                        key={bitIdx}
                        className={cn(
                          'bit-dot inline-block w-2.5 h-3.5 text-[10px] font-mono font-bold rounded-sm leading-none flex items-center justify-center',
                          bit === '1'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-dark-800 text-dark-500 border border-dark-750'
                        )}
                      >
                        {bit}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-dark-400 block">
                    {parseInt(octet, 2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Network Address', val: result.network, color: 'text-emerald-400' },
              { label: 'Broadcast Address', val: result.broadcast, color: 'text-cyan-400' },
              { label: 'First Usable Host', val: result.first, color: 'text-dark-200' },
              { label: 'Last Usable Host', val: result.last, color: 'text-dark-200' },
              { label: 'Subnet Mask', val: result.mask, color: 'text-dark-100' },
              { label: 'Wildcard Mask', val: result.wildcard, color: 'text-amber-400' },
              { label: 'Usable Hosts', val: result.hosts.toLocaleString(), color: 'text-emerald-400' },
              { label: 'IP Classification', val: `${result.ipClass} ${result.isPrivate ? '(Private RFC 1918)' : '(Public)'}`, color: 'text-indigo-400' },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-dark-950/70 border border-dark-800 rounded-lg">
                <span className="text-[10px] font-mono uppercase text-dark-500 tracking-wider block">{item.label}</span>
                <span className={cn('font-mono text-xs sm:text-sm font-semibold mt-1 block truncate', item.color)}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [subnets, setSubnets] = useState(4);
  const [result, setResult] = useState<any[] | null>(null);

  const calculate = () => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) return;

    const neededBits = Math.ceil(Math.log2(subnets));
    const newCidr = cidr + neededBits;
    if (newCidr > 32) return;

    const blockSize = Math.pow(2, 32 - newCidr);
    const results = [];
    const baseIp = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];

    for (let i = 0; i < subnets; i++) {
      const networkIp = baseIp + (i * blockSize);
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

    setResult(results);
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">Subnet Divider & Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input label="Network IP" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.0" />
        <Input label="CIDR Asal" type="number" min={0} max={30} value={cidr} onChange={(e) => setCidr(parseInt(e.target.value) || 0)} />
        <Input label="Jumlah Subnet yang Diinginkan" type="number" min={1} max={256} value={subnets} onChange={(e) => setSubnets(parseInt(e.target.value) || 1)} />
      </div>
      <Button onClick={calculate} className="mb-4 w-full">Bagi Jaringan Menjadi Subnet</Button>
      {result && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-dark-750 text-left text-dark-400">
                <th className="pb-2">Subnet Network</th>
                <th className="pb-2">Broadcast</th>
                <th className="pb-2">Rentang IP Usable</th>
                <th className="pb-2">Jumlah Host</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {result.map((r, i) => (
                <tr key={i}>
                  <td className="py-2.5 font-bold text-emerald-400">{r.network}</td>
                  <td className="py-2.5 text-dark-200">{r.broadcast}</td>
                  <td className="py-2.5 text-dark-300">{r.range}</td>
                  <td className="py-2.5 text-cyan-400 font-semibold">{r.hosts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function CIDRConverter() {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'cidr' | 'mask'>('cidr');
  const [result, setResult] = useState('');

  const convert = () => {
    if (type === 'cidr') {
      const cidr = parseInt(input, 10);
      if (cidr < 0 || cidr > 32) return;
      const mask = ~((1 << (32 - cidr)) - 1);
      const maskStr = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join('.');
      setResult(`${maskStr} (/${cidr})`);
    } else {
      const parts = input.split('.').map(Number);
      if (parts.length !== 4) return;
      let mask = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      let cidr = 0;
      while (mask & 0x80000000) { cidr++; mask <<= 1; }
      setResult(`/${cidr} (${input})`);
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">CIDR ↔ Subnet Mask Converter</h3>
      <Select value={type} onChange={(e) => setType(e.target.value as 'cidr' | 'mask')} options={[
        { value: 'cidr', label: 'CIDR → Subnet Mask' },
        { value: 'mask', label: 'Subnet Mask → CIDR' },
      ]} className="mb-4" />
      <Input
        label={type === 'cidr' ? 'CIDR (0-32)' : 'Subnet Mask (contoh: 255.255.255.0)'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={type === 'cidr' ? '24' : '255.255.255.0'}
      />
      <Button onClick={convert} className="mb-4 w-full mt-4">Konversi Nilai</Button>
      {result && (
        <div className="bg-dark-950 p-4 rounded-lg font-mono text-emerald-400 flex items-center justify-between border border-dark-800">
          <span>{result}</span>
          <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(result)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}

function DNSLookup() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState<'ALL' | 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME' | 'SOA'>('ALL');
  const [dnsServer, setDnsServer] = useState('auto');
  const { showToast } = useToast();
  const { mutate, isPending, data } = useMutation({
    mutationFn: ({ domain, type, server }: { domain: string; type: string; server: string }) =>
      networkToolsApi.dnsLookup(domain, type, server),
    onError: () => showToast('DNS lookup failed', 'error'),
  });

  const handleLookup = () => {
    if (domain.trim()) mutate({ domain, type: recordType, server: dnsServer });
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">DNS Lookup (Support BIND9 Lokal & Cloudflare)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="SabbilAF.Network atau google.com" />
        <Select
          value={dnsServer}
          onChange={(e) => setDnsServer(e.target.value)}
          options={[
            { value: 'auto', label: 'Auto (BIND9 Lokal 127.0.0.1 + Cloudflare/Google)' },
            { value: 'bind9', label: 'BIND9 Lokal (127.0.0.1)' },
            { value: 'cloudflare', label: 'Cloudflare DNS (1.1.1.1)' },
            { value: 'google', label: 'Google DNS (8.8.8.8)' },
          ]}
        />
        <Select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value as any)}
          options={[
            { value: 'ALL', label: 'ALL Records' },
            { value: 'A', label: 'A (IPv4)' },
            { value: 'AAAA', label: 'AAAA (IPv6)' },
            { value: 'MX', label: 'MX (Mail)' },
            { value: 'TXT', label: 'TXT' },
            { value: 'NS', label: 'NS' },
            { value: 'CNAME', label: 'CNAME' },
            { value: 'SOA', label: 'SOA' },
          ]}
        />
      </div>
      <Button onClick={handleLookup} loading={isPending} className="mb-4 w-full">Lakukan DNS Lookup</Button>
      {data && (
        <Textarea label="Hasil Resolusi DNS" value={JSON.stringify(data, null, 2)} readOnly rows={12} className="font-mono text-xs" />
      )}
    </Card>
  );
}

function WHOISLookup() {
  const [domain, setDomain] = useState('');
  const { showToast } = useToast();
  const { mutate, isPending, data } = useMutation({
    mutationFn: (domain: string) => networkToolsApi.whois(domain),
    onError: () => showToast('WHOIS lookup failed', 'error'),
  });

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">WHOIS Domain & ASN Lookup</h3>
      <Input label="Domain / Hostname" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" className="mb-4" />
      <Button onClick={() => domain.trim() && mutate(domain)} loading={isPending} className="mb-4 w-full">Lookup WHOIS</Button>
      {data && <Textarea label="Hasil WHOIS" value={JSON.stringify(data, null, 2)} readOnly rows={12} className="font-mono text-xs" />}
    </Card>
  );
}

function PingTool() {
  const [host, setHost] = useState('');
  const { showToast } = useToast();
  const { mutate, isPending, data } = useMutation({
    mutationFn: (host: string) => networkToolsApi.ping(host),
    onError: () => showToast('Ping failed', 'error'),
  });

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">ICMP Ping Reachability Tester</h3>
      <Input label="Target IP / Hostname" value={host} onChange={(e) => setHost(e.target.value)} placeholder="8.8.8.8 atau 192.168.88.1" className="mb-4" />
      <Button onClick={() => host.trim() && mutate(host)} loading={isPending} className="mb-4 w-full">Kirim ICMP Ping</Button>
      {data && <Textarea label="Hasil Ping" value={JSON.stringify(data, null, 2)} readOnly rows={8} className="font-mono text-xs" />}
    </Card>
  );
}

function TracerouteTool() {
  const [host, setHost] = useState('');
  const { showToast } = useToast();
  const { mutate, isPending, data } = useMutation({
    mutationFn: (host: string) => networkToolsApi.traceroute(host),
    onError: () => showToast('Traceroute failed', 'error'),
  });

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">Traceroute Hop Diagnostics</h3>
      <Input label="Target Host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="8.8.8.8 atau google.com" className="mb-4" />
      <Button onClick={() => host.trim() && mutate(host)} loading={isPending} className="mb-4 w-full">Lacak Rute Hops</Button>
      {data && <Textarea label="Hasil Traceroute" value={JSON.stringify(data, null, 2)} readOnly rows={10} className="font-mono text-xs" />}
    </Card>
  );
}

function HTTPHeadersTool() {
  const [url, setUrl] = useState('');
  const { showToast } = useToast();
  const { mutate, isPending, data } = useMutation({
    mutationFn: (url: string) => networkToolsApi.httpHeaders(url),
    onError: () => showToast('Failed to fetch headers', 'error'),
  });

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">HTTP Response Headers Inspector</h3>
      <Input label="URL Target" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="mb-4" />
      <Button onClick={() => url.trim() && mutate(url)} loading={isPending} className="mb-4 w-full">Periksa HTTP Headers</Button>
      {data && <Textarea label="HTTP Response Headers" value={JSON.stringify(data, null, 2)} readOnly rows={12} className="font-mono text-xs" />}
    </Card>
  );
}

function PublicIPTool() {
  const { showToast } = useToast();
  const { mutate, isPending, data } = useMutation({
    mutationFn: () => networkToolsApi.publicIp(),
    onError: () => showToast('Failed to get public IP', 'error'),
  });

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 text-lg mb-4 font-mono">Public IP Address & Gateway</h3>
      <Button onClick={() => mutate()} loading={isPending} className="mb-4 w-full">Deteksi Public IP Node</Button>
      {data && (
        <div className="bg-dark-950 p-4 rounded-lg font-mono text-base text-emerald-400 flex items-center justify-between border border-dark-800">
          <span>{(data as any).ip || JSON.stringify(data)}</span>
          <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText((data as any).ip || JSON.stringify(data))}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}

export function NetworkTools() {
  const [activeTool, setActiveTool] = useState<string | null>('ip-calc');
  const [portFilter, setPortFilter] = useState('');

  const filteredPorts = commonPorts.filter(
    (p) =>
      p.name.toLowerCase().includes(portFilter.toLowerCase()) ||
      p.port.toString().includes(portFilter) ||
      p.desc.toLowerCase().includes(portFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Network Tools</h1>
        <p className="text-dark-400 text-sm mt-1">
          Infrastruktur diagnostik jaringan, kalkulator subnet TKJ, DNS resolver BIND9 lokal, dan referensi protokol
        </p>
      </div>

      {/* Grid of Diagnostic Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {networkTools.map((tool) => (
          <Card
            key={tool.id}
            className={cn(
              'card-hover cursor-pointer p-4 bg-dark-900/60 border border-dark-800 transition-all',
              activeTool === tool.id && 'border-emerald-500/50 bg-dark-900/90 shadow-console'
            )}
            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'p-2.5 rounded-xl border border-white/5',
                activeTool === tool.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-dark-850 text-dark-400'
              )}>
                <tool.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-dark-100 text-sm font-mono truncate">{tool.name}</h3>
                  {activeTool === tool.id && <Badge variant="primary" className="text-2xs">Active</Badge>}
                </div>
                <p className="text-dark-400 text-xs mt-1 line-clamp-2 leading-relaxed">{tool.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Active Diagnostic View */}
      {activeTool && (
        <div className="animate-in pt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
              {networkTools.find((t) => t.id === activeTool)?.name}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setActiveTool(null)} className="text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Tutup Tool
            </Button>
          </div>
          {activeTool === 'ip-calc' && <IPCalculator />}
          {activeTool === 'subnet-calc' && <SubnetCalculator />}
          {activeTool === 'cidr-convert' && <CIDRConverter />}
          {activeTool === 'dns' && <DNSLookup />}
          {activeTool === 'whois' && <WHOISLookup />}
          {activeTool === 'ping' && <PingTool />}
          {activeTool === 'traceroute' && <TracerouteTool />}
          {activeTool === 'http-headers' && <HTTPHeadersTool />}
          {activeTool === 'public-ip' && <PublicIPTool />}
        </div>
      )}

      {/* Permanent Reference Section 1: CIDR & Subnetting Cheat Sheet */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-dark-800/80 pb-3">
          <Layers className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
            CIDR & Subnetting Cheat Sheet (TKJ Reference)
          </h2>
        </div>
        <Card className="p-5 bg-dark-900/60 border border-dark-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-dark-750 text-dark-500 text-2xs">
                  <th className="pb-2.5 font-medium">PREFIX</th>
                  <th className="pb-2.5 font-medium">SUBNET MASK</th>
                  <th className="pb-2.5 font-medium">WILDCARD</th>
                  <th className="pb-2.5 font-medium">TOTAL / USABLE HOSTS</th>
                  <th className="pb-2.5 font-medium">PENGGUNAAN LAZIM LAB TKJ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {cidrCheatSheet.map((item) => (
                  <tr key={item.cidr} className="hover:bg-dark-850/50">
                    <td className="py-2.5 font-bold text-emerald-400">{item.cidr}</td>
                    <td className="py-2.5 text-dark-200">{item.mask}</td>
                    <td className="py-2.5 text-cyan-400">{item.wildcard}</td>
                    <td className="py-2.5 text-dark-300">{item.total} / <span className="text-emerald-400 font-semibold">{item.usable}</span></td>
                    <td className="py-2.5 text-dark-400 font-sans text-xs">{item.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Permanent Reference Section 2: Essential TKJ Network Ports */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
              Daftar Port Jaringan Esensial (TKJ Protocol Matrix)
            </h2>
          </div>
          <Input
            placeholder="Cari nomor port / nama service..."
            value={portFilter}
            onChange={(e) => setPortFilter(e.target.value)}
            className="w-full sm:w-64"
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPorts.map((p) => (
            <div key={p.port} className="p-3 rounded-xl bg-dark-900/60 border border-dark-800 flex items-start gap-3 hover:border-dark-700 transition-colors">
              <div className="p-2 rounded-lg bg-dark-850 border border-dark-750 font-mono text-xs font-bold text-emerald-400 min-w-[52px] text-center">
                {p.port}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-dark-100 font-mono">{p.name}</span>
                  <span className="text-2xs font-mono text-dark-500">{p.proto}</span>
                </div>
                <p className="text-2xs text-dark-400 mt-0.5 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default NetworkTools;