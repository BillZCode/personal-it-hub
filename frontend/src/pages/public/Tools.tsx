import { useState, useEffect } from 'react';
import { Card, Badge, Input, Textarea, Button, Select } from '../../components/ui';
import { useCopyToClipboard, useToast } from '../../hooks';
import { networkToolsApi } from '../../services/api';
import { Copy, Check, Download, RefreshCw, Hash, QrCode, Braces, Clock, Globe, FileText, Terminal, Key } from 'lucide-react';
import { cn } from '../../utils';
import * as QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

const tools = [
  { id: 'downloader', name: 'File & Media Downloader', icon: Download, description: 'Universal video/photo TikTok, YouTube & file downloader via backend yt-dlp', clientSide: true },
  { id: 'ip-checker', name: 'IP Address Checker', icon: Globe, description: 'Check your public IP address and network gateway', clientSide: true },
  { id: 'dns-lookup', name: 'DNS Lookup', icon: Globe, description: 'Query DNS records for any domain', clientSide: false },
  { id: 'ping', name: 'Ping Tester', icon: Terminal, description: 'Test network connectivity to a host', clientSide: false },
  { id: 'port-checker', name: 'Port Checker', icon: Key, description: 'Check if a port is open on a host', clientSide: false },
  { id: 'subnet-calc', name: 'Subnet Calculator', icon: Braces, description: 'Calculate subnet information from IP/CIDR', clientSide: true },
  { id: 'base64', name: 'Base64 Encoder/Decoder', icon: FileText, description: 'Encode or decode Base64 strings', clientSide: true },
  { id: 'hash', name: 'Hash Generator', icon: Hash, description: 'Generate cryptographic hashes (MD5, SHA1, SHA256, SHA512)', clientSide: true },
  { id: 'json-format', name: 'JSON Formatter', icon: Braces, description: 'Format, validate, and minify JSON', clientSide: true },
  { id: 'timestamp', name: 'Timestamp Converter', icon: Clock, description: 'Convert between Unix timestamps and human dates', clientSide: true },
  { id: 'qr-gen', name: 'QR Code Generator', icon: QrCode, description: 'Generate QR codes from text or URLs', clientSide: true },
];

function FileDownloader() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const { showToast } = useToast();

  const handleDownload = async () => {
    if (!url.trim()) return;
    setDownloading(true);
    setError('');
    setMediaInfo(null);

    try {
      // Send URL to backend resolver
      const resolveResp = await fetch('/api/download/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!resolveResp.ok) {
        throw new Error(`Gagal memproses URL (HTTP ${resolveResp.status})`);
      }

      const info = await resolveResp.json();
      if (!info.success) {
        throw new Error(info.message || 'Media tidak ditemukan atau gagal diproses');
      }

      setMediaInfo(info);

      if (info.externalHelper && info.downloadUrl) {
        window.open(info.downloadUrl, '_blank');
        showToast('Membuka tautan unduhan eksternal', 'info');
        setDownloading(false);
        return;
      }

      // Determine final download URL & filename
      let downloadLink = info.downloadUrl;
      let finalName = '';
      if (fileName.trim()) {
        finalName = fileName.trim();
        if (!finalName.includes('.')) {
          finalName += info.type === 'video' ? '.mp4' : '.jpg';
        }
        const urlObj = new URL(downloadLink, window.location.origin);
        urlObj.searchParams.set('filename', finalName);
        downloadLink = urlObj.pathname + urlObj.search;
      }

      const a = document.createElement('a');
      a.href = downloadLink;
      if (finalName) a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (info.type === 'photo') {
        showToast('Tautan ini adalah postingan FOTO TikTok (bukan video). Foto berhasil diunduh!', 'info');
      } else {
        showToast('Unduhan media berhasil dimulai!', 'success');
      }
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Gagal mengunduh berkas');
      showToast('Gagal mengunduh: ' + (err.message || 'Terjadi kesalahan'), 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="p-6 border border-dark-800 bg-dark-900/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-dark-800">
        <div>
          <h3 className="font-semibold text-dark-100 text-lg font-mono">Universal Media & File Downloader</h3>
          <p className="text-xs text-dark-400">Mendukung ekstraksi video/foto TikTok tanpa watermark, YouTube, dan unduhan file langsung</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-2xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
          yt-dlp Engine Active
        </span>
      </div>

      <div className="space-y-4">
        <Input 
          label="URL Media / File" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Contoh: https://www.tiktok.com/@user/video/... atau https://youtube.com/watch?v=... atau tautan berkas langsung" 
        />
        <Input 
          label="Simpan Sebagai Nama File (Opsional)" 
          value={fileName} 
          onChange={(e) => setFileName(e.target.value)} 
          placeholder="video.mp4 / gambar.jpg" 
        />

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        {mediaInfo && (
          <div className="p-4 bg-dark-950/80 border border-dark-800 rounded-xl flex items-center gap-4 animate-in">
            {mediaInfo.thumbnail && (
              <img 
                src={mediaInfo.thumbnail} 
                alt="Thumbnail" 
                className="w-16 h-16 rounded-lg object-cover border border-dark-750 flex-shrink-0" 
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={mediaInfo.type === 'video' ? 'success' : 'info'} className="text-2xs uppercase font-mono">
                  {mediaInfo.platform} : {mediaInfo.type}
                </Badge>
                {mediaInfo.type === 'photo' && (
                  <span className="text-2xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                    Format Foto Slide (Bukan Video)
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-dark-100 truncate">{mediaInfo.title}</p>
            </div>
          </div>
        )}

        <Button onClick={handleDownload} loading={downloading} className="w-full py-2.5 font-medium">
          <Download className="h-4 w-4 mr-2" />
          {downloading ? 'Memproses dan Mengunduh...' : 'Unduh Media Sekarang'}
        </Button>
      </div>
    </Card>
  );
}

function IPChecker() {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const checkIP = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setIp(data.ip);
    } catch {
      showToast('Failed to fetch IP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 mb-4 font-mono">IP Address Checker</h3>
      <Button onClick={checkIP} loading={loading} className="mb-4">Check My IP</Button>
      {ip && (
        <div className="p-3 rounded-lg bg-dark-950 border border-dark-750 font-mono text-base text-emerald-400 flex items-center justify-between">
          <span>{ip}</span>
          <button onClick={() => navigator.clipboard.writeText(ip)} className="text-dark-400 hover:text-emerald-400">
            <Copy className="h-4 w-4" />
          </button>
        </div>
      )}
    </Card>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { copied, copy } = useCopyToClipboard();

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch {
      setOutput('Error: Invalid input');
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 mb-4 font-mono">Base64 Encoder/Decoder</h3>
      <Select value={mode} onChange={(e) => setMode(e.target.value as 'encode' | 'decode')} options={[
        { value: 'encode', label: 'Encode to Base64' },
        { value: 'decode', label: 'Decode from Base64' },
      ]} className="mb-4" />
      <Textarea label="Input" value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="mb-4 font-mono text-xs" />
      <Button onClick={process} className="mb-4">Process</Button>
      <Textarea label="Output" value={output} readOnly rows={4} className="mb-4 font-mono text-xs" />
      {output && <Button variant="secondary" onClick={() => copy(output)} className="w-full" leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>{copied ? 'Copied!' : 'Copy Output'}</Button>}
    </Card>
  );
}

function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<'md5' | 'sha1' | 'sha256' | 'sha512'>('sha256');
  const [hash, setHash] = useState('');
  const { copied, copy } = useCopyToClipboard();

  const generate = () => {
    if (!input) {
      setHash('');
      return;
    }
    try {
      let result = '';
      if (algorithm === 'md5') {
        result = CryptoJS.MD5(input).toString();
      } else if (algorithm === 'sha1') {
        result = CryptoJS.SHA1(input).toString();
      } else if (algorithm === 'sha256') {
        result = CryptoJS.SHA256(input).toString();
      } else if (algorithm === 'sha512') {
        result = CryptoJS.SHA512(input).toString();
      }
      setHash(result);
    } catch (err: any) {
      console.error('Hash error:', err);
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 mb-4 font-mono">Cryptographic Hash Generator</h3>
      <Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)} options={[
        { value: 'md5', label: 'MD5' },
        { value: 'sha1', label: 'SHA-1' },
        { value: 'sha256', label: 'SHA-256' },
        { value: 'sha512', label: 'SHA-512' },
      ]} className="mb-4" />
      <Textarea label="Input Text" value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="mb-4 font-mono text-xs" />
      <Button onClick={generate} className="mb-4">Generate Hash</Button>
      {hash && (
        <>
          <Textarea label="Hash Output" value={hash} readOnly rows={2} className="mb-4 font-mono text-xs" />
          <Button variant="secondary" onClick={() => copy(hash)} className="w-full" leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>{copied ? 'Copied!' : 'Copy Hash'}</Button>
        </>
      )}
    </Card>
  );
}

function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { copied, copy } = useCopyToClipboard();

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch {
      setError('Invalid JSON');
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 mb-4 font-mono">JSON Formatter & Validator</h3>
      <Textarea label="Input JSON" value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="mb-4 font-mono text-xs" />
      <div className="flex gap-2 mb-4">
        <Button onClick={format}>Format Pretty</Button>
        <Button variant="secondary" onClick={minify}>Minify</Button>
      </div>
      {error && <p className="text-rose-400 text-xs font-mono mb-2">{error}</p>}
      {output && (
        <>
          <Textarea label="Formatted JSON" value={output} readOnly rows={8} className="mb-4 font-mono text-xs" />
          <Button variant="secondary" onClick={() => copy(output)} className="w-full" leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>{copied ? 'Copied!' : 'Copy Output'}</Button>
        </>
      )}
    </Card>
  );
}

function TimestampConverter() {
  const [unix, setUnix] = useState('');
  const [human, setHuman] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const unixToHuman = () => {
    const ts = parseInt(unix, 10);
    if (!isNaN(ts)) {
      const date = new Date(ts * (ts < 1e12 ? 1000 : 1));
      setHuman(date.toISOString());
    }
  };

  const humanToUnix = () => {
    const ts = Date.parse(human);
    if (!isNaN(ts)) {
      setUnix(String(Math.floor(ts / 1000)));
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 mb-4 font-mono">Unix Timestamp Converter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Input label="Unix Timestamp (seconds)" value={unix} onChange={(e) => { setUnix(e.target.value); unixToHuman(); }} />
          <p className="text-2xs font-mono text-dark-500 mt-1">Current Unix Epoch: {Math.floor(now / 1000)}</p>
        </div>
        <div>
          <Input label="ISO 8601 Date" value={human} onChange={(e) => { setHuman(e.target.value); humanToUnix(); }} placeholder="2026-09-09T12:00:00Z" />
        </div>
      </div>
      <div className="text-xs text-dark-400 font-mono bg-dark-950 p-3 rounded-lg border border-dark-800">
        Local Date: {new Date(parseInt(unix, 10) * 1000 || Date.now()).toLocaleString()}
      </div>
    </Card>
  );
}

function QRGenerator() {
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const { showToast } = useToast();

  const generate = async () => {
    if (!input.trim()) return;
    setGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(input, { width: 256, margin: 2, color: { dark: '#10b981', light: '#090a0f' } });
      setQrCode(dataUrl);
    } catch {
      showToast('Failed to generate QR code', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 mb-4 font-mono">QR Code Generator</h3>
      <Textarea label="Text or URL" value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="mb-4 font-mono text-xs" />
      <Button onClick={generate} loading={generating} className="mb-4 w-full">Generate QR Code</Button>
      {qrCode && (
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="p-3 bg-dark-950 rounded-xl border border-dark-750">
            <img src={qrCode} alt="QR Code" className="rounded" />
          </div>
          <Button variant="secondary" size="sm" onClick={() => {
            const link = document.createElement('a');
            link.href = qrCode;
            link.download = 'qrcode.png';
            link.click();
          }}>
            Download PNG
          </Button>
        </div>
      )}
    </Card>
  );
}

function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const calculate = () => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) return;

    const mask = ~((1 << (32 - cidr)) - 1);
    const network = parts.map((p, i) => p & ((mask >> (8 * (3 - i))) & 0xff)).join('.');
    const broadcast = parts.map((p, i) => p | (~((mask >> (8 * (3 - i))) & 0xff) & 0xff)).join('.');
    const first = network.split('.').map((p, i) => i === 3 ? parseInt(p) + 1 : p).join('.');
    const last = broadcast.split('.').map((p, i) => i === 3 ? parseInt(p) - 1 : p).join('.');
    const hosts = Math.max(0, (1 << (32 - cidr)) - 2);
    const maskStr = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join('.');

    setResult({
      network, broadcast, first, last,
      hosts: hosts.toString(),
      mask: maskStr,
      cidr: cidr.toString(),
    });
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <h3 className="font-semibold text-dark-100 mb-4 font-mono">IPv4 Subnet Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input label="IP Address" value={ip} onChange={(e) => setIp(e.target.value)} />
        <Input label="CIDR Prefix (0-32)" type="number" min={0} max={32} value={cidr} onChange={(e) => setCidr(parseInt(e.target.value) || 0)} />
      </div>
      <Button onClick={calculate} className="mb-4 w-full">Calculate Subnet</Button>
      {result && (
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          {Object.entries(result).map(([k, v]) => (
            <div key={k} className="bg-dark-950/80 p-3 rounded-lg border border-dark-800">
              <p className="text-dark-500 uppercase text-2xs">{k}</p>
              <p className="text-dark-100 font-semibold mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}


function DNSLookupTool() {
  const [domain, setDomain] = useState('google.com');
  const [recordType, setRecordType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { showToast } = useToast();

  const handleLookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      const res = await networkToolsApi.dnsLookup(domain.trim(), recordType);
      setResult(res);
      showToast('DNS query resolved successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'DNS lookup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-800">
        <div>
          <h3 className="font-semibold text-dark-100 text-lg font-mono">DNS Record Lookup</h3>
          <p className="text-xs text-dark-400">Query A, AAAA, MX, TXT, NS, and CNAME records via backend DNS resolver</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-2xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Live Resolver
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <Input 
            label="Domain / Hostname" 
            value={domain} 
            onChange={(e) => setDomain(e.target.value)} 
            placeholder="google.com atau sabbilferdyansyah.my.id" 
          />
        </div>
        <div>
          <Select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            options={[
              { value: 'ALL', label: 'ALL Records' },
              { value: 'A', label: 'A (IPv4)' },
              { value: 'AAAA', label: 'AAAA (IPv6)' },
              { value: 'MX', label: 'MX (Mail)' },
              { value: 'TXT', label: 'TXT (Verification/SPF)' },
              { value: 'NS', label: 'NS (Name Server)' },
              { value: 'CNAME', label: 'CNAME' },
            ]}
          />
        </div>
      </div>
      <Button onClick={handleLookup} loading={loading} className="mb-4 w-full">
        {loading ? 'Resolving Records...' : 'Execute DNS Query'}
      </Button>
      {result && (
        <div className="space-y-2 animate-in">
          <div className="flex items-center justify-between text-xs font-mono text-dark-400">
            <span>Query Results ({result.executionTime ? `${result.executionTime}ms` : 'Completed'})</span>
            <span className={result.success ? 'text-emerald-400' : 'text-rose-400'}>
              {result.success ? 'Success' : 'Failed'}
            </span>
          </div>
          <Textarea 
            value={JSON.stringify(result.data || result, null, 2)} 
            readOnly 
            rows={10} 
            className="font-mono text-xs bg-dark-950/90 text-dark-100" 
          />
        </div>
      )}
    </Card>
  );
}

function PingTesterTool() {
  const [host, setHost] = useState('1.1.1.1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { showToast } = useToast();

  const handlePing = async () => {
    if (!host.trim()) return;
    setLoading(true);
    try {
      const res = await networkToolsApi.ping(host.trim());
      setResult(res);
      showToast(res.success ? 'Host is alive' : 'Ping request returned no packet reply', res.success ? 'success' : 'info');
    } catch (err: any) {
      showToast(err.message || 'Ping command failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-800">
        <div>
          <h3 className="font-semibold text-dark-100 text-lg font-mono">ICMP Ping Reachability Tester</h3>
          <p className="text-xs text-dark-400">Send 3 ICMP echo requests directly from the server node</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-2xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Raw ICMP Probe
        </span>
      </div>
      <div className="mb-4">
        <Input 
          label="Target Host or IP Address" 
          value={host} 
          onChange={(e) => setHost(e.target.value)} 
          placeholder="1.1.1.1 atau 8.8.8.8 atau google.com" 
        />
      </div>
      <Button onClick={handlePing} loading={loading} className="mb-4 w-full">
        {loading ? 'Transmitting ICMP Packets...' : 'Start Ping Test'}
      </Button>
      {result && (
        <div className="space-y-4 animate-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-dark-950 p-3 rounded-lg border border-dark-800">
              <span className="text-dark-400 block text-2xs uppercase">Host Status</span>
              <span className={`font-bold mt-1 inline-block ${result.success || result.data?.alive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.success || result.data?.alive ? 'ONLINE / ALIVE' : 'UNREACHABLE'}
              </span>
            </div>
            <div className="bg-dark-950 p-3 rounded-lg border border-dark-800">
              <span className="text-dark-400 block text-2xs uppercase">Avg Latency</span>
              <span className="text-dark-100 font-bold mt-1 inline-block">
                {result.data?.avg ? `${result.data.avg} ms` : (result.data?.time ? `${result.data.time} ms` : '-')}
              </span>
            </div>
            <div className="bg-dark-950 p-3 rounded-lg border border-dark-800">
              <span className="text-dark-400 block text-2xs uppercase">Min / Max</span>
              <span className="text-dark-100 font-bold mt-1 inline-block">
                {result.data?.min && result.data?.max ? `${result.data.min} / ${result.data.max} ms` : '-'}
              </span>
            </div>
            <div className="bg-dark-950 p-3 rounded-lg border border-dark-800">
              <span className="text-dark-400 block text-2xs uppercase">Packet Loss</span>
              <span className="text-dark-100 font-bold mt-1 inline-block">
                {result.data?.packetLoss != null ? `${result.data.packetLoss}%` : '0%'}
              </span>
            </div>
          </div>
          <Textarea 
            value={JSON.stringify(result.data || result, null, 2)} 
            readOnly 
            rows={5} 
            className="font-mono text-xs bg-dark-950/90 text-dark-100" 
          />
        </div>
      )}
    </Card>
  );
}

function PortCheckerTool() {
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState('3307');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { showToast } = useToast();

  const handleCheck = async () => {
    const portNum = parseInt(port, 10);
    if (!host.trim() || isNaN(portNum) || portNum < 1 || portNum > 65535) {
      showToast('Masukkan hostname dan port yang valid (1-65535)', 'error');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await networkToolsApi.checkPort(host.trim(), portNum);
      setResult(res);
      if (res.data?.status === 'open') {
        showToast(`Port ${portNum} aktif dan terbuka!`, 'success');
      } else {
        showToast(`Port ${portNum} ${res.data?.status || 'tertutup'}`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memeriksa port', 'error');
    } finally {
      setLoading(false);
    }
  };

  const presetPorts = [
    { label: 'HTTP (80)', port: '80' },
    { label: 'HTTPS (443)', port: '443' },
    { label: 'SSH (22)', port: '22' },
    { label: 'MySQL Server (3307)', port: '3307' },
    { label: 'DNS (53)', port: '53' },
    { label: 'Node Backend (3001)', port: '3001' },
    { label: 'Vite Frontend (3000)', port: '3000' },
  ];

  return (
    <Card className="p-6 bg-dark-900/80 border border-dark-800">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-800">
        <div>
          <h3 className="font-semibold text-dark-100 text-lg font-mono">TCP Port Availability Checker</h3>
          <p className="text-xs text-dark-400">Perform direct TCP handshake probe to detect open, closed, or firewalled services</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-2xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
          TCP Socket Scanner
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
        <div className="sm:col-span-2">
          <Input 
            label="Host / IP Target" 
            value={host} 
            onChange={(e) => setHost(e.target.value)} 
            placeholder="127.0.0.1 atau sabbilferdyansyah.my.id" 
          />
        </div>
        <div>
          <Input 
            label="Port Number (1-65535)" 
            type="number"
            value={port} 
            onChange={(e) => setPort(e.target.value)} 
            placeholder="443" 
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-2xs font-mono text-dark-400 self-center mr-1">Quick Presets:</span>
        {presetPorts.map((p) => (
          <button
            key={p.port}
            type="button"
            onClick={() => setPort(p.port)}
            className={cn(
              "px-2.5 py-1 rounded text-2xs font-mono transition-colors border",
              port === p.port 
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40" 
                : "bg-dark-950 text-dark-300 border-dark-800 hover:border-dark-700"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Button onClick={handleCheck} loading={loading} className="mb-4 w-full">
        {loading ? 'Checking Socket Connection...' : 'Scan Port Availability'}
      </Button>

      {result && (
        <div className="space-y-3 animate-in">
          <div className={cn(
            "p-4 rounded-xl border flex items-center justify-between",
            result.data?.status === 'open' 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : result.data?.status === 'timeout' 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          )}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/40">
                  {result.data?.status || 'UNKNOWN'}
                </span>
                <span className="text-sm font-semibold font-mono">
                  {result.data?.host}:{result.data?.port}
                </span>
              </div>
              <p className="text-xs mt-1.5 opacity-90">{result.data?.message}</p>
            </div>
            <div className="text-right text-2xs font-mono opacity-75">
              <span>{result.executionTime} ms</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function Tools() {
  const [activeTool, setActiveTool] = useState<string | null>('downloader');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Developer Tools</h1>
        <p className="text-dark-400 text-sm mt-1">Utility toolset for downloading, networking, hashing, decoding, and debugging</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
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

      {activeTool && (
        <div className="animate-in pt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
              {tools.find(t => t.id === activeTool)?.name}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setActiveTool(null)} className="text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Tutup Tool
            </Button>
          </div>
          {activeTool === 'downloader' && <FileDownloader />}
          {activeTool === 'ip-checker' && <IPChecker />}
          {activeTool === 'base64' && <Base64Tool />}
          {activeTool === 'hash' && <HashGenerator />}
          {activeTool === 'json-format' && <JSONFormatter />}
          {activeTool === 'timestamp' && <TimestampConverter />}
          {activeTool === 'qr-gen' && <QRGenerator />}
          {activeTool === 'subnet-calc' && <SubnetCalculator />}
          {activeTool === 'dns-lookup' && <DNSLookupTool />}
          {activeTool === 'ping' && <PingTesterTool />}
          {activeTool === 'port-checker' && <PortCheckerTool />}
        </div>
      )}
    </div>
  );
}

export default Tools;