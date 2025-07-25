# 🚀 Quick Start Guide - Bulldog Stream Platform

Get your streaming platform running in **under 10 minutes**!

## 🎯 Choose Your Setup Method

### 🔥 Option 1: One-Command Production Setup (Recommended)
```bash
# Download and run automated installer
curl -fsSL https://raw.githubusercontent.com/your-repo/bulldog-stream/main/install-production.sh | sudo bash -s your-domain.com admin@your-domain.com
```
**This will set up everything automatically on Ubuntu 20.04+ servers!**

### 💻 Option 2: Development Setup (5 minutes)
```bash
# 1. Clone the project
git clone https://github.com/your-repo/bulldog-stream-platform.git
cd bulldog-stream-platform

# 2. Copy environment file
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Setup database (choose Supabase - it's free!)
# Go to https://supabase.com → Create project → Copy URL and keys to .env

# 5. Start development server
npm run dev
```

### ⚡ Option 3: Demo Mode (2 minutes)
```bash
# Quick demo with simulated data
git clone https://github.com/your-repo/bulldog-stream-platform.git
cd bulldog-stream-platform
npm install
npm run demo
```

---

## 📋 Prerequisites

### For Development
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Code editor** (VS Code recommended)
- **Modern browser** (Chrome, Firefox, Safari)

### For Production
- **Ubuntu 20.04+ server** (2GB RAM minimum)
- **Domain name** pointed to your server
- **Supabase account** (free tier available)
- **Stripe account** for payments (optional)

---

## 🔧 Environment Setup

### 1. Database Setup (Supabase - Free & Easy)

1. **Create Supabase Account**:
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create new organization and project

2. **Get Your Credentials**:
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Setup Database Schema**:
   - Go to SQL Editor in Supabase
   - Copy entire content from `database-schema.sql`
   - Click "Run" to create all tables

### 2. Environment Configuration

Edit your `.env` file:
```bash
# Essential settings for quick start
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Supabase (get from your project dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Security (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Payments (optional for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

---

## � Launch Your Platform

### Development Mode
```bash
# Start backend server
npm run dev

# Open in browser
open http://localhost:3000
```

### Production Mode
```bash
# Deploy to production server
npm run deploy

# Start with PM2 process manager
pm2 start ecosystem.config.js --env production
```

---

## 👥 Default Accounts

After setup, you can login with these demo accounts:

### Admin Account
- **Email**: `admin@bulldogstream.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard

### Demo User
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Access**: Regular user features

---

## 🎯 Testing Your Setup

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```
Should return: `{"success": true, "status": "healthy"}`

### 2. Frontend Access
- **Main Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.htm

### 3. API Testing
```bash
# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

---

## � Common Issues & Quick Fixes

### ❌ Database Connection Failed
```bash
# Check your Supabase credentials in .env
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
node -e "console.log('Testing DB...'); require('@supabase/supabase-js').createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY).from('users').select('count').then(console.log)"
```

### ❌ Port Already in Use
```bash
# Kill process on port 3001
sudo lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

### ❌ NPM Install Errors
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### ❌ Permission Errors (Linux/Mac)
```bash
# Fix permissions
sudo chown -R $(whoami) .
chmod +x *.sh
```

---

## 📊 What You Get Out of the Box

### ✅ User Features
- **Registration & Login** with JWT authentication
- **Live TV Streaming** with HLS player
- **Movies & Series** library
- **Coin System** for content access
- **Referral Program** for earning rewards
- **Responsive Design** works on all devices

### ✅ Admin Features  
- **User Management** - view, edit, ban users
- **Content Management** - upload and organize media
- **Analytics Dashboard** - user stats and revenue
- **Financial Overview** - transactions and payments
- **System Monitoring** - health and performance

### ✅ Technical Features
- **Real Database** with PostgreSQL/Supabase
- **Payment Integration** with Stripe
- **Video Streaming** with HLS.js
- **SEO Optimization** with dynamic sitemaps
- **Security** with rate limiting and encryption
- **Scalability** with PM2 clustering

---

## 🚀 Next Steps

### For Development
1. **Customize Design** - Edit `style-production.css`
2. **Add Content** - Upload videos and channels via admin
3. **Configure Payments** - Add your Stripe keys
4. **Test Features** - Try all functionality

### For Production
1. **Get a Domain** - Point DNS to your server
2. **Run Installation** - Use automated script
3. **Configure SSL** - Automatic with Let's Encrypt
4. **Monitor Performance** - Built-in monitoring tools

### For Business
1. **Add Real Content** - Upload your videos/streams
2. **Set Up Payments** - Configure Stripe for real transactions
3. **Marketing Setup** - Configure SEO and social sharing
4. **Scale Infrastructure** - Add CDN and load balancing

---

## 📚 Documentation Links

- **[Complete README](README-PRODUCTION.md)** - Full feature documentation
- **[API Documentation](API-DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT-GUIDE.md)** - Production deployment
- **[Database Schema](database-schema.sql)** - Database structure

---

## 💬 Need Help?

### Get Support
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check README and guides first
- **Community**: Join discussions for help

### Development Resources
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **HLS.js Docs**: https://github.com/video-dev/hls.js/
- **Express.js**: https://expressjs.com/

---

## 🎉 You're Ready!

Your **Bulldog Stream Platform** is now ready to go! 

**Development**: Perfect for testing and customization  
**Production**: Enterprise-ready with scaling and monitoring  
**Business**: Complete solution for streaming service

**Happy Streaming! 🎬**

**Just upload and start earning! 💰**

---

*Last updated: January 2025*
