// Production Database Schema for Bulldog Stream Platform
// SQL Schema for Supabase/PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with complete profile management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Profile Information
    display_name TEXT,
    avatar_url TEXT,
    region TEXT DEFAULT 'US',
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    
    -- Subscription & Access
    premium_expires_at TIMESTAMPTZ,
    iptv_access BOOLEAN DEFAULT false,
    iptv_expires_at TIMESTAMPTZ,
    
    -- Financial
    coins INTEGER DEFAULT 100, -- Welcome bonus
    total_earned_coins INTEGER DEFAULT 100,
    total_spent_coins INTEGER DEFAULT 0,
    
    -- Statistics
    total_watch_time INTEGER DEFAULT 0, -- in minutes
    streams_watched INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TV Channels with multi-stream support
CREATE TABLE tv_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- sports, news, entertainment, kids, etc.
    subcategory TEXT,
    logo_url TEXT,
    banner_url TEXT,
    
    -- Streaming Configuration
    primary_stream_url TEXT NOT NULL,
    backup_streams JSONB, -- Array of backup stream URLs
    stream_quality JSONB, -- HD, SD, mobile quality options
    audio_tracks JSONB, -- Multiple language audio tracks
    
    -- EPG Integration
    epg_source TEXT, -- External EPG data source
    epg_channel_id TEXT, -- Channel ID in EPG system
    
    -- Access Control
    is_premium BOOLEAN DEFAULT false, -- Requires premium subscription
    coin_cost INTEGER DEFAULT 0, -- Cost per hour in coins
    region_restrictions TEXT[], -- Allowed regions
    
    -- Metadata
    country TEXT,
    language TEXT DEFAULT 'en',
    tags TEXT[],
    popularity_score INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_live BOOLEAN DEFAULT false,
    last_checked_at TIMESTAMPTZ,
    
    -- Management
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EPG (Electronic Program Guide) Schedule
CREATE TABLE epg_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES tv_channels(id) ON DELETE CASCADE,
    
    -- Program Information
    program_title TEXT NOT NULL,
    program_description TEXT,
    episode_title TEXT,
    season_number INTEGER,
    episode_number INTEGER,
    
    -- Timing
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration INTEGER, -- in minutes
    
    -- Content Classification
    genre TEXT[],
    rating TEXT, -- G, PG, PG-13, R, etc.
    content_type TEXT, -- movie, series, sports, news, etc.
    
    -- Additional Metadata
    cast_members TEXT[],
    director TEXT,
    year INTEGER,
    original_language TEXT,
    subtitles TEXT[],
    
    -- External IDs
    tmdb_id INTEGER, -- The Movie Database ID
    imdb_id TEXT,
    tvdb_id INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movies and Series Content
CREATE TABLE media_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    title TEXT NOT NULL,
    original_title TEXT,
    description TEXT,
    content_type TEXT NOT NULL, -- movie, series, documentary
    
    -- Media Files
    poster_url TEXT,
    backdrop_url TEXT,
    trailer_url TEXT,
    video_url TEXT, -- Main video stream
    subtitle_files JSONB, -- Multiple subtitle tracks
    
    -- Quality Options
    video_qualities JSONB, -- 4K, 1080p, 720p, 480p streams
    file_size_mb INTEGER,
    duration_minutes INTEGER,
    
    -- Content Classification
    genre TEXT[] NOT NULL,
    rating TEXT, -- Movie rating
    release_date DATE,
    country TEXT,
    language TEXT DEFAULT 'en',
    
    -- Series Information (if applicable)
    total_seasons INTEGER,
    total_episodes INTEGER,
    episode_list JSONB,
    
    -- Access Control
    is_premium BOOLEAN DEFAULT false,
    coin_cost INTEGER DEFAULT 0,
    region_restrictions TEXT[],
    age_restriction INTEGER DEFAULT 0,
    
    -- Engagement Metrics
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    
    -- External Integration
    tmdb_id INTEGER,
    imdb_id TEXT,
    tvdb_id INTEGER,
    
    -- SEO
    slug TEXT UNIQUE,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    
    -- Management
    uploaded_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    trending BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction Details
    type TEXT NOT NULL, -- deposit, withdraw, purchase, refund, referral, survey
    method TEXT, -- stripe, crypto, paypal, internal
    status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
    
    -- Amounts
    amount_coins INTEGER NOT NULL,
    amount_usd DECIMAL(10,2),
    amount_crypto DECIMAL(20,8),
    crypto_currency TEXT, -- BTC, ETH, USDT, etc.
    
    -- External References
    stripe_payment_id TEXT,
    crypto_transaction_hash TEXT,
    external_reference TEXT,
    
    -- Description
    description TEXT,
    metadata JSONB,
    
    -- Processing
    processed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Sessions & Watch History
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content Information
    content_type TEXT NOT NULL, -- channel, movie, series
    content_id UUID NOT NULL,
    content_title TEXT,
    
    -- Session Details
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    
    -- Quality & Performance
    video_quality TEXT,
    buffering_events INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    
    -- Device Information
    device_type TEXT,
    browser TEXT,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral System
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Referral Details
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, completed, expired
    
    -- Rewards
    coins_rewarded INTEGER DEFAULT 0,
    bonus_rewarded INTEGER DEFAULT 0,
    
    -- Tracking
    signup_completed_at TIMESTAMPTZ,
    first_deposit_at TIMESTAMPTZ,
    reward_given_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(referrer_id, referred_id)
);

-- Survey & Offer Completion
CREATE TABLE survey_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Survey Information
    survey_provider TEXT NOT NULL, -- cpagrip, adgem, etc.
    survey_id TEXT NOT NULL,
    survey_title TEXT,
    
    -- Completion Details
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'started', -- started, completed, abandoned, rejected
    
    -- Rewards
    coins_earned INTEGER DEFAULT 0,
    usd_value DECIMAL(10,2),
    
    -- Verification
    verification_status TEXT DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Reviews & Ratings
CREATE TABLE content_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES media_content(id) ON DELETE CASCADE,
    
    -- Review Content
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    
    -- Metadata
    is_spoiler BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT true,
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, content_id)
);

-- Admin Activity Logs
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id),
    
    -- Action Details
    action TEXT NOT NULL, -- create, update, delete, ban, approve, etc.
    entity_type TEXT NOT NULL, -- user, channel, content, transaction
    entity_id UUID,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_premium ON users(is_premium) WHERE is_premium = true;
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

CREATE INDEX idx_channels_category ON tv_channels(category);
CREATE INDEX idx_channels_active ON tv_channels(is_active) WHERE is_active = true;
CREATE INDEX idx_channels_premium ON tv_channels(is_premium);

CREATE INDEX idx_epg_channel_time ON epg_schedule(channel_id, start_time);
CREATE INDEX idx_epg_time_range ON epg_schedule(start_time, end_time);

CREATE INDEX idx_media_type ON media_content(content_type);
CREATE INDEX idx_media_genre ON media_content USING GIN(genre);
CREATE INDEX idx_media_active ON media_content(is_active) WHERE is_active = true;
CREATE INDEX idx_media_premium ON media_content(is_premium);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_content ON user_sessions(content_type, content_id);

-- Create Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON tv_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_epg_updated_at BEFORE UPDATE ON epg_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON survey_completions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Default System Configuration
INSERT INTO system_config (key, value, description) VALUES
('coin_rates', '{"signup_bonus": 100, "referral_reward": 500, "survey_min": 25, "survey_max": 150, "premium_hour": 10, "premium_day": 100, "premium_week": 500, "iptv_month": 1000}', 'Coin earning and spending rates'),
('payment_config', '{"stripe_enabled": true, "crypto_enabled": true, "paypal_enabled": false, "min_deposit": 5, "max_deposit": 1000}', 'Payment system configuration'),
('content_settings', '{"auto_approve_content": false, "max_file_size_mb": 5000, "allowed_formats": ["mp4", "mkv", "avi"], "default_quality": "720p"}', 'Content management settings'),
('app_settings', '{"maintenance_mode": false, "registration_enabled": true, "guest_preview": true, "max_concurrent_streams": 3}', 'Application-wide settings');

-- Insert Sample Data for Development
INSERT INTO users (email, username, password_hash, display_name, is_admin, coins) VALUES
('admin@bulldogstream.com', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeaHGBvFk7cJH1rae', 'System Administrator', true, 10000),
('demo@example.com', 'demouser', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeaHGBvFk7cJH1rae', 'Demo User', false, 500);

INSERT INTO tv_channels (name, description, category, logo_url, primary_stream_url, stream_quality, is_active) VALUES
('ESPN Sports', 'Live sports coverage 24/7', 'sports', 'https://picsum.photos/200/200?random=espn', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '{"hd": "stream_hd.m3u8", "sd": "stream_sd.m3u8", "mobile": "stream_mobile.m3u8"}', true),
('CNN News', 'Breaking news and analysis', 'news', 'https://picsum.photos/200/200?random=cnn', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '{"hd": "stream_hd.m3u8", "sd": "stream_sd.m3u8"}', true),
('Discovery Channel', 'Educational and documentary content', 'documentary', 'https://picsum.photos/200/200?random=discovery', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '{"hd": "stream_hd.m3u8", "sd": "stream_sd.m3u8"}', true);

INSERT INTO media_content (title, description, content_type, genre, poster_url, video_url, duration_minutes, is_active) VALUES
('The Matrix', 'A computer programmer discovers reality is a simulation', 'movie', '{"action", "sci-fi"}', 'https://picsum.photos/400/600?random=matrix', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 136, true),
('Breaking Bad', 'A chemistry teacher becomes a drug manufacturer', 'series', '{"drama", "crime"}', 'https://picsum.photos/400/600?random=breakingbad', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 45, true),
('Planet Earth', 'Nature documentary series', 'documentary', '{"nature", "documentary"}', 'https://picsum.photos/400/600?random=planet', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 50, true);
