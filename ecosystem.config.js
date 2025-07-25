/**
 * PM2 Ecosystem Configuration for Bulldog Stream Platform
 * Production-ready process management configuration
 */

module.exports = {
  apps: [
    {
      // Main Application
      name: 'bulldog-stream-main',
      script: 'backend-production.js',
      cwd: '/var/www/bulldogstream',
      instances: 'max', // Auto-scale based on CPU cores
      exec_mode: 'cluster',
      
      // Environment Configuration
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        INSTANCE_TYPE: 'main'
      },
      
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3002,
        INSTANCE_TYPE: 'staging'
      },
      
      env_development: {
        NODE_ENV: 'development',
        PORT: 3003,
        INSTANCE_TYPE: 'development'
      },
      
      // Logging Configuration
      log_type: 'json',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/bulldogstream/pm2-error.log',
      out_file: '/var/log/bulldogstream/pm2-out.log',
      log_file: '/var/log/bulldogstream/pm2-combined.log',
      merge_logs: true,
      time: true,
      
      // Performance & Memory Management
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024 --optimize-for-size',
      
      // Auto-restart Configuration
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      
      // Monitoring
      watch: false, // Disable in production
      ignore_watch: [
        'node_modules',
        'logs',
        'uploads',
        'dist',
        '.git',
        'coverage',
        'backups'
      ],
      
      // Health Monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Advanced PM2 Options
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
      
      // Source Control
      post_update: ['npm install --production', 'npm run build'],
      
      // Environment Variables Override
      env_file: '.env'
    },
    
    {
      // Worker Process for Background Tasks
      name: 'bulldog-stream-worker',
      script: 'workers/background-worker.js',
      cwd: '/var/www/bulldogstream',
      instances: 2,
      exec_mode: 'cluster',
      
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'background',
        WORKER_CONCURRENCY: 5
      },
      
      // Logging
      error_file: '/var/log/bulldogstream/worker-error.log',
      out_file: '/var/log/bulldogstream/worker-out.log',
      log_file: '/var/log/bulldogstream/worker-combined.log',
      merge_logs: true,
      time: true,
      
      // Memory Management
      max_memory_restart: '512M',
      
      // Auto-restart
      autorestart: true,
      max_restarts: 15,
      min_uptime: '5s',
      restart_delay: 2000,
      
      watch: false,
      
      env_file: '.env'
    },
    
    {
      // Stream Processing Service
      name: 'bulldog-stream-processor',
      script: 'services/stream-processor.js',
      cwd: '/var/www/bulldogstream',
      instances: 1,
      exec_mode: 'fork',
      
      env: {
        NODE_ENV: 'production',
        SERVICE_TYPE: 'stream_processor',
        FFMPEG_THREADS: 4
      },
      
      // Logging
      error_file: '/var/log/bulldogstream/processor-error.log',
      out_file: '/var/log/bulldogstream/processor-out.log',
      log_file: '/var/log/bulldogstream/processor-combined.log',
      time: true,
      
      // Memory Management
      max_memory_restart: '2G',
      node_args: '--max-old-space-size=2048',
      
      // Auto-restart
      autorestart: true,
      max_restarts: 5,
      min_uptime: '30s',
      restart_delay: 10000,
      
      watch: false,
      
      env_file: '.env'
    },
    
    {
      // Cron Jobs & Scheduled Tasks
      name: 'bulldog-stream-scheduler',
      script: 'services/scheduler.js',
      cwd: '/var/www/bulldogstream',
      instances: 1,
      exec_mode: 'fork',
      
      env: {
        NODE_ENV: 'production',
        SERVICE_TYPE: 'scheduler'
      },
      
      // Logging
      error_file: '/var/log/bulldogstream/scheduler-error.log',
      out_file: '/var/log/bulldogstream/scheduler-out.log',
      log_file: '/var/log/bulldogstream/scheduler-combined.log',
      time: true,
      
      // Memory Management
      max_memory_restart: '256M',
      
      // Auto-restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 5000,
      
      // Cron restart - restart daily at 3 AM
      cron_restart: '0 3 * * *',
      
      watch: false,
      
      env_file: '.env'
    }
  ],
  
  // Deployment Configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['bulldogstream.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/bulldog-stream-platform.git',
      path: '/var/www/bulldogstream',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    
    staging: {
      user: 'deploy',
      host: ['staging.bulldogstream.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/bulldog-stream-platform.git',
      path: '/var/www/bulldogstream-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
};
