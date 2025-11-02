module.exports = {
  apps: [{
    name: 'etherpets-backend',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    // PM2 configuration
    instance_var: 'INSTANCE_ID',
    combine_logs: true,
    merge_logs: true,
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Auto-restart configuration
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
  }],
};