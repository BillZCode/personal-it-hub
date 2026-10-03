#!/usr/bin/env node
import { createProgram } from '../dist/index.js';

const program = createProgram();

let args = process.argv;
if (args.length <= 2) {
  args = [...args, 'interactive'];
  program.parseAsync(args).catch((err) => {
    console.error('Fatal devkit error:', err?.message || err);
    process.exit(1);
  });
} else {
  const groupName = args[2];
  const targetSubCmd = program.commands.find((c) => c.name() === groupName);

  if (targetSubCmd && targetSubCmd.commands && targetSubCmd.commands.length > 0 && args.length >= 4 && !args[3].startsWith('-')) {
    // Dispatch directly to child command
    targetSubCmd.parseAsync([args[0], groupName, ...args.slice(3)]).catch((err) => {
      console.error('Fatal devkit error:', err?.message || err);
      process.exit(1);
    });
  } else {
    program.parseAsync(args).catch((err) => {
      console.error('Fatal devkit error:', err?.message || err);
      process.exit(1);
    });
  }
}
