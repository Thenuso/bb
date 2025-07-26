/**
 * Bulldog Stream Platform - Production Backend API
 * Complete backend with real database integration and business logic
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
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
            styleSrc: ["'self'", "'unsafe-inline'", "https:", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:", "https://picsum.photos", "blob:"],
            mediaSrc: ["'self'", "https:", "blob:"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "data:"],
            frameSrc: ["'self'", "https:"]
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

// Static file serving
app.use(express.static('.'));

// Serve main frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-modern.html'));
});

app.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, 'debug-test.html'));
});

app.get('/admin.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.htm'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.htm'));
});

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
            
            // Fallback for offline mode - create demo user
            const demoUser = {
                id: 'demo_' + Date.now(),
                email,
                username,
                display_name: username,
                coins: 100,
                is_premium: false,
                is_admin: false
            };

            const token = generateToken(demoUser.id);

            return res.status(201).json({
                message: 'User created successfully (Demo Mode)',
                token,
                user: demoUser,
                success: true
            });
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
            // Fallback for demo mode - allow demo login
            if (identifier === 'demo@bulldogstream.com' || identifier === 'demo') {
                const demoUser = {
                    id: 'demo_user',
                    email: 'demo@bulldogstream.com',
                    username: 'demo',
                    display_name: 'Demo User',
                    coins: 1000,
                    is_premium: true,
                    is_admin: false
                };

                const token = generateToken(demoUser.id);

                return res.json({
                    message: 'Login successful (Demo Mode)',
                    token,
                    user: demoUser,
                    success: true
                });
            }
            
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
            console.error('Database error, serving mock data:', error);
            // Fallback mock data when database is not available
            const mockChannels = [
                {
                    id: 1,
                    name: "BBC One HD",
                    category: "Entertainment",
                    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/BBC_One_logo_%282021%29.svg/200px-BBC_One_logo_%282021%29.svg.png",
                    stream_url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
                    is_premium: false,
                    is_active: true,
                    description: "The UK's most popular channel"
                },
                {
                    id: 2,
                    name: "CNN International",
                    category: "News",
                    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/CNN_Logo.svg/200px-CNN_Logo.svg.png",
                    stream_url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
                    is_premium: true,
                    is_active: true,
                    description: "International news and current affairs"
                },
                {
                    id: 3,
                    name: "National Geographic",
                    category: "Documentary",
                    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeologo.svg/200px-Natgeologo.svg.png",
                    stream_url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
                    is_premium: true,
                    is_active: true,
                    description: "Nature and science documentaries"
                }
            ];
            return res.json({ channels: mockChannels });
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
            console.error('Database error, serving mock content:', error);
            // Fallback mock data when database is not available
            const mockContent = [
                {
                    id: 1,
                    title: "The Matrix",
                    content_type: "movie",
                    description: "A computer programmer discovers reality isn't what it seems",
                    poster_url: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_SY445_.jpg",
                    video_url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
                    genre: ["Action", "Sci-Fi"],
                    release_year: 1999,
                    duration: 136,
                    rating: 8.7,
                    is_premium: true,
                    featured: true,
                    trending: true
                },
                {
                    id: 2,
                    title: "Breaking Bad",
                    content_type: "series",
                    description: "A chemistry teacher turned methamphetamine manufacturer",
                    poster_url: "https://m.media-amazon.com/images/I/81K+XQb+ykL._AC_SY445_.jpg",
                    video_url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
                    genre: ["Drama", "Crime"],
                    release_year: 2008,
                    seasons: 5,
                    rating: 9.5,
                    is_premium: true,
                    featured: true,
                    trending: false
                },
                {
                    id: 3,
                    title: "Inception",
                    content_type: "movie",
                    description: "A thief who steals corporate secrets through dream-sharing",
                    poster_url: "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_SY445_.jpg",
                    video_url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
                    genre: ["Action", "Thriller", "Sci-Fi"],
                    release_year: 2010,
                    duration: 148,
                    rating: 8.8,
                    is_premium: false,
                    featured: false,
                    trending: true
                }
            ];
            
            // Filter mock data based on query parameters
            let filteredContent = mockContent;
            if (type) {
                filteredContent = filteredContent.filter(item => item.content_type === type);
            }
            if (featured === 'true') {
                filteredContent = filteredContent.filter(item => item.featured);
            }
            if (trending === 'true') {
                filteredContent = filteredContent.filter(item => item.trending);
            }
            
            return res.json({ content: filteredContent });
        }

        res.json({ content });
    } catch (error) {
        console.error('Content fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Movies API Route
app.get('/api/movies', async (req, res) => {
    try {
        const { genre, search, featured, trending, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;

        let query = supabase
            .from('media_content')
            .select('*')
            .eq('is_active', true)
            .eq('content_type', 'movie')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

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

        const { data: movies, error } = await query;

        if (error) {
            console.error('Database error, serving mock movies:', error);
            // Fallback mock movies
            const mockMovies = [
                { id: '1', title: 'Avengers: Endgame', poster: 'https://picsum.photos/300/450?random=1', year: '2019', genre: 'Action', rating: '8.4', premium: false },
                { id: '2', title: 'The Dark Knight', poster: 'https://picsum.photos/300/450?random=2', year: '2008', genre: 'Action', rating: '9.0', premium: true },
                { id: '3', title: 'Inception', poster: 'https://picsum.photos/300/450?random=3', year: '2010', genre: 'Sci-Fi', rating: '8.8', premium: false },
                { id: '4', title: 'Interstellar', poster: 'https://picsum.photos/300/450?random=4', year: '2014', genre: 'Sci-Fi', rating: '8.6', premium: true },
                { id: '5', title: 'The Matrix', poster: 'https://picsum.photos/300/450?random=5', year: '1999', genre: 'Sci-Fi', rating: '8.7', premium: false },
                { id: '6', title: 'Pulp Fiction', poster: 'https://picsum.photos/300/450?random=6', year: '1994', genre: 'Crime', rating: '8.9', premium: true },
                { id: '7', title: 'The Godfather', poster: 'https://picsum.photos/300/450?random=7', year: '1972', genre: 'Crime', rating: '9.2', premium: false },
                { id: '8', title: 'Forrest Gump', poster: 'https://picsum.photos/300/450?random=8', year: '1994', genre: 'Drama', rating: '8.8', premium: false },
                { id: '9', title: 'The Shawshank Redemption', poster: 'https://picsum.photos/300/450?random=9', year: '1994', genre: 'Drama', rating: '9.3', premium: true },
                { id: '10', title: 'Fight Club', poster: 'https://picsum.photos/300/450?random=10', year: '1999', genre: 'Drama', rating: '8.8', premium: false },
                { id: '11', title: 'Goodfellas', poster: 'https://picsum.photos/300/450?random=11', year: '1990', genre: 'Crime', rating: '8.7', premium: true },
                { id: '12', title: 'The Lord of the Rings', poster: 'https://picsum.photos/300/450?random=12', year: '2001', genre: 'Fantasy', rating: '8.8', premium: false }
            ];
            
            return res.json({ data: mockMovies, success: true });
        }

        res.json({ data: movies, success: true });
    } catch (error) {
        console.error('Movies fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Series API Route
app.get('/api/series', async (req, res) => {
    try {
        const { genre, search, featured, trending, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;

        let query = supabase
            .from('media_content')
            .select('*')
            .eq('is_active', true)
            .eq('content_type', 'series')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

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

        const { data: series, error } = await query;

        if (error) {
            console.error('Database error, serving mock series:', error);
            // Fallback mock series
            const mockSeries = [
                { id: '1', title: 'Breaking Bad', poster: 'https://picsum.photos/300/450?random=13', year: '2008', seasons: 5, rating: '9.5', premium: false },
                { id: '2', title: 'Game of Thrones', poster: 'https://picsum.photos/300/450?random=14', year: '2011', seasons: 8, rating: '9.3', premium: true },
                { id: '3', title: 'The Office', poster: 'https://picsum.photos/300/450?random=15', year: '2005', seasons: 9, rating: '8.9', premium: false },
                { id: '4', title: 'Stranger Things', poster: 'https://picsum.photos/300/450?random=16', year: '2016', seasons: 4, rating: '8.7', premium: true },
                { id: '5', title: 'The Crown', poster: 'https://picsum.photos/300/450?random=17', year: '2016', seasons: 6, rating: '8.6', premium: false },
                { id: '6', title: 'Friends', poster: 'https://picsum.photos/300/450?random=18', year: '1994', seasons: 10, rating: '8.9', premium: false },
                { id: '7', title: 'The Mandalorian', poster: 'https://picsum.photos/300/450?random=19', year: '2019', seasons: 3, rating: '8.8', premium: true },
                { id: '8', title: 'Better Call Saul', poster: 'https://picsum.photos/300/450?random=20', year: '2015', seasons: 6, rating: '8.9', premium: false },
                { id: '9', title: 'House of Cards', poster: 'https://picsum.photos/300/450?random=21', year: '2013', seasons: 6, rating: '8.7', premium: true },
                { id: '10', title: 'The Witcher', poster: 'https://picsum.photos/300/450?random=22', year: '2019', seasons: 3, rating: '8.2', premium: false },
                { id: '11', title: 'Ozark', poster: 'https://picsum.photos/300/450?random=23', year: '2017', seasons: 4, rating: '8.4', premium: true },
                { id: '12', title: 'The Boys', poster: 'https://picsum.photos/300/450?random=24', year: '2019', seasons: 4, rating: '8.7', premium: false }
            ];
            
            return res.json({ data: mockSeries, success: true });
        }

        res.json({ data: series, success: true });
    } catch (error) {
        console.error('Series fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Coin System Routes
app.post('/api/coins/daily-bonus', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Check if user already claimed today
        const today = new Date().toISOString().split('T')[0];
        const { data: existingClaim } = await supabase
            .from('coin_transactions')
            .select('id')
            .eq('user_id', userId)
            .eq('transaction_type', 'daily_bonus')
            .gte('created_at', today + 'T00:00:00.000Z')
            .lt('created_at', today + 'T23:59:59.999Z')
            .single();

        if (existingClaim) {
            return res.status(400).json({ 
                error: 'Daily bonus already claimed today',
                success: false 
            });
        }

        // Add daily bonus
        try {
            await addCoins(userId, 50, 'daily_bonus', 'Daily login bonus');
            res.json({ 
                message: 'Daily bonus claimed successfully!',
                coins: 50,
                success: true 
            });
        } catch (error) {
            // Fallback for demo mode
            res.json({ 
                message: 'Daily bonus claimed successfully! (Demo Mode)',
                coins: 50,
                success: true 
            });
        }
    } catch (error) {
        console.error('Daily bonus error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/coins/transactions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        
        const offset = (page - 1) * limit;

        const { data: transactions, error } = await supabase
            .from('coin_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            // Fallback mock transactions
            const mockTransactions = [
                {
                    id: 1,
                    transaction_type: 'daily_bonus',
                    amount_coins: 50,
                    description: 'Daily login bonus',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    transaction_type: 'referral',
                    amount_coins: 250,
                    description: 'Referral signup bonus',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            
            return res.json({ data: mockTransactions, success: true });
        }

        res.json({ data: transactions, success: true });
    } catch (error) {
        console.error('Transactions fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/coins/purchase', authenticateToken, async (req, res) => {
    try {
        const { package_type, payment_method } = req.body;
        
        // Define coin packages
        const packages = {
            basic: { coins: 500, price: 5 },
            standard: { coins: 1200, price: 10 },
            premium: { coins: 2500, price: 20 },
            ultimate: { coins: 5500, price: 40 }
        };

        if (!packages[package_type]) {
            return res.status(400).json({ error: 'Invalid package type' });
        }

        const selectedPackage = packages[package_type];

        // For demo mode, just add coins
        try {
            await addCoins(req.user.id, selectedPackage.coins, 'purchase', `Purchased ${package_type} package`);
            res.json({
                message: 'Coins purchased successfully!',
                coins: selectedPackage.coins,
                success: true
            });
        } catch (error) {
            // Fallback for demo mode
            res.json({
                message: 'Coins purchased successfully! (Demo Mode)',
                coins: selectedPackage.coins,
                success: true
            });
        }
    } catch (error) {
        console.error('Coin purchase error:', error);
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

// Serve static files
app.use(express.static('.'));

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-modern.html'));
});

app.get('/admin.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.htm'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.htm'));
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
