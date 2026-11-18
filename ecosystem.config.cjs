const path = require('path');

const ROOT_DIR = __dirname;

module.exports = {
  apps: [
    {
      name: 'it-hub-backend',
      cwd: path.resolve(ROOT_DIR, 'backend'),
      script: process.platform === 'win32' ? 'npm.cmd' : 'npm',
      args: 'run dev',
      autorestart: true,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
    },
    {
      name: 'it-hub-frontend',
      cwd: path.resolve(ROOT_DIR, 'frontend'),
      script: process.platform === 'win32' ? 'npm.cmd' : 'npm',
      args: 'run dev',
      autorestart: true,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'omni-ai',
      cwd: ROOT_DIR,
      script: 'node',
      args: 'scripts/omni-server.mjs',
      autorestart: true,
      restart_delay: 3000,
      env: {
        PORT: 3002,
      },
    },
    {
      name: 'cyberlab-lks',
      cwd: ROOT_DIR,
      script: 'node',
      args: 'scripts/cyberlab-server.mjs',
      autorestart: true,
      restart_delay: 3000,
      env: {
        PORT: 3003,
      },
    },
    {
      name: 'devkit-toolkit',
      cwd: ROOT_DIR,
      script: 'node',
      args: 'scripts/devkit-server.mjs',
      autorestart: true,
      restart_delay: 3000,
      env: {
        PORT: 3004,
      },
    },
  ],
};
