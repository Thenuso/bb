/**
 * Production Deployment Script for Bulldog Stream Platform
 * Handles automated deployment, optimization, and monitoring setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

class DeploymentManager {
    constructor() {
        this.config = {
            projectName: 'bulldog-stream-platform',
            productionPath: '/var/www/bulldogstream',
            backupPath: '/var/backups/bulldogstream',
            logPath: '/var/log/bulldogstream',
            sslPath: '/etc/ssl/bulldogstream',
            nginxConfig: '/etc/nginx/sites-available/bulldogstream',
            pm2Config: 'ecosystem.config.js'
        };
        
        this.deploymentSteps = [
            'validateEnvironment',
            'createDirectories',
            'copyFiles',
            'installDependencies',
            'buildAssets',
            'setupDatabase',
            'configureSecurity',
            'setupSSL',
            'configureNginx',
            'setupMonitoring',
            'startServices',
            'validateDeployment'
        ];
    }

    async deploy() {
        console.log('🚀 Starting Bulldog Stream Platform Deployment...\n');
        
        try {
            for (const step of this.deploymentSteps) {
                console.log(`📋 Executing: ${step}`);
                await this[step]();
                console.log(`✅ Completed: ${step}\n`);
            }
            
            console.log('🎉 Deployment completed successfully!');
            this.printPostDeploymentInfo();
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            process.exit(1);
        }
    }

    async validateEnvironment() {
        // Check Node.js version
        const nodeVersion = process.version;
        const requiredVersion = 'v16.0.0';
        
        if (nodeVersion < requiredVersion) {
            throw new Error(`Node.js ${requiredVersion} or higher required. Current: ${nodeVersion}`);
        }
        
        // Check required environment variables
        const requiredEnvVars = [
            'SUPABASE_URL',
            'SUPABASE_SERVICE_KEY',
            'JWT_SECRET',
            'STRIPE_SECRET_KEY'
        ];
        
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
        
        // Check system dependencies
        try {
            execSync('which nginx', { stdio: 'ignore' });
            execSync('which pm2', { stdio: 'ignore' });
            execSync('which certbot', { stdio: 'ignore' });
        } catch (error) {
            console.log('Installing required system dependencies...');
            execSync('sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx', { stdio: 'inherit' });
            execSync('npm install -g pm2', { stdio: 'inherit' });
        }
        
        console.log('Environment validation passed');
    }

    async createDirectories() {
        const directories = [
            this.config.productionPath,
            this.config.backupPath,
            this.config.logPath,
            path.join(this.config.productionPath, 'uploads'),
            path.join(this.config.productionPath, 'uploads/videos'),
            path.join(this.config.productionPath, 'uploads/images'),
            path.join(this.config.productionPath, 'ssl'),
            path.join(this.config.productionPath, 'logs')
        ];
        
        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
                console.log(`Created directory: ${dir}`);
            }
        });
        
        // Set proper permissions
        execSync(`sudo chown -R $USER:$USER ${this.config.productionPath}`, { stdio: 'inherit' });
        execSync(`sudo chmod -R 755 ${this.config.productionPath}`, { stdio: 'inherit' });
    }

    async copyFiles() {
        const filesToCopy = [
            'backend-production.js',
            'index-production.html',
            'app-production.js',
            'style-production.css',
            'package.json',
            'database-schema.sql',
            '.env',
            'ecosystem.config.js'
        ];
        
        filesToCopy.forEach(file => {
            const source = path.join(process.cwd(), file);
            const destination = path.join(this.config.productionPath, file);
            
            if (fs.existsSync(source)) {
                fs.copyFileSync(source, destination);
                console.log(`Copied: ${file}`);
            } else {
                console.warn(`Warning: ${file} not found, skipping...`);
            }
        });
        
        // Copy additional assets
        if (fs.existsSync('manifest.json')) {
            fs.copyFileSync('manifest.json', path.join(this.config.productionPath, 'manifest.json'));
        }
        
        if (fs.existsSync('sw.js')) {
            fs.copyFileSync('sw.js', path.join(this.config.productionPath, 'sw.js'));
        }
    }

    async installDependencies() {
        process.chdir(this.config.productionPath);
        
        console.log('Installing production dependencies...');
        execSync('npm ci --only=production', { stdio: 'inherit' });
        
        console.log('Installing PM2...');
        execSync('npm install -g pm2', { stdio: 'inherit' });
    }

    async buildAssets() {
        console.log('Building and optimizing assets...');
        
        // Create dist directory
        const distPath = path.join(this.config.productionPath, 'dist');
        if (!fs.existsSync(distPath)) {
            fs.mkdirSync(distPath);
        }
        
        // Minify CSS
        try {
            execSync('npx cleancss -o dist/style.min.css style-production.css', { stdio: 'inherit' });
            console.log('CSS minified successfully');
        } catch (error) {
            console.warn('CSS minification failed, using original file');
            fs.copyFileSync('style-production.css', path.join(distPath, 'style.min.css'));
        }
        
        // Minify JavaScript
        try {
            execSync('npx uglifyjs app-production.js -o dist/app.min.js -c -m', { stdio: 'inherit' });
            console.log('JavaScript minified successfully');
        } catch (error) {
            console.warn('JavaScript minification failed, using original file');
            fs.copyFileSync('app-production.js', path.join(distPath, 'app.min.js'));
        }
        
        // Update HTML to use minified assets
        let htmlContent = fs.readFileSync('index-production.html', 'utf8');
        htmlContent = htmlContent.replace('style-production.css', 'dist/style.min.css');
        htmlContent = htmlContent.replace('app-production.js', 'dist/app.min.js');
        fs.writeFileSync('index.html', htmlContent);
    }

    async setupDatabase() {
        console.log('Setting up database...');
        
        // Run database migrations
        if (fs.existsSync('database-schema.sql')) {
            console.log('Database schema found, manual setup required');
            console.log('Please run the database-schema.sql file in your PostgreSQL/Supabase database');
        }
        
        // Run any migration scripts
        try {
            if (fs.existsSync('scripts/migrate-database.js')) {
                execSync('node scripts/migrate-database.js', { stdio: 'inherit' });
            }
        } catch (error) {
            console.warn('Database migration script not found or failed');
        }
    }

    async configureSecurity() {
        console.log('Configuring security settings...');
        
        // Generate secure keys if not provided
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            const jwtSecret = crypto.randomBytes(64).toString('hex');
            console.log(`Generated JWT Secret: ${jwtSecret}`);
            console.log('Please add this to your .env file as JWT_SECRET');
        }
        
        // Setup firewall rules
        try {
            execSync('sudo ufw allow 80', { stdio: 'inherit' });
            execSync('sudo ufw allow 443', { stdio: 'inherit' });
            execSync('sudo ufw allow 22', { stdio: 'inherit' });
            execSync('sudo ufw --force enable', { stdio: 'inherit' });
            console.log('Firewall configured');
        } catch (error) {
            console.warn('Firewall configuration failed');
        }
        
        // Set up log rotation
        const logRotateConfig = `${this.config.logPath}/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}`;
        
        fs.writeFileSync('/tmp/bulldogstream-logrotate', logRotateConfig);
        try {
            execSync('sudo mv /tmp/bulldogstream-logrotate /etc/logrotate.d/bulldogstream', { stdio: 'inherit' });
        } catch (error) {
            console.warn('Log rotation setup failed');
        }
    }

    async setupSSL() {
        const domain = process.env.DOMAIN || 'bulldogstream.com';
        
        console.log(`Setting up SSL for domain: ${domain}`);
        
        try {
            // Use Let's Encrypt for SSL
            execSync(`sudo certbot certonly --nginx -d ${domain} --non-interactive --agree-tos --email admin@${domain}`, { stdio: 'inherit' });
            console.log('SSL certificate generated successfully');
            
            // Setup auto-renewal
            execSync('sudo crontab -l | grep -q certbot || (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -', { stdio: 'inherit' });
        } catch (error) {
            console.warn('SSL setup failed, will use HTTP');
        }
    }

    async configureNginx() {
        console.log('Configuring Nginx...');
        
        const domain = process.env.DOMAIN || 'bulldogstream.com';
        const port = process.env.PORT || 3001;
        
        const nginxConfig = `
server {
    listen 80;
    server_name ${domain} www.${domain};
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domain} www.${domain};
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; img-src 'self' data: https:; media-src 'self' https: blob:; connect-src 'self' https:; font-src 'self' https://cdnjs.cloudflare.com;";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Client max body size for uploads
    client_max_body_size 500M;
    
    # Static files
    location /dist/ {
        root ${this.config.productionPath};
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip_static on;
    }
    
    location /uploads/ {
        root ${this.config.productionPath};
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:${port};
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
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Main application
    location / {
        root ${this.config.productionPath};
        try_files $uri $uri/ /index.html;
        index index.html;
        
        # Cache static files
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Security: Block access to sensitive files
    location ~ /\\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ \\.(env|sql|config)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Logging
    access_log ${this.config.logPath}/nginx-access.log;
    error_log ${this.config.logPath}/nginx-error.log;
}
`;
        
        fs.writeFileSync('/tmp/bulldogstream-nginx', nginxConfig);
        
        try {
            execSync(`sudo mv /tmp/bulldogstream-nginx ${this.config.nginxConfig}`, { stdio: 'inherit' });
            execSync(`sudo ln -sf ${this.config.nginxConfig} /etc/nginx/sites-enabled/`, { stdio: 'inherit' });
            execSync('sudo nginx -t', { stdio: 'inherit' });
            execSync('sudo systemctl reload nginx', { stdio: 'inherit' });
            console.log('Nginx configured successfully');
        } catch (error) {
            console.error('Nginx configuration failed:', error.message);
        }
    }

    async setupMonitoring() {
        console.log('Setting up monitoring and logging...');
        
        // Create PM2 ecosystem file
        const pm2Config = `
module.exports = {
    apps: [{
        name: 'bulldog-stream',
        script: 'backend-production.js',
        cwd: '${this.config.productionPath}',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: ${process.env.PORT || 3001}
        },
        error_file: '${this.config.logPath}/pm2-error.log',
        out_file: '${this.config.logPath}/pm2-out.log',
        log_file: '${this.config.logPath}/pm2-combined.log',
        time: true,
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024',
        watch: false,
        ignore_watch: ['node_modules', 'logs', 'uploads'],
        max_restarts: 10,
        min_uptime: '10s'
    }]
};
`;
        
        fs.writeFileSync(path.join(this.config.productionPath, 'ecosystem.config.js'), pm2Config);
        
        // Setup PM2 startup
        try {
            execSync('pm2 startup', { stdio: 'inherit' });
        } catch (error) {
            console.warn('PM2 startup setup may require manual configuration');
        }
    }

    async startServices() {
        console.log('Starting services...');
        
        process.chdir(this.config.productionPath);
        
        try {
            // Start with PM2
            execSync('pm2 start ecosystem.config.js', { stdio: 'inherit' });
            execSync('pm2 save', { stdio: 'inherit' });
            
            // Enable and start nginx
            execSync('sudo systemctl enable nginx', { stdio: 'inherit' });
            execSync('sudo systemctl start nginx', { stdio: 'inherit' });
            
            console.log('Services started successfully');
        } catch (error) {
            console.error('Service startup failed:', error.message);
        }
    }

    async validateDeployment() {
        console.log('Validating deployment...');
        
        const port = process.env.PORT || 3001;
        const domain = process.env.DOMAIN || 'localhost';
        
        try {
            // Wait for service to start
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Check if PM2 process is running
            execSync('pm2 list | grep bulldog-stream', { stdio: 'inherit' });
            
            // Check if port is listening
            execSync(`netstat -tlnp | grep :${port}`, { stdio: 'inherit' });
            
            // Check nginx status
            execSync('sudo systemctl status nginx', { stdio: 'inherit' });
            
            console.log('Deployment validation passed');
        } catch (error) {
            console.error('Deployment validation failed:', error.message);
            throw error;
        }
    }

    printPostDeploymentInfo() {
        const domain = process.env.DOMAIN || 'localhost';
        const port = process.env.PORT || 3001;
        const protocol = fs.existsSync(`/etc/letsencrypt/live/${domain}`) ? 'https' : 'http';
        
        console.log(`
🎉 Bulldog Stream Platform Deployed Successfully!

📍 Application URLs:
   Frontend: ${protocol}://${domain}
   API: ${protocol}://${domain}/api
   Admin: ${protocol}://${domain}/admin.htm

🔧 Management Commands:
   View logs: pm2 logs bulldog-stream
   Restart app: pm2 restart bulldog-stream
   Stop app: pm2 stop bulldog-stream
   App status: pm2 status

📁 Important Paths:
   Application: ${this.config.productionPath}
   Logs: ${this.config.logPath}
   Backups: ${this.config.backupPath}

📊 Monitoring:
   PM2 Dashboard: pm2 monit
   Nginx Status: sudo systemctl status nginx
   App Logs: tail -f ${this.config.logPath}/pm2-combined.log

🔒 Security:
   SSL Certificate: ${fs.existsSync(`/etc/letsencrypt/live/${domain}`) ? '✅ Enabled' : '❌ Not configured'}
   Firewall: UFW enabled
   Security headers: Configured in Nginx

📝 Next Steps:
   1. Update DNS records to point to this server
   2. Configure environment variables in .env
   3. Set up database backups
   4. Configure monitoring alerts
   5. Test all functionality

🆘 Support:
   Documentation: Check README.md
   Logs Location: ${this.config.logPath}
   Configuration: ${this.config.productionPath}/.env
        `);
    }
}

// Run deployment if called directly
if (require.main === module) {
    const deployment = new DeploymentManager();
    deployment.deploy().catch(error => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });
}

module.exports = DeploymentManager;
