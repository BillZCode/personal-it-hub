// Native Node 20 global fetch is used

const ROUTER_URL = process.env.NINE_ROUTER_URL 
  ? `${process.env.NINE_ROUTER_URL.replace(/\/+$/, '')}/v1/chat/completions`
  : 'http://localhost:20128/v1/chat/completions';
const ROUTER_KEY = process.env.NINE_ROUTER_KEY || '';
if (!ROUTER_KEY) {
  console.error('Missing NINE_ROUTER_KEY environment variable.');
  process.exit(1);
}
const MODEL = process.env.TEST_MODEL || 'gpt-6-astra';

// Accuracy & instruction-following test cases
const TEST_CASES = [
  {
    category: 'Strict JSON & Format Accuracy',
    prompt: 'Berikan output HANYA berupa JSON valid tanpa markdown fence. Format: {"status": "ok", "result": 42}. DILARANG menambahkan teks lain.',
    validate: (res) => {
      try {
        const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
        const obj = JSON.parse(cleaned);
        return obj.status === 'ok' && obj.result === 42;
      } catch {
        return false;
      }
    }
  },
  {
    category: 'Math & Logical Reasoning Precision',
    prompt: 'Jika sebuah toko menjual 3 apel seharga Rp15.000 dan 5 jeruk seharga Rp20.000, berapa total harga 6 apel dan 10 jeruk? Jawab hanya dengan angka total rupiahnya (misal: Rp70.000).',
    validate: (res) => {
      return res.includes('70.000') || res.includes('70000');
    }
  },
  {
    category: 'Negative Constraint Adherence',
    prompt: 'Tuliskan 1 kalimat tentang planet Mars. SYARAT MUTLAK: JANGAN gunakan huruf "a" atau "A" sama sekali dalam kalimatmu.',
    validate: (res) => {
      const sentence = res.trim();
      return !sentence.toLowerCase().includes('a') && sentence.length > 5;
    }
  },
  {
    category: 'Indonesian Grammar & Translation Accuracy',
    prompt: 'Terjemahkan frasa "state-of-the-art multi-agent orchestrator" ke dalam bahasa Indonesia baku bidang teknik komputer. Berikan istilah paling tepat.',
    validate: (res) => {
      const l = res.toLowerCase();
      return (l.includes('orkestrator') || l.includes('pengorkestrasi') || l.includes('pengelola')) && (l.includes('multi-agen') || l.includes('multi agen'));
    }
  },
  {
    category: 'Algorithmic Precision (Python Code)',
    prompt: 'Tuliskan fungsi Python bernama `is_palindrome(s: str) -> bool` yang efisien dan mengabaikan huruf besar/kecil serta spasi. Berikan kodenya saja.',
    validate: (res) => {
      return res.includes('def is_palindrome') && (res.includes('[::-1]') || res.includes('reversed'));
    }
  }
];

async function runSingleTest(tc, idx) {
  const startTime = Date.now();
  try {
    const res = await fetch(ROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ROUTER_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: tc.prompt }],
        temperature: 0.1,
        max_tokens: 300
      })
    });

    const elapsed = Date.now() - startTime;
    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: `HTTP ${res.status}: ${err}`, elapsed };
    }

    const text = await res.text();
    let reply = '';
    let credits = null;
    let usage = null;

    if (text.includes('data: ')) {
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.replace('data: ', '').trim();
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || '';
            reply += delta;
            if (parsed.customer_credits !== undefined) credits = parsed.customer_credits;
            if (parsed.usage) usage = parsed.usage;
          } catch {}
        }
      }
    } else {
      const cleanedText = text.replace(/data:\s*\[DONE\].*$/s, '').trim();
      const data = JSON.parse(cleanedText);
      reply = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning || '';
      credits = data.customer_credits;
      usage = data.usage;
    }

    const isAccurate = tc.validate(reply);

    return {
      success: true,
      accurate: isAccurate,
      category: tc.category,
      reply: reply.slice(0, 150).replace(/\n/g, ' '),
      elapsed,
      credits,
      usage
    };
  } catch (err) {
    return { success: false, error: err.message, elapsed: Date.now() - startTime };
  }
}

async function runBenchmark(totalRuns = 5) {
  console.log(`=======================================================`);
  console.log(`🚀 Memulai Uji Akurasi & Ketepatan 9Router`);
  console.log(`Endpoint : ${ROUTER_URL}`);
  console.log(`Model    : ${MODEL}`);
  console.log(`Target   : ${totalRuns} pengujian akurasi`);
  console.log(`=======================================================\n`);

  let passed = 0;
  let total = 0;

  for (let i = 0; i < totalRuns; i++) {
    const tc = TEST_CASES[i % TEST_CASES.length];
    process.stdout.write(`[Test ${i + 1}/${totalRuns}] ${tc.category} ... `);
    const result = await runSingleTest(tc, i);
    total++;

    if (result.success) {
      if (result.accurate) {
        passed++;
        console.log(`✅ LULUS (${result.elapsed}ms) [Credits: ${result.credits}]`);
      } else {
        console.log(`⚠️ TEPAT FORMAT TAPI TIDAK MEMENUHI SYARAT (${result.elapsed}ms)`);
        console.log(`   Output: "${result.reply}"`);
      }
    } else {
      console.log(`❌ GAGAL (${result.elapsed}ms): ${result.error}`);
    }
  }

  const accuracyPct = ((passed / total) * 100).toFixed(1);
  console.log(`\n=======================================================`);
  console.log(`📊 Hasil Pengujian:`);
  console.log(`- Total Dijalankan: ${total}`);
  console.log(`- Berhasil & Akurat: ${passed}`);
  console.log(`- Skor Akurasi    : ${accuracyPct}%`);
  console.log(`=======================================================`);
}

const requestedRuns = parseInt(process.argv[2] || '5', 10);
runBenchmark(requestedRuns);
