import { existsSync, readFileSync } from 'node:fs';

export async function readStdin(): Promise<string> {
  // If stdin is a TTY (interactive terminal, no piped input), return empty string
  if (process.stdin.isTTY) {
    return '';
  }

  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');

    // Safety timeout so process doesn't hang if stdin is left open
    const timeout = setTimeout(() => {
      resolve(data.trim());
    }, 1500);

    process.stdin.on('data', (chunk) => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      clearTimeout(timeout);
      resolve(data.trim());
    });

    process.stdin.on('error', () => {
      clearTimeout(timeout);
      resolve(data.trim());
    });
  });
}

export async function getInput(explicitArg?: string, filePath?: string): Promise<string> {
  if (explicitArg && explicitArg.trim() !== '') {
    return explicitArg;
  }

  if (filePath && existsSync(filePath)) {
    return readFileSync(filePath, 'utf8');
  }

  const piped = await readStdin();
  if (piped) {
    return piped;
  }

  return '';
}
