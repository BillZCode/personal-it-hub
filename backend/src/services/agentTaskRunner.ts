import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export interface TaskExecutionResult {
  thought: string;
  actionsTaken: Array<{
    command: string;
    output: string;
    exitCode: number;
  }>;
  finalReport: string;
}

// Extract commands from markdown blocks like ```bash ... ``` or `execute: ...`
export function extractBashCommands(text: string): string[] {
  const commands: string[] = [];
  
  // 1. Matches ```bash\n...\n``` or ```sh\n...\n```
  const codeBlockRegex = /```(?:bash|sh|zsh)?\r?\n([\s\S]*?)```/gi;
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const lines = match[1].split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      // Skip empty or comment lines
      if (!line || line.startsWith('#')) continue;
      // Remove leading $ if present
      const clean = line.replace(/^\$\s*/, '').trim();
      // Avoid isolated echo or cd commands alone if redundant
      if (clean && !commands.includes(clean)) {
        commands.push(clean);
      }
    }
  }

  // 2. Direct command instruction pattern: Command: `xyz` or EXECUTE: `xyz`
  const directCmdRegex = /(?:Command|Perintah|Execute|Run):\s*`([^`]+)`/gi;
  while ((match = directCmdRegex.exec(text)) !== null) {
    const clean = match[1].trim();
    if (clean && !commands.includes(clean)) {
      commands.push(clean);
    }
  }

  // If a block has multiple meaningful commands, prioritize non-pure-echo commands
  const meaningful = commands.filter(c => !/^echo\s+["']?===/i.test(c) && !/^cd\s+/i.test(c));
  return meaningful.length > 0 ? meaningful : commands;
}

export async function runAgentAutonomousCycle(
  prompt: string,
  apiKey: string,
  projectRoot: string
): Promise<TaskExecutionResult> {
  const candidateModels = [
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3-flash-preview',
    'gemini-flash-lite-latest',
    'gemini-robotics-er-2-preview',
  ];

  // System instruction: Instruct model to plan and output executable bash blocks if actions are needed
  const planInstruction = `Kamu adalah Antigravity Autonomous Agent Core pada Personal IT Hub (OS: Debian Linux, Workspace: ${projectRoot}).
PENGGUNA MEMBERIKAN TUGAS/INSTRUKSI BERIKUT: "${prompt}".

TUGAS UTAMAMU:
1. Pahami tujuan pengguna.
2. Jika tugas membutuhkan eksekusi perintah (seperti cek status, restart service, backup, inspeksi file, git, instalasi, pengujian), sertakan blok perintah bash yang jelas di dalam blok kode:
\`\`\`bash
<perintah_bash_disini>
\`\`\`
3. Jika tugas hanya berupa pertanyaan atau analisis tanpa perlu perubahan server, berikan analisis langsung secara detail dan profesional.
4. Gunakan perintah yang aman dan efisien. Jangan gunakan perintah destruktif seperti rm -rf / atau format disk.`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: planInstruction }] },
  };

  let planOutput = '';
  let lastError = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        planOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (planOutput) break;
      } else {
        lastError = await response.text();
      }
    } catch (e: any) {
      lastError = e?.message || 'Connection error';
    }
  }

  if (!planOutput) {
    // Autonomous Heuristic Fallback:
    // If Gemini API is unreachable (e.g. invalid key or network block),
    // parse user intent heuristically so the agent still executes system inspection/maintenance tasks!
    const lowerPrompt = prompt.toLowerCase();
    const fallbackCommands: string[] = [];

    if (lowerPrompt.includes('disk') || lowerPrompt.includes('df') || lowerPrompt.includes('ruang') || lowerPrompt.includes('storage')) {
      fallbackCommands.push('df -h');
    }
    if (lowerPrompt.includes('ram') || lowerPrompt.includes('memori') || lowerPrompt.includes('memory') || lowerPrompt.includes('free')) {
      fallbackCommands.push('free -h');
    }
    if (lowerPrompt.includes('pm2') || lowerPrompt.includes('service') || lowerPrompt.includes('layanan') || lowerPrompt.includes('status')) {
      fallbackCommands.push('pm2 list');
    }
    if (lowerPrompt.includes('git') || lowerPrompt.includes('branch') || lowerPrompt.includes('commit') || lowerPrompt.includes('repo')) {
      fallbackCommands.push('git status -s');
      fallbackCommands.push('git log -n 3 --oneline');
    }
    if (lowerPrompt.includes('uptime') || lowerPrompt.includes('load') || lowerPrompt.includes('cpu')) {
      fallbackCommands.push('uptime');
    }
    if (lowerPrompt.includes('docker') || lowerPrompt.includes('kontainer') || lowerPrompt.includes('container')) {
      fallbackCommands.push('docker ps -a');
    }
    if (lowerPrompt.includes('nginx') || lowerPrompt.includes('web server')) {
      fallbackCommands.push('nginx -t 2>&1 || true');
    }

    if (fallbackCommands.length > 0) {
      planOutput = `### Rencana Eksekusi Antigravity Autonomous Engine (Local Heuristic Mode)\nMenganalisis instruksi: "${prompt}"\nMenjadwalkan eksekusi perintah terminal berikut:\n\`\`\`bash\n${fallbackCommands.join('\n')}\n\`\`\``;
    } else {
      throw new Error(`AI Agent tidak merespons: ${lastError || 'Koneksi ke Gemini API gagal dan tidak ada task matching.'}`);
    }
  }

  // Check if bash commands exist in plan
  const commandsToRun = extractBashCommands(planOutput);
  const actionsTaken: Array<{ command: string; output: string; exitCode: number }> = [];

  const disallowedPatterns = [
    /rm\s+-rf\s+\/($|\s)/,
    /mkfs/,
    /:(){ :\|:& };:/,
    /dd\s+if=/,
    />\s*\/dev\/sd/,
    />\s*\/dev\/nvme/,
    /reboot/,
    /shutdown/,
  ];

  // Execute safe commands (limit to max 5 steps per task for stability)
  for (const cmd of commandsToRun.slice(0, 5)) {
    const isDangerous = disallowedPatterns.some(p => p.test(cmd));
    if (isDangerous) {
      actionsTaken.push({
        command: cmd,
        output: '⚠️ Perintah diblokir oleh Safety Protocol Antigravity Agent.',
        exitCode: 1,
      });
      continue;
    }

    try {
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: projectRoot,
        timeout: 30000,
        maxBuffer: 5 * 1024 * 1024,
      });
      actionsTaken.push({
        command: cmd,
        output: (stdout || '') + (stderr ? (stdout ? '\n' : '') + stderr : '') || '(Completed with no output)',
        exitCode: 0,
      });
    } catch (err: any) {
      actionsTaken.push({
        command: cmd,
        output: err.stderr || err.message || 'Execution error',
        exitCode: err.code ?? 1,
      });
    }
  }

  // If actions were executed, generate a verified completion report
  let finalReport = planOutput;

  if (actionsTaken.length > 0) {
    const reportPrompt = `Kamu telah mengeksekusi serangkaian aksi untuk tugas: "${prompt}".
Hasil eksekusi riil dari terminal server:
${actionsTaken.map((a, i) => `[Langkah ${i + 1}] Perintah: ${a.command}\nStatus: ${a.exitCode === 0 ? 'Sukses (0)' : `Gagal (${a.exitCode})`}\nOutput:\n${a.output}\n`).join('\n')}

Sekarang, buatkan LAPORAN AKHIR LENGKAP & JELAS untuk Administrator:
1. Ringkasan apa yang telah dikerjakan.
2. Hasil verifikasi dari output server di atas.
3. Status akhir: Sukses atau Membutuhkan Perhatian.
4. Rekomendasi langkah selanjutnya jika ada.`;

    const reportPayload = {
      contents: [{ parts: [{ text: reportPrompt }] }],
    };

    let synthesized = false;
    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportPayload),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const reportText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reportText) {
            finalReport = reportText;
            synthesized = true;
            break;
          }
        }
      } catch {
        // fallback
      }
    }

    if (!synthesized) {
      const allSuccess = actionsTaken.every(a => a.exitCode === 0);
      finalReport = `### 📋 Laporan Eksekusi Tugas Antigravity Agent\n\n` +
        `**Instruksi:** "${prompt}"\n\n` +
        `**Status Hasil:** ${allSuccess ? '✅ Selesai Sukses' : '⚠️ Selesai dengan Beberapa Peringatan'}\n\n` +
        `**Ringkasan Tindakan:**\n` +
        actionsTaken.map((a, i) => `- **Langkah ${i + 1}:** \`${a.command}\` -> Exit Code ${a.exitCode} (${a.exitCode === 0 ? 'Sukses' : 'Gagal'})\n`).join('') +
        `\n**Hasil Observasi & Output Terminal:**\n` +
        actionsTaken.map(a => `\`\`\`text\n# Perintah: ${a.command}\n${a.output.trim()}\n\`\`\``).join('\n\n') +
        `\n\n**Kesimpulan:** Seluruh perintah telah dieksekusi di server lokal (${projectRoot}) dan status saat ini siap dipantau.`;
    }
  }

  return {
    thought: planOutput,
    actionsTaken,
    finalReport,
  };
}
