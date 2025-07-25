# 🎯 Production Deployment Guide

This guide covers complete deployment of the Bulldog Stream Platform to production servers with proper security, monitoring, and scalability.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Automated Installation](#automated-installation)
4. [Manual Installation](#manual-installation)
5. [SSL & Security](#ssl--security)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)
8. [Scaling & Performance](#scaling--performance)
9. [Troubleshooting](#troubleshooting)

---

## 🏗 Prerequisites

### Server Requirements

#### Minimum Requirements
- **OS**: Ubuntu 20.04 LTS or newer
- **CPU**: 2 cores, 2.4 GHz
- **RAM**: 4 GB
- **Storage**: 50 GB SSD
- **Bandwidth**: 100 Mbps unmetered
- **Domain**: Registered domain with DNS access

#### Recommended Requirements
- **OS**: Ubuntu 22.04 LTS
- **CPU**: 4 cores, 3.0 GHz
- **RAM**: 8 GB
- **Storage**: 200 GB NVMe SSD
- **Bandwidth**: 1 Gbps unmetered
- **CDN**: CloudFlare or similar

### Required Services

#### Database (Choose One)
- **Supabase** (Recommended for easy setup)
  - Create account at [supabase.com](https://supabase.com)
  - Note your project URL and service key
- **Self-hosted PostgreSQL** (For complete control)
  - PostgreSQL 13+ with proper configuration

#### Payment Services
- **Stripe Account** with API keys
- **Cryptocurrency wallets** (BTC, ETH, USDT addresses)

#### Domain & DNS
- Domain name pointed to your server
- Cloudflare account (recommended for CDN)

---

## 🚀 Server Setup

### 1. Initial Server Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Configure timezone
sudo timedatectl set-timezone UTC

# Configure hostname
sudo hostnamectl set-hostname bulldogstream

# Add system user for the application
sudo adduser --system --group --home /var/www/bulldogstream bulldogstream
sudo usermod -aG sudo bulldogstream
```

### 2. Install Node.js 18 LTS

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### 3. Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u bulldogstream --hp /var/www/bulldogstream
```

### 4. Install and Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 5. Install Additional Services

```bash
# Install Redis (for caching)
sudo apt install -y redis-server

# Configure Redis
sudo sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Install Fail2Ban (security)
sudo apt install -y fail2ban

# Install Certbot (SSL certificates)
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

---

## 🤖 Automated Installation

### Option 1: One-Command Installation

```bash
# Download and run the installation script
wget https://raw.githubusercontent.com/your-repo/bulldog-stream-platform/main/install-production.sh
chmod +x install-production.sh
sudo ./install-production.sh your-domain.com admin@your-domain.com
```

### Option 2: Using the Installation Script

1. **Download the project**:
```bash
git clone https://github.com/your-repo/bulldog-stream-platform.git
cd bulldog-stream-platform
```

2. **Make installation script executable**:
```bash
chmod +x install-production.sh
```

3. **Run installation**:
```bash
sudo ./install-production.sh your-domain.com admin@your-domain.com
```

The script will:
- ✅ Install all system dependencies
- ✅ Configure system users and permissions
- ✅ Setup firewall and security
- ✅ Install and configure Nginx
- ✅ Setup SSL certificates
- ✅ Install the application
- ✅ Configure PM2 process management
- ✅ Setup monitoring and logging
- ✅ Configure automated backups

### Option 3: Using Deployment Script

If you already have a server configured:

```bash
# Configure environment first
cp .env.example .env
nano .env  # Edit with your actual values

# Run deployment script
node deploy-production.js
```

---

## 🔧 Manual Installation

### 1. Application Setup

```bash
# Switch to application user
sudo su - bulldogstream

# Clone the repository
git clone https://github.com/your-repo/bulldog-stream-platform.git /var/www/bulldogstream/app
cd /var/www/bulldogstream/app

# Install Node.js dependencies
npm ci --production

# Create necessary directories
mkdir -p logs uploads/videos uploads/images

# Set proper permissions
sudo chown -R bulldogstream:bulldogstream /var/www/bulldogstream
sudo chmod -R 755 /var/www/bulldogstream
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

**Essential environment variables:**
```bash
# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com

# Database (Supabase recommended)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
BCRYPT_ROUNDS=12

# Payments
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cryptocurrency
BTC_ADDRESS=your-bitcoin-address
ETH_ADDRESS=your-ethereum-address
USDT_ADDRESS=your-usdt-address

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Database Setup

#### Option A: Supabase (Recommended)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and keys

2. **Run Database Schema**:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `database-schema.sql`
   - Execute the SQL

3. **Configure Row Level Security** (optional):
   ```sql
   -- Enable RLS on sensitive tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   
   -- Create policies as needed
   CREATE POLICY "Users can view own data" ON users
     FOR SELECT USING (auth.uid() = id);
   ```

#### Option B: Self-hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE bulldogstream;
CREATE USER bulldogstream_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE bulldogstream TO bulldogstream_user;
\q
```

```bash
# Run database schema
psql -U bulldogstream_user -d bulldogstream -f database-schema.sql
```

### 4. PM2 Process Configuration

```bash
# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Verify services are running
pm2 status
```

Expected PM2 output:
```
┌─────────────────────┬──────┬─────────┬──────────┐
│ App name            │ id   │ status  │ memory   │
├─────────────────────┼──────┼─────────┼──────────┤
│ bulldog-stream      │ 0    │ online  │ 124.2 MB │
│ bulldog-worker      │ 1    │ online  │ 87.5 MB  │
│ bulldog-stream-proc │ 2    │ online  │ 92.1 MB  │
│ bulldog-scheduler   │ 3    │ online  │ 45.8 MB  │
└─────────────────────┴──────┴─────────┴──────────┘
```

### 5. Nginx Configuration

Create nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/bulldogstream
```

```nginx
# Main server block with SSL
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # File upload limit
    client_max_body_size 500M;

    # Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        root /var/www/bulldogstream/app;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }

    # Video files with range support
    location /uploads/videos/ {
        root /var/www/bulldogstream/app;
        add_header Accept-Ranges bytes;
        expires 1d;
    }

    # Main application
    location / {
        root /var/www/bulldogstream/app;
        try_files $uri $uri/ /index-production.html;
        
        # Cache static HTML
        location ~* \.html$ {
            expires 1h;
            add_header Cache-Control "public";
        }
    }

    # Admin interface
    location /admin.htm {
        root /var/www/bulldogstream/app;
        expires 1h;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:3001/api/health;
        access_log off;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|config)$ {
        deny all;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# www to non-www redirect
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.your-domain.com;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    return 301 https://your-domain.com$request_uri;
}
```

Enable the site:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bulldogstream /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 SSL & Security

### 1. SSL Certificate Setup

```bash
# Install Certbot
sudo snap install --classic certbot

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --email admin@your-domain.com --agree-tos --no-eff-email

# Test automatic renewal
sudo certbot renew --dry-run
```

### 2. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check firewall status
sudo ufw status verbose
```

### 3. Fail2Ban Configuration

```bash
# Create Nginx jail configuration
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noproxy]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
```

```bash
# Restart Fail2Ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status
```

### 4. Security Hardening

```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Update system automatically
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Install and configure logwatch
sudo apt install -y logwatch
sudo nano /etc/cron.daily/00logwatch
```

---

## 📊 Monitoring & Logging

### 1. Application Logging

PM2 automatically manages logs. Access them with:

```bash
# View all logs
pm2 logs

# View specific service logs
pm2 logs bulldog-stream

# View log files directly
tail -f /var/www/bulldogstream/.pm2/logs/bulldog-stream-out.log
tail -f /var/www/bulldogstream/.pm2/logs/bulldog-stream-error.log
```

### 2. System Monitoring

```bash
# Install htop for system monitoring
sudo apt install -y htop

# Install system monitoring tools
sudo apt install -y iotop nethogs

# Check system status
pm2 monit
htop
```

### 3. Application Health Monitoring

Create a health check script:

```bash
sudo nano /usr/local/bin/bulldog-health-check
```

```bash
#!/bin/bash

# Health check script for Bulldog Stream Platform
API_URL="https://your-domain.com/api/health"
EMAIL="admin@your-domain.com"
LOG_FILE="/var/log/bulldog-health.log"

# Check API health
RESPONSE=$(curl -s -w "%{http_code}" $API_URL)
HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" != "200" ]; then
    echo "$(date): Health check failed - HTTP $HTTP_CODE" >> $LOG_FILE
    
    # Restart PM2 services
    pm2 restart all
    
    # Send alert email (requires mailutils)
    echo "Bulldog Stream Platform health check failed. Services restarted." | mail -s "Health Check Alert" $EMAIL
else
    echo "$(date): Health check passed" >> $LOG_FILE
fi
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/bulldog-health-check

# Add to crontab (run every 5 minutes)
echo "*/5 * * * * /usr/local/bin/bulldog-health-check" | sudo crontab -
```

### 4. Log Rotation

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/bulldogstream
```

```
/var/www/bulldogstream/.pm2/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 bulldogstream bulldogstream
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/bulldog-health.log {
    weekly
    missingok
    rotate 12
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

---

## 💾 Backup & Recovery

### 1. Database Backup

#### Supabase Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-database
```

```bash
#!/bin/bash

# Supabase backup script
BACKUP_DIR="/var/backups/bulldogstream"
DATE=$(date +%Y%m%d_%H%M%S)
SUPABASE_URL="your-supabase-url"
SERVICE_KEY="your-service-key"

mkdir -p $BACKUP_DIR

# Use pg_dump via Supabase connection
pg_dump "$DATABASE_URL" > "$BACKUP_DIR/db_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

#### Local PostgreSQL Backup
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/bulldogstream"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="bulldogstream"
DB_USER="bulldogstream_user"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER -h localhost $DB_NAME > "$BACKUP_DIR/db_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

# Remove old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### 2. Application Backup

```bash
# Create application backup script
sudo nano /usr/local/bin/backup-application
```

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/bulldogstream"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/bulldogstream/app"

mkdir -p $BACKUP_DIR

# Backup uploads and configuration
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" \
    -C "$APP_DIR" \
    uploads/ \
    .env \
    logs/ \
    --exclude="logs/*.log"

# Remove old backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +7 -delete

echo "Application backup completed: app_backup_$DATE.tar.gz"
```

### 3. Automated Backup Schedule

```bash
# Make scripts executable
sudo chmod +x /usr/local/bin/backup-database
sudo chmod +x /usr/local/bin/backup-application

# Add to crontab
sudo crontab -e
```

Add these lines:
```cron
# Daily database backup at 2 AM
0 2 * * * /usr/local/bin/backup-database

# Daily application backup at 3 AM
0 3 * * * /usr/local/bin/backup-application
```

### 4. Backup to Cloud Storage (Optional)

```bash
# Install AWS CLI for S3 backup
sudo apt install -y awscli

# Configure AWS credentials
aws configure

# Create cloud backup script
sudo nano /usr/local/bin/backup-to-cloud
```

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/bulldogstream"
S3_BUCKET="your-backup-bucket"
DATE=$(date +%Y%m%d)

# Upload latest backups to S3
aws s3 sync $BACKUP_DIR s3://$S3_BUCKET/bulldogstream/$DATE/

echo "Cloud backup completed"
```

---

## 📈 Scaling & Performance

### 1. Performance Optimization

#### Enable Redis Caching
```bash
# Install Redis if not already installed
sudo apt install -y redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
```

Update Redis configuration:
```
# Set max memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Enable persistence
save 900 1
save 300 10
save 60 10000
```

#### Optimize PM2 Configuration

Edit `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'bulldog-stream',
      script: 'backend-production.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Performance optimizations
      node_args: '--max-old-space-size=2048',
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10
    }
  ]
};
```

### 2. CDN Configuration

#### CloudFlare Setup
1. **Add Domain to CloudFlare**
2. **Configure DNS**:
   - A record: `@` → `your-server-ip`
   - A record: `www` → `your-server-ip`
3. **Enable CDN Features**:
   - Auto Minify (CSS, JS, HTML)
   - Brotli compression
   - Rocket Loader
4. **Configure Caching Rules**:
   ```
   Cache Level: Standard
   Browser Cache TTL: 1 year (for static assets)
   Page Rules:
   - *.css, *.js, *.png, *.jpg → Cache Everything, TTL 1 year
   - /api/* → Bypass Cache
   ```

### 3. Database Optimization

#### PostgreSQL Tuning
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_username ON users(username);
CREATE INDEX CONCURRENTLY idx_channels_category ON tv_channels(category);
CREATE INDEX CONCURRENTLY idx_content_type_genre ON media_content(type, genre);
CREATE INDEX CONCURRENTLY idx_transactions_user_id ON transactions(user_id);

-- Analyze tables for query optimization
ANALYZE users;
ANALYZE tv_channels;
ANALYZE media_content;
ANALYZE transactions;
```

#### Supabase Optimization
- Enable database extensions in Supabase dashboard
- Configure connection pooling
- Monitor query performance in Supabase metrics

### 4. Load Balancing (For High Traffic)

#### Nginx Load Balancer Configuration
```nginx
upstream backend {
    least_conn;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=30s;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://backend;
        # ... other proxy settings
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check logs for errors
pm2 logs bulldog-stream

# Check environment variables
pm2 env 0

# Restart application
pm2 restart bulldog-stream
```

**Common causes:**
- Missing environment variables
- Database connection issues
- Port already in use
- File permission problems

#### 2. Database Connection Issues
```bash
# Test database connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
supabase.from('users').select('count').then(console.log).catch(console.error);
"

# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test Nginx configuration
sudo nginx -t
```

#### 4. Performance Issues
```bash
# Check system resources
htop
free -h
df -h

# Check PM2 memory usage
pm2 monit

# Check slow queries (if using local PostgreSQL)
sudo tail -f /var/log/postgresql/postgresql.log | grep "slow"
```

#### 5. Payment Issues
```bash
# Test Stripe connection
curl -u sk_test_...: https://api.stripe.com/v1/charges

# Check webhook endpoint
curl -X POST https://your-domain.com/api/payments/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded"}'
```

### Debugging Commands

```bash
# Check all services
sudo systemctl status nginx
sudo systemctl status redis-server
pm2 status

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
pm2 logs

# Check network connectivity
netstat -tulpn | grep :3001
netstat -tulpn | grep :443

# Check disk space
df -h
du -sh /var/www/bulldogstream/*

# Check memory usage
free -h
ps aux | grep node

# Check open files
lsof -p $(pgrep -f "bulldog-stream")
```

### Emergency Recovery

#### Complete Service Restart
```bash
# Stop all services
pm2 stop all
sudo systemctl stop nginx

# Start services
sudo systemctl start nginx
pm2 start ecosystem.config.js --env production

# Check health
curl https://your-domain.com/api/health
```

#### Database Recovery
```bash
# Restore from backup
gunzip /var/backups/bulldogstream/db_backup_YYYYMMDD_HHMMSS.sql.gz
psql -U user -d bulldogstream < db_backup_YYYYMMDD_HHMMSS.sql
```

#### Application Recovery
```bash
# Restore application files
cd /var/www/bulldogstream
tar -xzf /var/backups/bulldogstream/app_backup_YYYYMMDD_HHMMSS.tar.gz

# Restart services
pm2 restart all
```

---

## 📞 Support and Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Check log sizes
du -sh /var/log/*
du -sh /var/www/bulldogstream/.pm2/logs/*

# Restart PM2 processes
pm2 restart all
```

#### Monthly Tasks
```bash
# Review access logs
sudo goaccess /var/log/nginx/access.log --log-format=COMBINED

# Check SSL certificate expiry
sudo certbot certificates

# Review and clean old backups
ls -la /var/backups/bulldogstream/

# Update Node.js packages
cd /var/www/bulldogstream/app
npm audit
npm update
```

#### Quarterly Tasks
```bash
# Full system update
sudo apt update && sudo apt full-upgrade -y

# Review security
sudo lynis audit system

# Performance review
pm2 monit

# Database maintenance
VACUUM ANALYZE; (for PostgreSQL)
```

### Getting Help

- **Documentation**: Check README-PRODUCTION.md and API-DOCUMENTATION.md
- **Logs**: Always check PM2 and Nginx logs first
- **Health Check**: Use `/api/health` endpoint
- **Community**: GitHub Issues and Discussions

---

**Last Updated:** January 2024  
**Deployment Guide Version:** 1.0.0
