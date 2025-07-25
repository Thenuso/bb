#!/bin/bash

# Bulldog Stream Platform - Production Startup Script
# This script sets up and starts the complete streaming platform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="bulldog-stream-platform"
INSTALL_DIR="/var/www/bulldogstream"
LOG_DIR="/var/log/bulldogstream"
BACKUP_DIR="/var/backups/bulldogstream"
USER_NAME="bulldogstream"
NODE_VERSION="18"

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "    Bulldog Stream Platform Setup Script"
    echo "    Production Environment Installation"
    echo "=================================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

install_system_dependencies() {
    print_step "Installing system dependencies..."
    
    # Update package list
    apt update
    
    # Install essential packages
    apt install -y \
        curl \
        wget \
        git \
        nginx \
        ufw \
        fail2ban \
        htop \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        build-essential \
        python3 \
        python3-pip \
        certbot \
        python3-certbot-nginx \
        redis-server \
        postgresql-client
    
    print_info "System dependencies installed successfully"
}

install_nodejs() {
    print_step "Installing Node.js ${NODE_VERSION}..."
    
    # Install Node.js via NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
    
    # Install global packages
    npm install -g pm2 nodemon
    
    # Verify installation
    node_version=$(node --version)
    npm_version=$(npm --version)
    print_info "Node.js ${node_version} and npm ${npm_version} installed"
}

install_ffmpeg() {
    print_step "Installing FFmpeg for video processing..."
    
    apt install -y ffmpeg
    
    # Verify installation
    ffmpeg_version=$(ffmpeg -version | head -n1)
    print_info "FFmpeg installed: ${ffmpeg_version}"
}

create_user() {
    print_step "Creating application user..."
    
    # Create user if doesn't exist
    if ! id "$USER_NAME" &>/dev/null; then
        useradd -r -s /bin/bash -d "$INSTALL_DIR" "$USER_NAME"
        print_info "User '$USER_NAME' created"
    else
        print_info "User '$USER_NAME' already exists"
    fi
}

create_directories() {
    print_step "Creating application directories..."
    
    # Create directories
    mkdir -p "$INSTALL_DIR"
    mkdir -p "$LOG_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$INSTALL_DIR/uploads/videos"
    mkdir -p "$INSTALL_DIR/uploads/images"
    mkdir -p "$INSTALL_DIR/uploads/temp"
    mkdir -p "$INSTALL_DIR/ssl"
    mkdir -p "$INSTALL_DIR/dist"
    
    # Set ownership
    chown -R "$USER_NAME:$USER_NAME" "$INSTALL_DIR"
    chown -R "$USER_NAME:$USER_NAME" "$LOG_DIR"
    chown -R "$USER_NAME:$USER_NAME" "$BACKUP_DIR"
    
    # Set permissions
    chmod -R 755 "$INSTALL_DIR"
    chmod -R 755 "$LOG_DIR"
    chmod -R 755 "$BACKUP_DIR"
    
    print_info "Directories created and configured"
}

setup_firewall() {
    print_step "Configuring firewall..."
    
    # Reset UFW
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH
    ufw allow 22/tcp
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow application port (if different)
    ufw allow 3001/tcp
    
    # Enable UFW
    ufw --force enable
    
    print_info "Firewall configured and enabled"
}

setup_fail2ban() {
    print_step "Configuring Fail2Ban..."
    
    # Create custom jail for nginx
    cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF
    
    systemctl enable fail2ban
    systemctl restart fail2ban
    
    print_info "Fail2Ban configured and started"
}

configure_nginx() {
    print_step "Configuring Nginx..."
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    # Configure nginx.conf
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    # File upload
    client_max_body_size 500M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Include site configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF
    
    # Test nginx configuration
    nginx -t
    
    print_info "Nginx configured successfully"
}

setup_redis() {
    print_step "Configuring Redis..."
    
    # Configure Redis
    sed -i 's/^# maxmemory <bytes>/maxmemory 256mb/' /etc/redis/redis.conf
    sed -i 's/^# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
    
    # Enable and start Redis
    systemctl enable redis-server
    systemctl restart redis-server
    
    print_info "Redis configured and started"
}

setup_ssl() {
    print_step "Setting up SSL certificate..."
    
    domain=${1:-"bulldogstream.com"}
    email=${2:-"admin@bulldogstream.com"}
    
    if [ "$domain" != "bulldogstream.com" ]; then
        print_info "Setting up SSL for domain: $domain"
        
        # Get SSL certificate
        certbot certonly --nginx \
            --non-interactive \
            --agree-tos \
            --email "$email" \
            -d "$domain"
        
        # Setup auto-renewal
        (crontab -l 2>/dev/null || echo "") | grep -v certbot | {
            cat
            echo "0 12 * * * /usr/bin/certbot renew --quiet"
        } | crontab -
        
        print_info "SSL certificate obtained and auto-renewal configured"
    else
        print_warning "Using default domain, SSL setup skipped"
    fi
}

install_application() {
    print_step "Installing application..."
    
    cd "$INSTALL_DIR"
    
    # Copy application files
    if [ -f "../backend-production.js" ]; then
        cp ../backend-production.js .
        cp ../package.json .
        cp ../index-production.html index.html
        cp ../app-production.js .
        cp ../style-production.css .
        cp ../ecosystem.config.js .
        
        print_info "Application files copied"
    else
        print_warning "Application files not found in parent directory"
    fi
    
    # Install dependencies
    sudo -u "$USER_NAME" npm install --production
    
    # Build assets
    sudo -u "$USER_NAME" npm run build 2>/dev/null || true
    
    print_info "Application installed and built"
}

setup_systemd_services() {
    print_step "Setting up systemd services..."
    
    # Create systemd service for the application
    cat > /etc/systemd/system/bulldogstream.service << EOF
[Unit]
Description=Bulldog Stream Platform
Documentation=https://github.com/your-username/bulldog-stream-platform
After=network.target
Wants=network.target

[Service]
Type=forking
User=$USER_NAME
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/pm2 start ecosystem.config.js --env production
ExecReload=/usr/bin/pm2 reload ecosystem.config.js --env production
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
PIDFile=$INSTALL_DIR/.pm2/pm2.pid
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable service
    systemctl daemon-reload
    systemctl enable bulldogstream.service
    
    print_info "Systemd service created and enabled"
}

setup_monitoring() {
    print_step "Setting up monitoring and logging..."
    
    # Setup log rotation
    cat > /etc/logrotate.d/bulldogstream << 'EOF'
/var/log/bulldogstream/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
    create 644 bulldogstream bulldogstream
}
EOF
    
    # Setup PM2 log rotation
    sudo -u "$USER_NAME" pm2 install pm2-logrotate
    sudo -u "$USER_NAME" pm2 set pm2-logrotate:max_size 100M
    sudo -u "$USER_NAME" pm2 set pm2-logrotate:compress true
    sudo -u "$USER_NAME" pm2 set pm2-logrotate:retain 30
    
    print_info "Monitoring and logging configured"
}

create_startup_scripts() {
    print_step "Creating management scripts..."
    
    # Create start script
    cat > "$INSTALL_DIR/start.sh" << 'EOF'
#!/bin/bash
cd /var/www/bulldogstream
pm2 start ecosystem.config.js --env production
pm2 save
EOF
    
    # Create stop script
    cat > "$INSTALL_DIR/stop.sh" << 'EOF'
#!/bin/bash
cd /var/www/bulldogstream
pm2 stop ecosystem.config.js
EOF
    
    # Create restart script
    cat > "$INSTALL_DIR/restart.sh" << 'EOF'
#!/bin/bash
cd /var/www/bulldogstream
pm2 reload ecosystem.config.js --env production
EOF
    
    # Create status script
    cat > "$INSTALL_DIR/status.sh" << 'EOF'
#!/bin/bash
echo "=== PM2 Status ==="
pm2 status
echo ""
echo "=== System Resources ==="
free -h
echo ""
df -h
echo ""
echo "=== Service Status ==="
systemctl status nginx
systemctl status redis-server
EOF
    
    # Make scripts executable
    chmod +x "$INSTALL_DIR"/*.sh
    chown "$USER_NAME:$USER_NAME" "$INSTALL_DIR"/*.sh
    
    print_info "Management scripts created"
}

start_services() {
    print_step "Starting services..."
    
    # Start and enable system services
    systemctl enable nginx
    systemctl start nginx
    
    systemctl enable redis-server
    systemctl start redis-server
    
    # Start application with PM2
    cd "$INSTALL_DIR"
    sudo -u "$USER_NAME" pm2 start ecosystem.config.js --env production
    sudo -u "$USER_NAME" pm2 save
    sudo -u "$USER_NAME" pm2 startup
    
    # Start bulldogstream service
    systemctl start bulldogstream.service
    
    print_info "All services started successfully"
}

print_completion_info() {
    print_header
    
    echo -e "${GREEN}🎉 Bulldog Stream Platform Installation Complete!${NC}"
    echo ""
    echo -e "${BLUE}📍 Installation Details:${NC}"
    echo "   Application Directory: $INSTALL_DIR"
    echo "   Log Directory: $LOG_DIR"
    echo "   Backup Directory: $BACKUP_DIR"
    echo "   User: $USER_NAME"
    echo ""
    echo -e "${BLUE}🔧 Management Commands:${NC}"
    echo "   Start:   systemctl start bulldogstream"
    echo "   Stop:    systemctl stop bulldogstream"
    echo "   Restart: systemctl restart bulldogstream"
    echo "   Status:  systemctl status bulldogstream"
    echo "   Logs:    journalctl -u bulldogstream -f"
    echo ""
    echo -e "${BLUE}📊 PM2 Commands:${NC}"
    echo "   Status:  sudo -u $USER_NAME pm2 status"
    echo "   Logs:    sudo -u $USER_NAME pm2 logs"
    echo "   Monitor: sudo -u $USER_NAME pm2 monit"
    echo ""
    echo -e "${BLUE}📁 Quick Scripts:${NC}"
    echo "   Start:   $INSTALL_DIR/start.sh"
    echo "   Stop:    $INSTALL_DIR/stop.sh"
    echo "   Restart: $INSTALL_DIR/restart.sh"
    echo "   Status:  $INSTALL_DIR/status.sh"
    echo ""
    echo -e "${YELLOW}⚠️  Next Steps:${NC}"
    echo "   1. Configure your .env file in $INSTALL_DIR"
    echo "   2. Set up your database (run database-schema.sql)"
    echo "   3. Configure your domain and SSL certificate"
    echo "   4. Update Nginx configuration for your domain"
    echo "   5. Test the application"
    echo ""
    echo -e "${GREEN}🌐 Access your application:${NC}"
    echo "   HTTP:  http://your-domain"
    echo "   HTTPS: https://your-domain (after SSL setup)"
    echo "   Local: http://localhost"
    echo ""
}

# Main execution
main() {
    print_header
    
    # Check if running as root
    check_root
    
    # Parse command line arguments
    DOMAIN=${1:-"bulldogstream.com"}
    EMAIL=${2:-"admin@bulldogstream.com"}
    
    print_info "Starting installation for domain: $DOMAIN"
    
    # Installation steps
    install_system_dependencies
    install_nodejs
    install_ffmpeg
    create_user
    create_directories
    setup_firewall
    setup_fail2ban
    configure_nginx
    setup_redis
    install_application
    setup_systemd_services
    setup_monitoring
    create_startup_scripts
    
    # Setup SSL if domain is provided
    if [ "$DOMAIN" != "bulldogstream.com" ]; then
        setup_ssl "$DOMAIN" "$EMAIL"
    fi
    
    start_services
    
    print_completion_info
    
    echo -e "${GREEN}✅ Installation completed successfully!${NC}"
}

# Run main function with all arguments
main "$@"
