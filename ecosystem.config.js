const { cpus } = require('os')

const cpuLen = cpus().length

module.exports = {
  apps: [
    {
      name: 'nest-admin',
      script: './dist/main.js',
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      instances: cpuLen,
      max_memory_restart: '520M',
      args: '',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.APP_PORT,
      },
    },
  ],
}
