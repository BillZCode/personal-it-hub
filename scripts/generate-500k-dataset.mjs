import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const STORAGE_DIR = path.join(ROOT_DIR, 'storage');
const JSONL_OUTPUT = path.join(STORAGE_DIR, 'accuracy-training-500k.jsonl');
const TXT_OUTPUT = path.join(STORAGE_DIR, 'accuracy-training-500k.txt');
const REPORT_OUTPUT = path.join(STORAGE_DIR, 'accuracy-500k-report.json');

const ROUTER_URL = process.env.NINE_ROUTER_URL
  ? `${process.env.NINE_ROUTER_URL.replace(/\/+$/, '')}/v1/chat/completions`
  : 'http://localhost:20128/v1/chat/completions';
const ROUTER_KEY = process.env.NINE_ROUTER_KEY || '';
if (!ROUTER_KEY) {
  console.error('Missing NINE_ROUTER_KEY environment variable.');
  process.exit(1);
}

// Target 500.000 Output Tokens murni (sesuai metrik kartu hijau di dashboard 9Router)
const TARGET_TOKENS = parseInt(process.env.TARGET_TOKENS || '500000', 10);
const MODELS = [
  'openrouter/openrouter/free',
  'openrouter/nvidia/nemotron-3.5-lightning:free',
  'openrouter/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'openrouter/nvidia/nemotron-3.5-super-vl:free',
  'openrouter/dots-studio/dots-3-note-preview:free'
];

const TOPICS = [
  { domain: 'Network Engineering', prompt: 'Jelaskan mekanisme kerja BGP (Border Gateway Protocol) Best Path Selection Algorithm secara mendalam. Berikan tabel prioritas atribut (Weight, Local Pref, AS Path, MED) dan skenario simulasi rute failover dengan contoh konfigurasi Cisco/MikroTik.' },
  { domain: 'Cybersecurity & Packet Analysis', prompt: 'Lakukan analisis teknis mendalam terhadap serangan TCP SYN Flood dan DNS Amplification Attack. Sertakan struktur header paket raw di layer 3 dan layer 4, cara deteksi menggunakan Wireshark/tcpdump filter, serta implementasi mitigasi dengan iptables / nftables.' },
  { domain: 'Distributed Systems & Microservices', prompt: 'Rancang arsitektur sistem Event-Driven Microservices skala tinggi menggunakan Apache Kafka, Redis Distributed Lock, dan PostgreSQL dengan Saga Pattern (Orchestration vs Choreography). Berikan diagram alur teks, penanganan dead letter queue, dan idempotency key.' },
  { domain: 'Linux Kernel & System Performance', prompt: 'Jelaskan arsitektur Linux Virtual Memory Management: Page Tables, TLB, Swap space, HugePages, dan OOM Killer heuristics. Berikan panduan troubleshooting memory leak di level OS menggunakan vmstat, sar, /proc/meminfo, dan perf profiling.' },
  { domain: 'Database Engineering & High Availability', prompt: 'Jelaskan mekanisme PostgreSQL Multi-Version Concurrency Control (MVCC), Write-Ahead Logging (WAL), dan streaming replication (Sync vs Async). Tuliskan panduan konfigurasi patroni/etcd untuk zero-downtime automatic failover.' },
  { domain: 'Fullstack Next.js & Serverless Optimization', prompt: 'Jelaskan optimasi performa Next.js App Router: perbandingan React Server Components (RSC), Incremental Static Regeneration (ISR), Edge Middleware caching, streaming SSR, dan Core Web Vitals (LCP, INP, CLS) checklist.' },
  { domain: 'Cryptography & Zero Trust Architecture', prompt: 'Jelaskan dasar matematika dan implementasi kriptografi modern: Diffie-Hellman Key Exchange, Elliptic Curve Cryptography (Ed25519), TLS 1.3 Handshake 1-RTT, dan implementasi prinsip Zero Trust Network Access (ZTNA) di enterprise.' },
  { domain: 'Cloud Networking & Kubernetes SDN', prompt: 'Bedah tuntas Kubernetes Networking Model: Pod-to-Pod communication via CNI (Cilium eBPF vs Calico iptables), NodePort vs LoadBalancer vs Ingress Controller, dan implementasi NetworkPolicy granular.' },
  { domain: 'DevOps & GitOps Pipeline CI/CD', prompt: 'Rancang pipeline CI/CD modern berstandar enterprise dengan ArgoCD, GitHub Actions, Terraform IaaC, SonarQube static analysis, dan container security scanning (Trivy). Tuliskan file konfigurasi pipeline lengkap yang dapat digunakan.' },
  { domain: 'AI System Prompting & Precision Engineering', prompt: 'Susun panduan komprehensif Prompt Engineering untuk model penalaran tingkat lanjut (Reasoning & Code LLMs). Jelaskan Chain-of-Thought (CoT), Tree-of-Thoughts (ToT), Self-Consistency decoding, dan mitigasi halusinasi model.' }
];

// Helper to clean SSE / text response and extract exact completion tokens
function extractText(rawText) {
  let content = '';
  let completionTokens = 0;

  // Cek apakah ini benar-benar streaming SSE (banyak baris diawali data: {...)
  const isSSE = rawText.includes('data: {');

  if (isSSE) {
    const lines = rawText.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonPart = line.replace('data: ', '').trim();
        if (jsonPart === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonPart);
          const chunk = parsed.choices?.[0]?.delta?.content ||
            parsed.choices?.[0]?.delta?.reasoning ||
            parsed.choices?.[0]?.message?.content || '';
          content += chunk;
          if (parsed.usage?.completion_tokens) {
            completionTokens = parsed.usage.completion_tokens;
          }
        } catch { }
      }
    }
  } else {
    try {
      const cleanJson = rawText.replace(/data:\s*\[DONE\].*$/s, '').trim();
      const parsed = JSON.parse(cleanJson);
      content = parsed.choices?.[0]?.message?.content ||
        parsed.choices?.[0]?.message?.reasoning ||
        parsed.choices?.[0]?.message?.reasoning_details?.[0]?.text || '';
      if (parsed.usage?.completion_tokens) {
        completionTokens = parsed.usage.completion_tokens;
      }
    } catch {
      content = rawText;
    }
  }

  const cleanContent = content.trim();
  if (!completionTokens) {
    // Estimasi standar token: ~3.6 karakter per token untuk mixed code/text
    completionTokens = Math.max(1, Math.round(cleanContent.length / 3.6));
  }

  return { text: cleanContent, tokens: completionTokens };
}

async function requestCompletion(topic, modelName, iteration) {
  const prompt = `${topic.prompt}\n\n[PERSYARATAN FORMAT]:
- Tuliskan jawaban yang SANGAT LENGKAP, TERSTRUKTUR, AKURAT, dan MENDALAM (minimal 2000 - 4000 kata/kode).
- Sertakan penjelasan teknis, kode/konfigurasi praktis berstandar produksi, diagram ASCII, dan analisis best practice.
- Variasi iterasi ke-${iteration} untuk dataset akurasi IT.`;

  const payload = {
    model: modelName,
    messages: [
      { role: 'system', content: 'Anda adalah Senior Principal Engineer & System Architect. Berikan jawaban komprehensif, teknis, presisi tinggi, dan sangat mendalam tanpa terpotong.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 4000
  };

  const res = await fetch(ROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ROUTER_KEY}`
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(90000)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const raw = await res.text();
  const { text, tokens } = extractText(raw);
  return { prompt, text, tokens };
}

async function main() {
  console.log('================================================================');
  console.log('⚡ MEMULAI PIPELINE GENERASI HINGGA 500K+ OUTPUT TOKENS');
  console.log(`Endpoint Target : ${ROUTER_URL}`);
  console.log(`Target Tokens   : ${TARGET_TOKENS.toLocaleString()} Output Tokens (9Router Metric)`);
  console.log(`Output Files    :`);
  console.log(` - JSONL : ${JSONL_OUTPUT}`);
  console.log(` - TXT   : ${TXT_OUTPUT}`);
  console.log('================================================================\n');

  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  // Count existing progress
  let totalChars = 0;
  let totalTokens = 0;
  let totalEntries = 0;

  if (fs.existsSync(JSONL_OUTPUT)) {
    const existing = fs.readFileSync(JSONL_OUTPUT, 'utf8').trim().split('\n').filter(Boolean);
    totalEntries = existing.length;
    for (const line of existing) {
      try {
        const item = JSON.parse(line);
        totalChars += (item.chars || 0);
        totalTokens += (item.tokens || 0);
      } catch { }
    }
    // Baseline sinkronisasi dengan dashboard 9Router (di mana 48 entri awal mencatat 140.345 output tokens)
    if (totalTokens < 140345) {
      totalTokens = 140345;
    }
    console.log(`Melanjutkan progres sebelumnya: ${totalEntries} entri | Terdata: ${totalTokens.toLocaleString()} Output Tokens (~${totalChars.toLocaleString()} karakter).\n`);
  } else {
    fs.writeFileSync(TXT_OUTPUT, `=== DATASET AKURASI DAN KETEPATAN AI (TARGET: ${TARGET_TOKENS.toLocaleString()} OUTPUT TOKENS) ===\n\n`);
  }

  const startTime = Date.now();
  let iteration = totalEntries;

  while (totalTokens < TARGET_TOKENS) {
    iteration++;
    const topic = TOPICS[(iteration - 1) % TOPICS.length];
    let model = MODELS[(iteration - 1) % MODELS.length];

    process.stdout.write(`[Iterasi #${iteration}] (${topic.domain} | ${model}) ... `);

    let attempt = 0;
    let completed = false;

    while (attempt < 3 && !completed) {
      attempt++;
      try {
        const iterStart = Date.now();
        const { prompt, text, tokens } = await requestCompletion(topic, model, iteration);
        const iterDuration = Date.now() - iterStart;

        if (!text || text.length < 100) {
          throw new Error('Hasil respons terlalu pendek atau kosong');
        }

        const chars = text.length;
        const actualTokens = tokens || Math.round(chars / 3.6);
        totalChars += chars;
        totalTokens += actualTokens;

        // Append to JSONL
        const record = {
          id: iteration,
          domain: topic.domain,
          model: model,
          timestamp: new Date().toISOString(),
          chars: chars,
          tokens: actualTokens,
          cumulative_output_tokens: totalTokens,
          cumulative_chars: totalChars,
          instruction: prompt,
          output: text
        };
        fs.appendFileSync(JSONL_OUTPUT, JSON.stringify(record) + '\n');

        // Append to TXT
        const txtBlock = `\n================================================================\n[ITEM #${iteration}] Domain: ${topic.domain} | Model: ${model} | Tokens: +${actualTokens.toLocaleString()} | Cumulative: ${totalTokens.toLocaleString()}/${TARGET_TOKENS.toLocaleString()} Tokens\n================================================================\n${text}\n\n`;
        fs.appendFileSync(TXT_OUTPUT, txtBlock);

        const pct = ((totalTokens / TARGET_TOKENS) * 100).toFixed(1);
        console.log(`✅ +${actualTokens.toLocaleString()} tokens (+${chars.toLocaleString()} chars, ${iterDuration}ms) -> Total: ${totalTokens.toLocaleString()}/${TARGET_TOKENS.toLocaleString()} Tokens (${pct}%)`);
        completed = true;
      } catch (err) {
        console.warn(`⚠️ Percobaan ${attempt} gagal: ${err.message}. Mencoba model cadangan...`);
        model = MODELS[(iteration + attempt) % MODELS.length];
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    if (!completed) {
      console.error(`❌ Gagal pada iterasi #${iteration} setelah 3 percobaan. Lanjut ke topik berikutnya.`);
    }

    // Delay 600ms pacing
    await new Promise(r => setTimeout(r, 600));
  }

  const totalTimeSec = Math.round((Date.now() - startTime) / 1000);
  const report = {
    status: 'COMPLETED',
    target_output_tokens: TARGET_TOKENS,
    total_output_tokens: totalTokens,
    total_chars: totalChars,
    total_entries: iteration,
    elapsed_seconds: totalTimeSec,
    jsonl_file: JSONL_OUTPUT,
    txt_file: TXT_OUTPUT,
    completed_at: new Date().toISOString()
  };

  fs.writeFileSync(REPORT_OUTPUT, JSON.stringify(report, null, 2));

  console.log('\n================================================================');
  console.log('🎉 TARGET 500.000+ OUTPUT TOKENS BERHASIL DICAPAI DI 9ROUTER!');
  console.log(`Total Output Tokens : ${totalTokens.toLocaleString()} tokens`);
  console.log(`Total Karakter      : ${totalChars.toLocaleString()} karakter`);
  console.log(`Total Entri         : ${iteration} modul teknis`);
  console.log(`Waktu Tempuh        : ${totalTimeSec} detik`);
  console.log(`File JSONL          : ${JSONL_OUTPUT}`);
  console.log(`File TXT            : ${TXT_OUTPUT}`);
  console.log(`Laporan             : ${REPORT_OUTPUT}`);
  console.log('================================================================');
}

main().catch(err => {
  console.error('Fatal Pipeline Error:', err);
  process.exit(1);
});
