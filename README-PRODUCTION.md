# 🎬 Bulldog Stream Platform - Complete Production System

A **professional-grade streaming platform** with Live TV channels, Movies, Series, IPTV support, real-time payments, and advanced admin management.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Administration](#-administration)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Features

### 🎯 Core Platform Features
- **Live TV Streaming** - Real-time channel streaming with HLS support
- **Movies & Series** - Complete VOD library with metadata
- **IPTV Integration** - M3U playlist generation and EPG support
- **Multi-Quality Streaming** - 4K, 1080p, 720p, and mobile-optimized streams
- **Advanced Video Player** - HLS.js integration with quality switching
- **Real-time EPG** - Electronic Program Guide with live scheduling

### 💳 Payment & Monetization
- **Stripe Integration** - Credit card payments with webhooks
- **Cryptocurrency Support** - Bitcoin, Ethereum, USDT payments
- **Coin System** - Internal currency for content access
- **Premium Subscriptions** - Tiered access control
- **Referral Program** - Multi-level referral rewards
- **Survey Integration** - CPAGrip, AdGem, OfferToro support

### 👥 User Management
- **Authentication System** - JWT-based secure login
- **User Profiles** - Complete profile management
- **Access Control** - Role-based permissions
- **Session Management** - Multi-device support
- **Watch History** - Comprehensive viewing analytics
- **Parental Controls** - Content filtering and restrictions

### 🛠 Admin Features
- **Complete Dashboard** - Real-time analytics and management
- **Content Management** - Upload, organize, and moderate content
- **User Management** - User administration and moderation
- **Financial Management** - Transaction monitoring and reporting
- **System Monitoring** - Performance metrics and health checks
- **SEO Automation** - Dynamic sitemap and meta tag generation

### 🔧 Technical Features
- **Production Database** - PostgreSQL with Supabase integration
- **Real Streaming Infrastructure** - HLS and multi-stream support
- **CDN Integration** - Global content delivery
- **Performance Optimization** - Caching, compression, and scaling
- **Security Features** - Rate limiting, encryption, and protection
- **Mobile Responsive** - Progressive Web App (PWA) support

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Supabase** - Database hosting and real-time features
- **Redis** - Caching and session storage
- **JWT** - Authentication tokens
- **Stripe** - Payment processing
- **Socket.io** - Real-time communication

### Frontend
- **Vanilla JavaScript** - Core functionality
- **HTML5** - Semantic markup
- **CSS3** - Advanced styling with variables
- **HLS.js** - Video streaming
- **Video.js** - Video player framework
- **Progressive Web App** - Offline support

### Infrastructure
- **Nginx** - Reverse proxy and static file serving
- **PM2** - Process management
- **Let's Encrypt** - SSL certificates
- **UFW** - Firewall management
- **Fail2Ban** - Intrusion prevention
- **Systemd** - Service management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Nodemon** - Development server
- **Husky** - Git hooks

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+**
- **PostgreSQL 13+** (or Supabase account)
- **Redis** (optional, for caching)
- **Domain name** (for production)

### 1. Clone and Setup
```bash
git clone https://github.com/your-username/bulldog-stream-platform.git
cd bulldog-stream-platform

# Copy environment configuration
cp .env.example .env

# Install dependencies
npm install

# Setup database (see Configuration section)
# Run database-schema.sql in your PostgreSQL/Supabase database
```

### 2. Configure Environment
Edit `.env` file with your actual values:
```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Security
JWT_SECRET=your-super-secret-key-min-32-characters

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 3. Start Development Server
```bash
# Start backend
npm run dev

# Open browser
# Frontend: http://localhost:3000
# API: http://localhost:3001/api
```

---

## 🔧 Installation

### Development Installation

1. **System Requirements**
   ```bash
   # Install Node.js (Ubuntu/Debian)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL (optional, use Supabase instead)
   sudo apt-get install postgresql postgresql-contrib
   
   # Install Redis (optional)
   sudo apt-get install redis-server
   ```

2. **Project Setup**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/bulldog-stream-platform.git
   cd bulldog-stream-platform
   
   # Install dependencies
   npm install
   
   # Setup environment
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```sql
   -- Option 1: Local PostgreSQL
   createdb bulldogstream
   psql bulldogstream < database-schema.sql
   
   -- Option 2: Supabase (Recommended)
   -- 1. Create account at https://supabase.com
   -- 2. Create new project
   -- 3. Run database-schema.sql in SQL editor
   -- 4. Update .env with your Supabase credentials
   ```

### Production Installation

Use the automated installation script:

```bash
# Make script executable
chmod +x install-production.sh

# Run installation (as root)
sudo ./install-production.sh your-domain.com admin@your-domain.com

# Or use the deployment script
node deploy-production.js
```

---

## ⚙️ Configuration

### Environment Variables

#### Core Configuration
```bash
# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com

# Database (Supabase recommended)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
BCRYPT_ROUNDS=12
```

#### Payment Configuration
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cryptocurrency
BTC_ADDRESS=your-bitcoin-address
ETH_ADDRESS=your-ethereum-address
USDT_ADDRESS=your-usdt-address
```

#### Streaming Configuration
```bash
# Content Delivery
CDN_URL=https://cdn.your-domain.com
VIDEO_STORAGE_PATH=./uploads/videos
IMAGE_STORAGE_PATH=./uploads/images

# HLS Settings
HLS_SEGMENT_DURATION=10
HLS_PLAYLIST_SIZE=6
```

### Database Configuration

#### Supabase Setup (Recommended)
1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run the contents of `database-schema.sql`
5. Update `.env` with your project credentials
6. Enable Row Level Security (RLS) as needed

#### Local PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE bulldogstream;

-- Create user
CREATE USER bulldogstream_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bulldogstream TO bulldogstream_user;

-- Run schema
\i database-schema.sql
```

### Nginx Configuration

Production nginx configuration is automatically generated by the deployment script. For manual setup:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location / {
        root /var/www/bulldogstream;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "referralCode": "OPTIONAL123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Content Endpoints

#### Get Channels
```http
GET /api/channels?category=sports&premium_only=false
```

#### Get Channel Stream
```http
GET /api/channels/:id/stream
Authorization: Bearer <jwt_token>
```

#### Get Movies/Series
```http
GET /api/content?type=movie&genre=action&page=1&limit=20
```

### Payment Endpoints

#### Create Stripe Payment Intent
```http
POST /api/payments/stripe/create-payment-intent
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 1000,
  "coins": 1000
}
```

#### Generate Crypto Address
```http
POST /api/payments/crypto/generate-address
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currency": "BTC",
  "amount_usd": 10.00
}
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_jwt_token>
```

#### Get Users List
```http
GET /api/admin/users?page=1&limit=50&search=username
Authorization: Bearer <admin_jwt_token>
```

---

## 🚀 Deployment

### Automated Deployment

#### Using Installation Script
```bash
# Download and run
wget https://raw.githubusercontent.com/your-repo/bulldog-stream-platform/main/install-production.sh
chmod +x install-production.sh
sudo ./install-production.sh your-domain.com admin@your-domain.com
```

#### Using Deployment Script
```bash
# Configure environment
cp .env.example .env
# Edit .env with production values

# Run deployment
npm run deploy
```

### Manual Deployment

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y nodejs npm nginx postgresql-client redis-server

# Install PM2
sudo npm install -g pm2
```

#### 2. Application Setup
```bash
# Create directories
sudo mkdir -p /var/www/bulldogstream
sudo mkdir -p /var/log/bulldogstream

# Clone and setup
cd /var/www/bulldogstream
git clone https://github.com/your-repo/bulldog-stream-platform.git .
npm ci --production

# Setup environment
cp .env.example .env
# Edit .env with production values
```

#### 3. Process Management
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 4. Web Server Setup
```bash
# Configure Nginx (use generated config)
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d your-domain.com
```

### Environment-Specific Deployments

#### Staging Environment
```bash
pm2 start ecosystem.config.js --env staging
```

#### Development Environment
```bash
npm run dev
```

### Health Checks

After deployment, verify:
```bash
# Check PM2 status
pm2 status

# Check application health
curl http://localhost:3001/api/health

# Check nginx status
sudo systemctl status nginx

# Check logs
pm2 logs
tail -f /var/log/bulldogstream/app.log
```

---

## 👨‍💼 Administration

### Admin Dashboard Access

1. **Create Admin User**
   ```sql
   -- In your database
   UPDATE users SET is_admin = true WHERE email = 'admin@your-domain.com';
   ```

2. **Access Dashboard**
   - Navigate to `https://your-domain.com/admin.htm`
   - Login with admin credentials

### Admin Features

#### User Management
- View all users with pagination and search
- Manage user permissions and subscriptions
- Ban/unban users
- View user activity and statistics

#### Content Management
- Upload and organize videos
- Manage channel listings
- Configure streaming URLs
- Set access permissions and pricing

#### Financial Management
- Monitor transactions and payments
- Generate financial reports
- Manage coin rates and pricing
- Handle refunds and disputes

#### System Management
- Monitor system performance
- View error logs and diagnostics
- Configure application settings
- Manage API keys and integrations

### Common Admin Tasks

#### Adding New Channels
```sql
INSERT INTO tv_channels (name, description, category, logo_url, primary_stream_url, is_active)
VALUES ('Channel Name', 'Description', 'sports', 'logo-url', 'stream-url', true);
```

#### Managing User Coins
```sql
-- Add coins to user
UPDATE users SET coins = coins + 1000 WHERE email = 'user@example.com';

-- View transaction history
SELECT * FROM transactions WHERE user_id = 'user-uuid' ORDER BY created_at DESC;
```

#### System Monitoring
```bash
# View application logs
pm2 logs bulldog-stream

# Monitor resources
pm2 monit

# Check database connections
psql $DATABASE_URL -c "SELECT count(*) FROM users;"
```

---

## 💻 Development

### Development Setup

```bash
# Install development dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Project Structure

```
bulldog-stream-platform/
├── backend-production.js      # Main backend server
├── app-production.js          # Frontend JavaScript
├── style-production.css       # Frontend styles
├── index-production.html      # Frontend HTML
├── database-schema.sql        # Database structure
├── package.json              # Dependencies and scripts
├── ecosystem.config.js       # PM2 configuration
├── deploy-production.js      # Deployment script
├── install-production.sh     # Installation script
├── .env.example             # Environment template
├── scripts/                 # Utility scripts
├── uploads/                 # User uploaded content
├── logs/                   # Application logs
└── dist/                   # Built assets
```

### Development Workflow

#### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... develop feature ...

# Test changes
npm test
npm run lint

# Commit changes
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

#### 2. Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test user.test.js

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

#### 3. Database Migrations
```bash
# Create migration
npm run migrate:create add_new_column

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

### Code Style Guidelines

#### JavaScript
- Use ES6+ features
- Follow Standard JS style guide
- Use async/await for asynchronous operations
- Add JSDoc comments for functions
- Handle errors appropriately

#### CSS
- Use CSS custom properties (variables)
- Follow BEM methodology for class naming
- Use mobile-first responsive design
- Optimize for performance

#### Database
- Use parameterized queries
- Follow PostgreSQL naming conventions
- Add proper indexes for performance
- Use transactions for data consistency

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Check Supabase connection
curl -H "apikey: $SUPABASE_ANON_KEY" $SUPABASE_URL/rest/v1/

# Verify environment variables
echo $SUPABASE_URL
echo $DATABASE_URL
```

#### 2. Payment Processing Issues
```bash
# Test Stripe connection
curl https://api.stripe.com/v1/charges \
  -u $STRIPE_SECRET_KEY: \
  -d "amount=2000" \
  -d "currency=usd" \
  -d "source=tok_visa"

# Check webhook endpoint
curl -X POST https://your-domain.com/api/payments/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded"}'
```

#### 3. Streaming Issues
```bash
# Check video file accessibility
curl -I https://your-domain.com/uploads/videos/sample.mp4

# Test HLS playlist
curl https://your-domain.com/streams/channel1.m3u8

# Verify FFmpeg installation
ffmpeg -version
```

#### 4. Performance Issues
```bash
# Check memory usage
free -h
pm2 monit

# Check disk space
df -h

# Analyze slow queries
tail -f /var/log/postgresql/postgresql.log | grep "slow"
```

### Error Codes

#### API Error Codes
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error (server issue)

#### Application Error Codes
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `PAY_001` - Payment processing failed
- `STREAM_001` - Stream not available
- `USER_001` - Insufficient coins

### Debugging

#### Enable Debug Mode
```bash
# Set in .env
DEBUG_MODE=true
VERBOSE_LOGGING=true

# Restart application
pm2 restart bulldog-stream
```

#### View Detailed Logs
```bash
# Application logs
tail -f /var/log/bulldogstream/app.log

# PM2 logs
pm2 logs bulldog-stream --lines 100

# Nginx logs
tail -f /var/log/nginx/error.log

# System logs
journalctl -u bulldogstream -f
```

### Performance Optimization

#### Database Optimization
```sql
-- Add missing indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_channels_category ON tv_channels(category);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
```

#### Caching Configuration
```bash
# Redis configuration
redis-cli INFO memory
redis-cli CONFIG GET maxmemory-policy

# Application cache
curl http://localhost:3001/api/health/cache
```

#### CDN Setup
```bash
# Configure CloudFlare
# 1. Add domain to CloudFlare
# 2. Configure DNS records
# 3. Enable caching rules
# 4. Setup SSL

# Test CDN
curl -I https://cdn.your-domain.com/dist/app.min.js
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@bulldogstream.com

---

## 🙏 Acknowledgments

- [Video.js](https://videojs.com/) - HTML5 video player
- [HLS.js](https://github.com/video-dev/hls.js/) - HLS streaming support
- [Stripe](https://stripe.com/) - Payment processing
- [Supabase](https://supabase.com/) - Database and authentication
- [PM2](https://pm2.keymetrics.io/) - Process management

---

**Made with ❤️ by the Bulldog Stream Team**
