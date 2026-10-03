import chalk from 'chalk';

export interface OutputOptions {
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export function formatSuccess(message: string, options?: OutputOptions): void {
  if (options?.quiet) return;
  console.log(`${chalk.green('✓')} ${message}`);
}

export function formatError(message: string, reason?: string, hint?: string, options?: OutputOptions): void {
  console.error(`${chalk.red('✗')} ${chalk.bold(message)}`);
  if (reason) {
    console.error(`  ${chalk.dim('Reason:')} ${reason}`);
  }
  if (hint) {
    console.error(`  ${chalk.cyan('Hint:')} ${hint}`);
  }
}

export function formatWarning(message: string, options?: OutputOptions): void {
  if (options?.quiet) return;
  console.warn(`${chalk.yellow('⚠')} ${message}`);
}

export function formatInfo(message: string, options?: OutputOptions): void {
  if (options?.quiet) return;
  console.log(`${chalk.blue('ℹ')} ${message}`);
}

export function renderOutput(data: unknown, options?: OutputOptions, fallbackPrinter?: (val: unknown) => void): void {
  if (options?.json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (fallbackPrinter) {
    fallbackPrinter(data);
  } else if (typeof data === 'string') {
    console.log(data);
  } else {
    console.log(data);
  }
}

export function renderTable(headers: string[], rows: (string | number)[][]): void {
  const colWidths = headers.map((h, i) => {
    const maxRowLen = rows.reduce((max, r) => Math.max(max, String(r[i] ?? '').length), 0);
    return Math.max(h.length, maxRowLen);
  });

  const headerLine = headers.map((h, i) => h.padEnd(colWidths[i])).join('   ');
  console.log(chalk.bold(headerLine));
  console.log(chalk.dim('─'.repeat(headerLine.length)));

  rows.forEach((row) => {
    const line = row.map((cell, i) => String(cell ?? '').padEnd(colWidths[i])).join('   ');
    console.log(line);
  });
}
