/**
 * Bulldog Stream Platform - Production Backend API
 * Complete backend with real database integration and business logic
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Environment configuration
const config = {
    supabase: {
        url: process.env.SUPABASE_URL || 'your-supabase-url',
        anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
        serviceKey: process.env.SUPABASE_SERVICE_KEY || 'your-service-key'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
        expiresIn: '7d'
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...'
    },
    crypto: {
        btc_address: process.env.BTC_ADDRESS || '',
        eth_address: process.env.ETH_ADDRESS || '',
        usdt_address: process.env.USDT_ADDRESS || ''
    },
    app: {
        frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
        admin_email: process.env.ADMIN_EMAIL || 'admin@bulldogstream.com'
    }
};

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

// Initialize Stripe
const stripeClient = stripe(config.stripe.secretKey);

// Middleware setup
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'", "https://js.stripe.com"],
            imgSrc: ["'self'", "data:", "https:"],
            mediaSrc: ["'self'", "https:", "blob:"],
            connectSrc: ["'self'", "https:"]
        }
    }
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors({
    origin: [config.app.frontend_url, 'http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many authentication attempts, please try again later.' }
});

// Middleware: Authentication
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', decoded.userId)
            .eq('is_active', true)
            .single();

        if (error || !user) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Middleware: Admin only
const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Middleware: Premium access
const requirePremium = (req, res, next) => {
    if (!req.user || (!req.user.is_premium && !req.user.is_admin)) {
        return res.status(403).json({ error: 'Premium subscription required' });
    }
    next();
};

// Utility Functions
const hashPassword = async (password) => {
    return bcrypt.hash(password, 12);
};

const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Database helper functions
const addCoins = async (userId, amount, type = 'bonus', description = '') => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('coins')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        const newBalance = user.coins + amount;

        const { error: updateError } = await supabase
            .from('users')
            .update({ coins: newBalance })
            .eq('id', userId);

        if (updateError) throw updateError;

        // Log transaction
        await supabase.from('transactions').insert({
            user_id: userId,
            type: type,
            amount_coins: amount,
            status: 'completed',
            description: description
        });

        return newBalance;
    } catch (error) {
        console.error('Error adding coins:', error);
        throw error;
    }
};

const deductCoins = async (userId, amount, type = 'purchase', description = '') => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('coins')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        if (user.coins < amount) {
            throw new Error('Insufficient coins');
        }

        const newBalance = user.coins - amount;

        const { error: updateError } = await supabase
            .from('users')
            .update({ coins: newBalance })
            .eq('id', userId);

        if (updateError) throw updateError;

        // Log transaction
        await supabase.from('transactions').insert({
            user_id: userId,
            type: type,
            amount_coins: -amount,
            status: 'completed',
            description: description
        });

        return newBalance;
    } catch (error) {
        console.error('Error deducting coins:', error);
        throw error;
    }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Authentication Routes
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { email, username, password, referralCode } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Email, username, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check for existing user
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .or(`email.eq.${email},username.eq.${username}`)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        const hashedPassword = await hashPassword(password);

        // Create user
        const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
                email,
                username,
                password_hash: hashedPassword,
                display_name: username,
                coins: 100 // Welcome bonus
            })
            .select()
            .single();

        if (userError) {
            console.error('User creation error:', userError);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        // Handle referral
        if (referralCode) {
            const { data: referrer } = await supabase
                .from('users')
                .select('id')
                .eq('username', referralCode)
                .single();

            if (referrer) {
                // Create referral record
                await supabase.from('referrals').insert({
                    referrer_id: referrer.id,
                    referred_id: newUser.id,
                    referral_code: referralCode,
                    status: 'completed',
                    signup_completed_at: new Date().toISOString()
                });

                // Award referral bonus
                await addCoins(referrer.id, 500, 'referral', `Referral bonus for ${username}`);
                await addCoins(newUser.id, 250, 'referral', 'Referral signup bonus');
            }
        }

        const token = generateToken(newUser.id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                display_name: newUser.display_name,
                coins: newUser.coins,
                is_premium: newUser.is_premium,
                is_admin: newUser.is_admin
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or username

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Email/username and password are required' });
        }

        // Find user by email or username
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${identifier},username.eq.${identifier}`)
            .eq('is_active', true)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await comparePassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last active
        await supabase
            .from('users')
            .update({ last_active_at: new Date().toISOString() })
            .eq('id', user.id);

        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                display_name: user.display_name,
                coins: user.coins,
                is_premium: user.is_premium,
                is_admin: user.is_admin,
                premium_expires_at: user.premium_expires_at,
                iptv_access: user.iptv_access,
                iptv_expires_at: user.iptv_expires_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select(`
                id, email, username, display_name, avatar_url, 
                region, timezone, language, coins, is_premium, 
                is_admin, premium_expires_at, iptv_access, 
                iptv_expires_at, total_watch_time, streams_watched,
                created_at
            `)
            .eq('id', req.user.id)
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch profile' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// TV Channels Routes
app.get('/api/channels', async (req, res) => {
    try {
        const { category, region, premium_only } = req.query;
        
        let query = supabase
            .from('tv_channels')
            .select('*')
            .eq('is_active', true)
            .order('popularity_score', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        if (region) {
            query = query.contains('region_restrictions', [region]);
        }

        if (premium_only === 'true') {
            query = query.eq('is_premium', true);
        }

        const { data: channels, error } = await query;

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch channels' });
        }

        res.json({ channels });
    } catch (error) {
        console.error('Channels fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/channels/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data: channel, error } = await supabase
            .from('tv_channels')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error || !channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        res.json({ channel });
    } catch (error) {
        console.error('Channel fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/channels/:id/stream', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: channel, error } = await supabase
            .from('tv_channels')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error || !channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        // Check access permissions
        if (channel.is_premium && !req.user.is_premium && !req.user.is_admin) {
            return res.status(403).json({ error: 'Premium subscription required' });
        }

        if (channel.coin_cost > 0 && req.user.coins < channel.coin_cost && !req.user.is_admin) {
            return res.status(403).json({ error: 'Insufficient coins' });
        }

        // Deduct coins if required
        if (channel.coin_cost > 0 && !req.user.is_admin) {
            await deductCoins(req.user.id, channel.coin_cost, 'stream', `Watched ${channel.name}`);
        }

        // Log session
        await supabase.from('user_sessions').insert({
            user_id: req.user.id,
            content_type: 'channel',
            content_id: channel.id,
            content_title: channel.name,
            started_at: new Date().toISOString()
        });

        res.json({
            stream_url: channel.primary_stream_url,
            backup_streams: channel.backup_streams,
            stream_quality: channel.stream_quality,
            audio_tracks: channel.audio_tracks
        });
    } catch (error) {
        console.error('Stream access error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Media Content Routes
app.get('/api/content', async (req, res) => {
    try {
        const { type, genre, search, featured, trending, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;

        let query = supabase
            .from('media_content')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (type) {
            query = query.eq('content_type', type);
        }

        if (genre) {
            query = query.contains('genre', [genre]);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        if (featured === 'true') {
            query = query.eq('featured', true);
        }

        if (trending === 'true') {
            query = query.eq('trending', true);
        }

        const { data: content, error } = await query;

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch content' });
        }

        res.json({ content });
    } catch (error) {
        console.error('Content fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Payment Routes
app.post('/api/payments/stripe/create-payment-intent', authenticateToken, async (req, res) => {
    try {
        const { amount, coins } = req.body; // amount in cents

        if (!amount || !coins || amount < 500) { // minimum $5
            return res.status(400).json({ error: 'Invalid payment amount' });
        }

        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: {
                user_id: req.user.id,
                coins: coins.toString()
            }
        });

        res.json({
            client_secret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe payment error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

app.post('/api/payments/crypto/generate-address', authenticateToken, async (req, res) => {
    try {
        const { currency, amount_usd } = req.body;
        
        if (!['BTC', 'ETH', 'USDT'].includes(currency)) {
            return res.status(400).json({ error: 'Unsupported cryptocurrency' });
        }

        // In production, integrate with crypto payment processor
        const address = config.crypto[`${currency.toLowerCase()}_address`];
        
        if (!address) {
            return res.status(500).json({ error: 'Crypto payments temporarily unavailable' });
        }

        // Create pending transaction
        const { data: transaction, error } = await supabase
            .from('transactions')
            .insert({
                user_id: req.user.id,
                type: 'deposit',
                method: 'crypto',
                amount_usd: amount_usd,
                crypto_currency: currency,
                status: 'pending',
                description: `${currency} deposit`,
                expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
            })
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to create transaction' });
        }

        res.json({
            address,
            transaction_id: transaction.id,
            expires_at: transaction.expires_at,
            amount_usd: amount_usd
        });
    } catch (error) {
        console.error('Crypto payment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Routes
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Get dashboard statistics
        const [
            { count: totalUsers },
            { count: activeUsers },
            { count: premiumUsers },
            { count: totalChannels },
            { count: totalContent },
            { data: recentTransactions }
        ] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('users').select('*', { count: 'exact', head: true }).gte('last_active_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_premium', true),
            supabase.from('tv_channels').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('media_content').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(10)
        ]);

        res.json({
            stats: {
                totalUsers,
                activeUsers,
                premiumUsers,
                totalChannels,
                totalContent
            },
            recentTransactions
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 50, search } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('users')
            .select('id, email, username, display_name, coins, is_premium, is_admin, is_active, created_at, last_active_at')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (search) {
            query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,display_name.ilike.%${search}%`);
        }

        const { data: users, error } = await query;

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }

        res.json({ users });
    } catch (error) {
        console.error('Admin users fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Bulldog Stream Backend running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${config.app.frontend_url}`);
});

module.exports = app;
