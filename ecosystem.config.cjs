module.exports = {
  apps: [
    {
      name: 'it-hub-backend',
      cwd: '/home/sabbil/Dokumen/TKJ/personal-it-hub/backend',
      script: 'npm',
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
      cwd: '/home/sabbil/Dokumen/TKJ/personal-it-hub/frontend',
      script: 'npm',
      args: 'run dev',
      autorestart: true,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'omni-ai',
      cwd: '/home/sabbil/Dokumen/TKJ/personal-it-hub',
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
      cwd: '/home/sabbil/Dokumen/TKJ/personal-it-hub',
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
      cwd: '/home/sabbil/Dokumen/TKJ/personal-it-hub',
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
