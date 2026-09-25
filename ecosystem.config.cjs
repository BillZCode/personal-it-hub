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
  ],
};
