import readline from 'node:readline';

export interface PromptChoice {
  title: string;
  value: string;
}

export async function askSelect(message: string, choices: PromptChoice[]): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`\n? ${message}`);
  choices.forEach((c, idx) => {
    console.log(`  ${idx + 1}) ${c.title}`);
  });

  return new Promise((resolve) => {
    rl.question(`Enter selection (1-${choices.length}): `, (answer) => {
      rl.close();
      const choiceIdx = parseInt(answer.trim(), 10) - 1;
      if (choiceIdx >= 0 && choiceIdx < choices.length) {
        resolve(choices[choiceIdx].value);
      } else {
        resolve(choices[0].value);
      }
    });
  });
}

export async function askText(message: string, initial = ''): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    const promptMsg = initial ? `? ${message} (${initial}): ` : `? ${message}: `;
    rl.question(promptMsg, (answer) => {
      rl.close();
      resolve(answer.trim() || initial);
    });
  });
}
