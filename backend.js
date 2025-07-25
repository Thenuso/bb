// Backend API Simulation for Bulldog Stream
// This simulates a complete backend with database operations, user management, and automation

class BulldogBackend {
    constructor() {
        this.database = this.initializeDatabase();
        this.seoManager = new SEOManager();
        this.analyticsManager = new AnalyticsManager();
        this.revenueManager = new RevenueManager();
        this.contentManager = new ContentManager();
        this.userManager = new UserManager();
        this.automationEngine = new AutomationEngine();
        
        this.startAutomation();
    }

    initializeDatabase() {
        // Simulate database with localStorage
        const db = {
            users: JSON.parse(localStorage.getItem('bulldog_users') || '[]'),
            content: JSON.parse(localStorage.getItem('bulldog_content') || '[]'),
            analytics: JSON.parse(localStorage.getItem('bulldog_analytics') || '{}'),
            revenue: JSON.parse(localStorage.getItem('bulldog_revenue') || '{}'),
            settings: JSON.parse(localStorage.getItem('bulldog_settings') || '{}'),
            sessions: JSON.parse(localStorage.getItem('bulldog_sessions') || '[]'),
            transactions: JSON.parse(localStorage.getItem('bulldog_transactions') || '[]'),
            surveys: JSON.parse(localStorage.getItem('bulldog_surveys') || '[]'),
            referrals: JSON.parse(localStorage.getItem('bulldog_referrals') || '[]')
        };

        // Initialize with sample data if empty
        if (db.users.length === 0) {
            this.seedDatabase(db);
        }

        return db;
    }

    seedDatabase(db) {
        // Sample users
        db.users = [
            {
                id: 1,
                username: 'john_doe',
                email: 'john@example.com',
                password: 'hashed_password_1',
                tier: 'premium',
                coins: 2450,
                joinDate: '2025-01-15',
                lastActive: new Date().toISOString(),
                profile: {
                    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=B800FF&color=fff',
                    region: 'US',
                    preferences: ['action', 'sci-fi'],
                    watchTime: 12500 // minutes
                },
                subscription: {
                    type: 'premium',
                    expires: '2025-08-15',
                    autoRenew: true
                },
                stats: {
                    totalWatchTime: 12500,
                    streamsWatched: 245,
                    coinsEarned: 3200,
                    coinsSpent: 750,
                    referrals: 3
                }
            },
            {
                id: 2,
                username: 'jane_smith',
                email: 'jane@example.com',
                password: 'hashed_password_2',
                tier: 'free',
                coins: 125,
                joinDate: '2025-01-18',
                lastActive: new Date().toISOString(),
                profile: {
                    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff',
                    region: 'UK',
                    preferences: ['drama', 'comedy'],
                    watchTime: 3400
                },
                subscription: {
                    type: 'free',
                    expires: null,
                    autoRenew: false
                },
                stats: {
                    totalWatchTime: 3400,
                    streamsWatched: 89,
                    coinsEarned: 500,
                    coinsSpent: 375,
                    referrals: 1
                }
            }
        ];

        // Sample content
        db.content = [
            {
                id: 1,
                title: 'Avengers: Endgame',
                type: 'movie',
                genre: ['action', 'sci-fi'],
                status: 'active',
                views: 15420,
                rating: 8.4,
                duration: 181,
                releaseDate: '2019-04-26',
                addedDate: '2025-01-15',
                thumbnail: 'https://picsum.photos/400/600?random=1',
                streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                description: 'The Avengers assemble once more to reverse the damage caused by Thanos.',
                cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
                director: 'Anthony Russo, Joe Russo',
                analytics: {
                    completionRate: 0.87,
                    avgWatchTime: 158,
                    likes: 1250,
                    dislikes: 45,
                    shares: 230
                }
            },
            {
                id: 2,
                title: 'ESPN Live Sports',
                type: 'channel',
                genre: ['sports'],
                status: 'live',
                views: 5678,
                rating: 0,
                duration: 0,
                addedDate: '2025-01-10',
                thumbnail: 'https://picsum.photos/400/300?random=2',
                streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                description: 'Live sports coverage and analysis 24/7',
                schedule: [
                    { time: '09:00', event: 'Morning Sports News' },
                    { time: '12:00', event: 'Live Basketball' },
                    { time: '18:00', event: 'Football Analysis' }
                ],
                analytics: {
                    avgViewers: 2340,
                    peakViewers: 8950,
                    totalViewTime: 45000,
                    engagement: 0.73
                }
            }
        ];

        // Sample analytics
        db.analytics = {
            dailyStats: {
                users: { total: 12458, new: 45, active: 3241 },
                revenue: { total: 3247, premium: 2800, ads: 447 },
                content: { views: 28950, hours: 4521, completion: 0.72 },
                engagement: { likes: 1240, shares: 340, comments: 890 }
            },
            weeklyTrends: {
                userGrowth: [450, 520, 480, 610, 580, 650, 720],
                revenue: [2100, 2400, 2200, 2800, 2600, 2900, 3247],
                watchTime: [3200, 3600, 3400, 4100, 3900, 4300, 4521]
            },
            topContent: [
                { id: 1, title: 'Avengers: Endgame', views: 15420, type: 'movie' },
                { id: 2, title: 'Game of Thrones S1E1', views: 12340, type: 'series' },
                { id: 3, title: 'ESPN Live', views: 8950, type: 'channel' }
            ]
        };

        // Sample revenue data
        db.revenue = {
            today: { total: 3247, premium: 2800, ads: 447, coins: 0 },
            thisMonth: { total: 89432, premium: 72000, ads: 12432, coins: 5000 },
            yearly: { total: 1050000, premium: 850000, ads: 150000, coins: 50000 },
            subscriptions: {
                premium: { count: 2847, revenue: 72000 },
                free: { count: 9611, adRevenue: 12432 }
            },
            coinTransactions: {
                sold: 457000,
                redeemed: 398000,
                profit: 59000
            }
        };

        // Save to localStorage
        this.saveDatabase(db);
    }

    saveDatabase(db = this.database) {
        Object.keys(db).forEach(key => {
            localStorage.setItem(`bulldog_${key}`, JSON.stringify(db[key]));
        });
    }

    startAutomation() {
        // Auto-update analytics every 30 seconds
        setInterval(() => {
            this.analyticsManager.updateRealTimeStats();
        }, 30000);

        // Auto-generate revenue every minute
        setInterval(() => {
            this.revenueManager.generateRevenue();
        }, 60000);

        // Auto-optimize SEO every hour
        setInterval(() => {
            this.seoManager.optimizeContent();
        }, 3600000);

        // Auto-backup database every 10 minutes
        setInterval(() => {
            this.backupDatabase();
        }, 600000);
    }

    backupDatabase() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: this.database
        };
        localStorage.setItem('bulldog_backup', JSON.stringify(backup));
        console.log('Database backup created at', backup.timestamp);
    }

    // API Endpoints Simulation
    api = {
        // User Management
        users: {
            get: (id) => this.userManager.getUser(id),
            getAll: () => this.userManager.getAllUsers(),
            create: (userData) => this.userManager.createUser(userData),
            update: (id, userData) => this.userManager.updateUser(id, userData),
            delete: (id) => this.userManager.deleteUser(id),
            authenticate: (credentials) => this.userManager.authenticate(credentials),
            updateCoins: (id, amount) => this.userManager.updateCoins(id, amount)
        },

        // Content Management
        content: {
            get: (id) => this.contentManager.getContent(id),
            getAll: () => this.contentManager.getAllContent(),
            create: (contentData) => this.contentManager.createContent(contentData),
            update: (id, contentData) => this.contentManager.updateContent(id, contentData),
            delete: (id) => this.contentManager.deleteContent(id),
            search: (query) => this.contentManager.searchContent(query),
            getPopular: () => this.contentManager.getPopularContent()
        },

        // Analytics
        analytics: {
            getDashboard: () => this.analyticsManager.getDashboardData(),
            getUserStats: (id) => this.analyticsManager.getUserStats(id),
            getContentStats: (id) => this.analyticsManager.getContentStats(id),
            getRevenue: () => this.revenueManager.getRevenueData(),
            trackView: (contentId, userId) => this.analyticsManager.trackView(contentId, userId),
            trackEvent: (event, data) => this.analyticsManager.trackEvent(event, data)
        },

        // SEO
        seo: {
            generateMeta: (contentId) => this.seoManager.generateMetaTags(contentId),
            optimizePage: (pageData) => this.seoManager.optimizePage(pageData),
            getSitemap: () => this.seoManager.generateSitemap(),
            getSchema: (contentId) => this.seoManager.generateSchema(contentId)
        }
    };
}

// User Management System
class UserManager {
    constructor(database) {
        this.db = database;
    }

    getUser(id) {
        return this.db.users.find(user => user.id === id);
    }

    getAllUsers() {
        return this.db.users;
    }

    createUser(userData) {
        const newUser = {
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            password: this.hashPassword(userData.password),
            tier: 'free',
            coins: 100, // Welcome bonus
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString(),
            profile: {
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=B800FF&color=fff`,
                region: userData.region || 'US',
                preferences: [],
                watchTime: 0
            },
            subscription: {
                type: 'free',
                expires: null,
                autoRenew: false
            },
            stats: {
                totalWatchTime: 0,
                streamsWatched: 0,
                coinsEarned: 100,
                coinsSpent: 0,
                referrals: 0
            }
        };

        this.db.users.push(newUser);
        this.saveDatabase();
        return newUser;
    }

    updateUser(id, userData) {
        const userIndex = this.db.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.db.users[userIndex] = { ...this.db.users[userIndex], ...userData };
            this.saveDatabase();
            return this.db.users[userIndex];
        }
        return null;
    }

    deleteUser(id) {
        const userIndex = this.db.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.db.users.splice(userIndex, 1);
            this.saveDatabase();
            return true;
        }
        return false;
    }

    authenticate(credentials) {
        const user = this.db.users.find(user => 
            user.email === credentials.email && 
            user.password === this.hashPassword(credentials.password)
        );
        
        if (user) {
            user.lastActive = new Date().toISOString();
            this.saveDatabase();
            return { success: true, user: this.sanitizeUser(user) };
        }
        
        return { success: false, message: 'Invalid credentials' };
    }

    updateCoins(id, amount) {
        const user = this.getUser(id);
        if (user) {
            user.coins += amount;
            if (amount > 0) {
                user.stats.coinsEarned += amount;
            } else {
                user.stats.coinsSpent += Math.abs(amount);
            }
            this.saveDatabase();
            return user.coins;
        }
        return null;
    }

    hashPassword(password) {
        // Simple hash simulation (use proper hashing in production)
        return btoa(password + 'bulldog_salt');
    }

    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    saveDatabase() {
        localStorage.setItem('bulldog_users', JSON.stringify(this.db.users));
    }
}

// Content Management System
class ContentManager {
    constructor(database) {
        this.db = database;
    }

    getContent(id) {
        return this.db.content.find(content => content.id === id);
    }

    getAllContent() {
        return this.db.content;
    }

    createContent(contentData) {
        const newContent = {
            id: Date.now(),
            title: contentData.title,
            type: contentData.type,
            genre: contentData.genre || [],
            status: 'active',
            views: 0,
            rating: 0,
            duration: contentData.duration || 0,
            releaseDate: contentData.releaseDate,
            addedDate: new Date().toISOString().split('T')[0],
            thumbnail: contentData.thumbnail || `https://picsum.photos/400/600?random=${Date.now()}`,
            streamUrl: contentData.streamUrl,
            description: contentData.description,
            analytics: {
                completionRate: 0,
                avgWatchTime: 0,
                likes: 0,
                dislikes: 0,
                shares: 0
            }
        };

        this.db.content.push(newContent);
        this.saveDatabase();
        return newContent;
    }

    updateContent(id, contentData) {
        const contentIndex = this.db.content.findIndex(content => content.id === id);
        if (contentIndex !== -1) {
            this.db.content[contentIndex] = { ...this.db.content[contentIndex], ...contentData };
            this.saveDatabase();
            return this.db.content[contentIndex];
        }
        return null;
    }

    deleteContent(id) {
        const contentIndex = this.db.content.findIndex(content => content.id === id);
        if (contentIndex !== -1) {
            this.db.content.splice(contentIndex, 1);
            this.saveDatabase();
            return true;
        }
        return false;
    }

    searchContent(query) {
        const searchTerm = query.toLowerCase();
        return this.db.content.filter(content => 
            content.title.toLowerCase().includes(searchTerm) ||
            content.description.toLowerCase().includes(searchTerm) ||
            content.genre.some(g => g.toLowerCase().includes(searchTerm))
        );
    }

    getPopularContent() {
        return this.db.content
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
    }

    saveDatabase() {
        localStorage.setItem('bulldog_content', JSON.stringify(this.db.content));
    }
}

// Analytics Manager
class AnalyticsManager {
    constructor(database) {
        this.db = database;
    }

    getDashboardData() {
        return this.db.analytics;
    }

    getUserStats(id) {
        const user = this.db.users.find(user => user.id === id);
        return user ? user.stats : null;
    }

    getContentStats(id) {
        const content = this.db.content.find(content => content.id === id);
        return content ? content.analytics : null;
    }

    trackView(contentId, userId) {
        const content = this.db.content.find(c => c.id === contentId);
        if (content) {
            content.views++;
            content.analytics = content.analytics || {};
            
            // Update daily stats
            this.db.analytics.dailyStats.content.views++;
            
            this.saveDatabase();
        }
    }

    trackEvent(event, data) {
        // Track custom events
        const eventLog = {
            timestamp: new Date().toISOString(),
            event: event,
            data: data
        };
        
        // Store in analytics
        if (!this.db.analytics.events) {
            this.db.analytics.events = [];
        }
        this.db.analytics.events.push(eventLog);
        
        this.saveDatabase();
    }

    updateRealTimeStats() {
        // Simulate real-time updates
        const stats = this.db.analytics.dailyStats;
        
        // Small random updates
        stats.users.active += Math.floor(Math.random() * 10) - 5;
        stats.content.views += Math.floor(Math.random() * 20);
        stats.revenue.total += Math.floor(Math.random() * 50);
        
        this.saveDatabase();
        
        // Broadcast update event
        window.dispatchEvent(new CustomEvent('analyticsUpdate', { detail: stats }));
    }

    saveDatabase() {
        localStorage.setItem('bulldog_analytics', JSON.stringify(this.db.analytics));
    }
}

// Revenue Manager
class RevenueManager {
    constructor(database) {
        this.db = database;
    }

    getRevenueData() {
        return this.db.revenue;
    }

    generateRevenue() {
        // Simulate revenue generation
        const newRevenue = Math.floor(Math.random() * 20) + 5;
        this.db.revenue.today.total += newRevenue;
        this.db.revenue.thisMonth.total += newRevenue;
        
        // Randomly assign to different sources
        const source = Math.random();
        if (source < 0.7) {
            this.db.revenue.today.premium += newRevenue;
            this.db.revenue.thisMonth.premium += newRevenue;
        } else {
            this.db.revenue.today.ads += newRevenue;
            this.db.revenue.thisMonth.ads += newRevenue;
        }
        
        this.saveDatabase();
        
        // Broadcast revenue update
        window.dispatchEvent(new CustomEvent('revenueUpdate', { detail: this.db.revenue }));
    }

    processPayment(userId, amount, type) {
        // Simulate payment processing
        const user = this.db.users.find(u => u.id === userId);
        if (user && type === 'coin_purchase') {
            const coins = amount * 10; // $1 = 10 coins
            user.coins += coins;
            user.stats.coinsEarned += coins;
            
            // Add to revenue
            this.db.revenue.today.coins += amount;
            this.db.revenue.thisMonth.coins += amount;
            
            this.saveDatabase();
            return { success: true, coins: user.coins };
        }
        
        return { success: false, message: 'Payment failed' };
    }

    saveDatabase() {
        localStorage.setItem('bulldog_revenue', JSON.stringify(this.db.revenue));
    }
}

// SEO Manager with Auto-optimization
class SEOManager {
    constructor() {
        this.keywords = ['streaming', 'movies', 'tv shows', 'live tv', 'entertainment', 'watch online', 'free streaming', 'premium content'];
        this.autoOptimize = true;
    }

    generateMetaTags(contentId) {
        const content = window.bulldog?.api.content.get(contentId);
        if (!content) return null;

        const title = `${content.title} - Watch Online on Bulldog Stream`;
        const description = this.optimizeDescription(content.description, content.title);
        const keywords = [...content.genre, ...this.keywords].join(', ');

        return {
            title: title,
            description: description,
            keywords: keywords,
            ogTitle: title,
            ogDescription: description,
            ogImage: content.thumbnail,
            ogType: content.type === 'movie' ? 'video.movie' : 'video.tv_show',
            twitterCard: 'summary_large_image',
            canonical: `/watch/${content.id}`,
            schema: this.generateSchema(content)
        };
    }

    generateSchema(content) {
        const baseSchema = {
            "@context": "https://schema.org",
            "@type": content.type === 'movie' ? 'Movie' : 'TVSeries',
            "name": content.title,
            "description": content.description,
            "image": content.thumbnail,
            "datePublished": content.releaseDate,
            "genre": content.genre,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": content.rating,
                "ratingCount": content.views
            }
        };

        if (content.type === 'movie' && content.duration) {
            baseSchema.duration = `PT${content.duration}M`;
        }

        return JSON.stringify(baseSchema);
    }

    optimizeDescription(description, title) {
        // Auto-optimize description for SEO
        const optimized = description.length > 160 ? 
            description.substring(0, 157) + '...' : 
            description;
        
        return `${optimized} Stream ${title} free on Bulldog Stream - the best streaming platform.`;
    }

    generateSitemap() {
        const content = window.bulldog?.api.content.getAll() || [];
        const sitemap = {
            pages: [
                { url: '/', priority: 1.0, changefreq: 'daily' },
                { url: '/tv', priority: 0.9, changefreq: 'daily' },
                { url: '/movies', priority: 0.9, changefreq: 'daily' },
                { url: '/series', priority: 0.9, changefreq: 'daily' },
                { url: '/community', priority: 0.7, changefreq: 'weekly' }
            ],
            content: content.map(item => ({
                url: `/watch/${item.id}`,
                priority: 0.8,
                changefreq: 'weekly',
                lastmod: item.addedDate
            }))
        };

        return sitemap;
    }

    optimizeContent() {
        if (!this.autoOptimize) return;

        const content = window.bulldog?.api.content.getAll() || [];
        
        content.forEach(item => {
            // Auto-generate optimized titles and descriptions
            if (!item.seoTitle) {
                item.seoTitle = this.generateMetaTags(item.id).title;
            }
            
            if (!item.seoDescription) {
                item.seoDescription = this.generateMetaTags(item.id).description;
            }
            
            // Auto-tag content
            if (!item.autoTags) {
                item.autoTags = this.generateAutoTags(item);
            }
        });

        console.log('SEO auto-optimization completed for', content.length, 'items');
    }

    generateAutoTags(content) {
        const tags = [];
        
        // Genre-based tags
        content.genre.forEach(genre => {
            tags.push(`${genre} ${content.type}`);
            tags.push(`best ${genre} ${content.type}s`);
        });
        
        // Type-based tags
        if (content.type === 'movie') {
            tags.push('full movie', 'watch movie online', 'movie streaming');
        } else if (content.type === 'series') {
            tags.push('tv series', 'watch series online', 'binge watch');
        }
        
        return tags;
    }

    injectSEOTags(pageType, contentId = null) {
        // Dynamically inject SEO tags into page head
        const head = document.head;
        
        // Remove existing SEO tags
        head.querySelectorAll('[data-seo]').forEach(tag => tag.remove());
        
        let seoData;
        if (contentId) {
            seoData = this.generateMetaTags(contentId);
        } else {
            seoData = this.getPageSEO(pageType);
        }
        
        if (!seoData) return;
        
        // Inject new tags
        Object.keys(seoData).forEach(key => {
            const tag = this.createSEOTag(key, seoData[key]);
            if (tag) {
                tag.setAttribute('data-seo', 'true');
                head.appendChild(tag);
            }
        });
    }

    createSEOTag(type, content) {
        let tag;
        
        switch (type) {
            case 'title':
                tag = document.createElement('title');
                tag.textContent = content;
                break;
            case 'description':
                tag = document.createElement('meta');
                tag.setAttribute('name', 'description');
                tag.setAttribute('content', content);
                break;
            case 'keywords':
                tag = document.createElement('meta');
                tag.setAttribute('name', 'keywords');
                tag.setAttribute('content', content);
                break;
            case 'ogTitle':
                tag = document.createElement('meta');
                tag.setAttribute('property', 'og:title');
                tag.setAttribute('content', content);
                break;
            case 'ogDescription':
                tag = document.createElement('meta');
                tag.setAttribute('property', 'og:description');
                tag.setAttribute('content', content);
                break;
            case 'schema':
                tag = document.createElement('script');
                tag.setAttribute('type', 'application/ld+json');
                tag.textContent = content;
                break;
            default:
                return null;
        }
        
        return tag;
    }

    getPageSEO(pageType) {
        const seoData = {
            home: {
                title: 'Bulldog Stream - Free Movies, TV Shows & Live Streaming',
                description: 'Watch free movies, TV shows, and live streams on Bulldog Stream. Premium ad-free experience available. Join thousands of users streaming their favorite content.',
                keywords: 'free streaming, movies, tv shows, live tv, entertainment, bulldog stream'
            },
            tv: {
                title: 'Live TV Channels & Sports - Bulldog Stream',
                description: 'Watch live TV channels, sports, news, and more. Stream your favorite live content with EPG guide and multiple quality options.',
                keywords: 'live tv, sports streaming, news channels, live streaming, tv guide'
            },
            movies: {
                title: 'Free Movies Online - Watch HD Movies | Bulldog Stream',
                description: 'Stream thousands of movies online for free. Action, comedy, drama, sci-fi and more. HD quality streaming with no downloads required.',
                keywords: 'free movies, watch movies online, hd movies, streaming movies'
            }
        };
        
        return seoData[pageType] || seoData.home;
    }
}

// Automation Engine
class AutomationEngine {
    constructor() {
        this.tasks = [];
        this.intervals = new Map();
        this.setupAutomation();
    }

    setupAutomation() {
        // Auto-content optimization
        this.addTask('contentOptimization', () => {
            console.log('Running automated content optimization...');
            // Auto-tag new content, optimize thumbnails, etc.
        }, 3600000); // Every hour

        // Auto-user engagement
        this.addTask('userEngagement', () => {
            console.log('Running automated user engagement...');
            // Send notifications, recommendations, etc.
        }, 1800000); // Every 30 minutes

        // Auto-revenue optimization
        this.addTask('revenueOptimization', () => {
            console.log('Running automated revenue optimization...');
            // Adjust pricing, optimize ad placement, etc.
        }, 7200000); // Every 2 hours

        // Auto-database cleanup
        this.addTask('databaseCleanup', () => {
            console.log('Running automated database cleanup...');
            this.cleanupDatabase();
        }, 86400000); // Every 24 hours

        // Auto-SEO updates
        this.addTask('seoUpdates', () => {
            console.log('Running automated SEO updates...');
            window.bulldog?.seoManager.optimizeContent();
        }, 21600000); // Every 6 hours
    }

    addTask(name, task, interval) {
        this.tasks.push({ name, task, interval });
        const intervalId = setInterval(task, interval);
        this.intervals.set(name, intervalId);
    }

    stopTask(name) {
        const intervalId = this.intervals.get(name);
        if (intervalId) {
            clearInterval(intervalId);
            this.intervals.delete(name);
        }
    }

    cleanupDatabase() {
        // Remove old sessions, clean up orphaned data, optimize storage
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days ago

        // Clean old analytics events
        if (window.bulldog?.database.analytics.events) {
            window.bulldog.database.analytics.events = window.bulldog.database.analytics.events
                .filter(event => new Date(event.timestamp) > cutoffDate);
        }

        // Clean old sessions
        window.bulldog.database.sessions = window.bulldog.database.sessions
            .filter(session => new Date(session.timestamp) > cutoffDate);

        // Update database
        window.bulldog.saveDatabase();
        console.log('Database cleanup completed');
    }

    getStatus() {
        return {
            activeTasks: this.tasks.length,
            runningIntervals: this.intervals.size,
            tasks: this.tasks.map(task => ({
                name: task.name,
                interval: task.interval,
                nextRun: 'calculating...'
            }))
        };
    }
}

// Initialize the backend when the script loads
document.addEventListener('DOMContentLoaded', function() {
    window.bulldog = new BulldogBackend();
    
    // Expose API for frontend use
    window.BulldogAPI = window.bulldog.api;
    
    console.log('Bulldog Stream Backend initialized');
    console.log('Available APIs:', Object.keys(window.bulldog.api));
    
    // Auto-inject SEO for current page
    const currentPage = window.location.pathname.split('/').pop().replace('.htm', '') || 'home';
    window.bulldog.seoManager.injectSEOTags(currentPage);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BulldogBackend, UserManager, ContentManager, AnalyticsManager, RevenueManager, SEOManager, AutomationEngine };
}
