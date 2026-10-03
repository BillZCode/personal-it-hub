import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ProjectTemplateOptions {
  name: string;
  template: 'node' | 'typescript' | 'express' | 'react' | 'empty';
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  initGit?: boolean;
}

export function initProject(options: ProjectTemplateOptions, targetDir: string): { success: boolean; filesCreated: string[] } {
  const projectPath = join(targetDir, options.name);
  if (existsSync(projectPath)) {
    throw new Error(`Directory "${options.name}" already exists at ${targetDir}`);
  }

  mkdirSync(projectPath, { recursive: true });
  const created: string[] = [];

  const pkgJson: Record<string, unknown> = {
    name: options.name,
    version: '0.1.0',
    private: true,
    scripts: {
      start: 'node src/index.js'
    }
  };

  if (options.template === 'typescript' || options.template === 'express') {
    pkgJson.scripts = {
      build: 'tsc',
      start: 'node dist/index.js',
      dev: 'tsx watch src/index.ts'
    };
    pkgJson.devDependencies = {
      typescript: '^5.4.0',
      '@types/node': '^20.0.0'
    };

    mkdirSync(join(projectPath, 'src'), { recursive: true });
    writeFileSync(
      join(projectPath, 'src', 'index.ts'),
      `console.log("Hello from ${options.name}!");\n`,
      'utf8'
    );
    created.push('src/index.ts');

    writeFileSync(
      join(projectPath, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            outDir: './dist',
            rootDir: './src',
            strict: true
          }
        },
        null,
        2
      ),
      'utf8'
    );
    created.push('tsconfig.json');
  } else {
    mkdirSync(join(projectPath, 'src'), { recursive: true });
    writeFileSync(
      join(projectPath, 'src', 'index.js'),
      `console.log("Hello from ${options.name}!");\n`,
      'utf8'
    );
    created.push('src/index.js');
  }

  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf8');
  created.push('package.json');

  writeFileSync(
    join(projectPath, '.gitignore'),
    'node_modules\ndist\n.env\n*.log\n',
    'utf8'
  );
  created.push('.gitignore');

  writeFileSync(
    join(projectPath, 'README.md'),
    `# ${options.name}\n\nCreated using [devkit-cli](https://github.com/BillZCode).\n`,
    'utf8'
  );
  created.push('README.md');

  return { success: true, filesCreated: created };
}
