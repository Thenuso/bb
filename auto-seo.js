// Advanced SEO Automation System for Bulldog Stream
// Provides automatic SEO optimization, meta tag injection, sitemap generation, and schema markup

class AdvancedSEOAutomation {
    constructor() {
        this.config = {
            siteName: 'Bulldog Stream',
            baseUrl: window.location.origin,
            defaultImage: 'https://picsum.photos/1200/630?random=seo',
            keywords: [
                'streaming platform', 'live tv', 'movies online', 'tv shows',
                'free streaming', 'premium content', 'watch online', 'entertainment',
                'bulldog stream', 'video streaming', 'on-demand', 'live channels'
            ],
            languages: ['en', 'es', 'fr', 'de', 'pt'],
            contentTypes: {
                movie: 'Movie',
                series: 'TVSeries',
                channel: 'VideoObject',
                live: 'BroadcastEvent'
            }
        };
        
        this.metaCache = new Map();
        this.schemaCache = new Map();
        this.sitemapCache = null;
        this.lastUpdate = Date.now();
        
        this.initializeAutoSEO();
    }

    initializeAutoSEO() {
        // Auto-inject SEO for current page
        this.injectPageSEO();
        
        // Monitor content changes for dynamic SEO updates
        this.observeContentChanges();
        
        // Setup automatic sitemap updates
        this.scheduleUpdates();
        
        // Initialize performance monitoring
        this.initializePerformanceTracking();
        
        console.log('🚀 Advanced SEO Automation System initialized');
    }

    // === AUTOMATIC META TAG INJECTION ===
    injectPageSEO() {
        const pageType = this.detectPageType();
        const contentId = this.getContentId();
        
        if (contentId) {
            this.injectContentSEO(contentId);
        } else {
            this.injectPageTypeSEO(pageType);
        }
        
        // Always inject structured data
        this.injectOrganizationSchema();
        this.injectWebsiteSchema();
    }

    detectPageType() {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        
        if (path.includes('admin')) return 'admin';
        if (hash.includes('tv') || hash.includes('live')) return 'tv';
        if (hash.includes('movie')) return 'movies';
        if (hash.includes('series')) return 'series';
        if (hash.includes('community')) return 'community';
        if (hash.includes('settings')) return 'settings';
        
        return 'home';
    }

    getContentId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || urlParams.get('content') || null;
    }

    injectContentSEO(contentId) {
        const content = this.getContentData(contentId);
        if (!content) return;

        const seoData = this.generateContentSEO(content);
        this.injectMetaTags(seoData);
        this.injectStructuredData(content);
    }

    injectPageTypeSEO(pageType) {
        const seoData = this.getPageSEOData(pageType);
        this.injectMetaTags(seoData);
    }

    generateContentSEO(content) {
        const title = `${content.title} - Watch ${content.type === 'movie' ? 'Movie' : 'Series'} Online | ${this.config.siteName}`;
        const description = this.optimizeDescription(content.description || content.title, content);
        const keywords = this.generateContentKeywords(content);
        const image = content.thumbnail || this.config.defaultImage;
        const url = `${this.config.baseUrl}/watch?id=${content.id}`;

        return {
            title,
            description,
            keywords: keywords.join(', '),
            image,
            url,
            type: 'video.' + (content.type === 'movie' ? 'movie' : 'tv_show'),
            publishedTime: content.releaseDate,
            modifiedTime: content.addedDate,
            section: content.genre?.[0] || 'Entertainment',
            tags: content.genre || [],
            locale: 'en_US',
            siteName: this.config.siteName
        };
    }

    getPageSEOData(pageType) {
        const seoData = {
            home: {
                title: `${this.config.siteName} - Free Movies, TV Shows & Live Streaming Platform`,
                description: `Watch thousands of movies, TV shows, and live channels for free on ${this.config.siteName}. Premium ad-free experience available. Stream your favorite content in HD quality.`,
                keywords: 'free streaming, movies online, tv shows, live tv, entertainment platform, watch free movies',
                image: this.config.defaultImage,
                type: 'website'
            },
            tv: {
                title: `Live TV Channels & Sports Streaming - ${this.config.siteName}`,
                description: `Stream live TV channels, sports, news, and entertainment 24/7. Access EPG guide, multiple video qualities, and premium channels on ${this.config.siteName}.`,
                keywords: 'live tv, sports streaming, news channels, live streaming, tv guide, epg',
                image: this.config.defaultImage,
                type: 'website'
            },
            movies: {
                title: `Free Movies Online - HD Movie Streaming | ${this.config.siteName}`,
                description: `Discover and stream thousands of movies online for free. Action, comedy, drama, sci-fi, horror and more genres. HD quality streaming with no downloads required.`,
                keywords: 'free movies, watch movies online, hd movies, streaming movies, movie collection',
                image: this.config.defaultImage,
                type: 'website'
            },
            series: {
                title: `TV Series & Shows Online - Binge Watch | ${this.config.siteName}`,
                description: `Binge-watch your favorite TV series and shows online. Complete seasons, latest episodes, and exclusive content available for streaming.`,
                keywords: 'tv series, tv shows, binge watch, episodes online, streaming series',
                image: this.config.defaultImage,
                type: 'website'
            },
            community: {
                title: `Community Hub - Connect with Streamers | ${this.config.siteName}`,
                description: `Join the ${this.config.siteName} community. Share reviews, discuss shows, earn rewards, and connect with fellow streaming enthusiasts.`,
                keywords: 'streaming community, reviews, discussions, social streaming, entertainment community',
                image: this.config.defaultImage,
                type: 'website'
            }
        };

        return seoData[pageType] || seoData.home;
    }

    injectMetaTags(seoData) {
        // Remove existing SEO meta tags
        document.querySelectorAll('meta[data-auto-seo]').forEach(tag => tag.remove());
        document.querySelectorAll('title[data-auto-seo]').forEach(tag => tag.remove());

        const head = document.head;

        // Basic Meta Tags
        this.createMetaTag('title', seoData.title, true);
        this.createMetaTag('description', seoData.description);
        this.createMetaTag('keywords', seoData.keywords);
        this.createMetaTag('author', this.config.siteName);
        this.createMetaTag('robots', 'index, follow, max-image-preview:large');
        this.createMetaTag('googlebot', 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1');

        // Open Graph Meta Tags
        this.createMetaTag('og:title', seoData.title, false, 'property');
        this.createMetaTag('og:description', seoData.description, false, 'property');
        this.createMetaTag('og:image', seoData.image, false, 'property');
        this.createMetaTag('og:url', seoData.url || window.location.href, false, 'property');
        this.createMetaTag('og:type', seoData.type || 'website', false, 'property');
        this.createMetaTag('og:site_name', this.config.siteName, false, 'property');
        this.createMetaTag('og:locale', seoData.locale || 'en_US', false, 'property');

        // Twitter Card Meta Tags
        this.createMetaTag('twitter:card', 'summary_large_image', false, 'name');
        this.createMetaTag('twitter:title', seoData.title, false, 'name');
        this.createMetaTag('twitter:description', seoData.description, false, 'name');
        this.createMetaTag('twitter:image', seoData.image, false, 'name');
        this.createMetaTag('twitter:site', '@bulldogstream', false, 'name');

        // Additional Meta Tags
        if (seoData.publishedTime) {
            this.createMetaTag('article:published_time', seoData.publishedTime, false, 'property');
        }
        if (seoData.modifiedTime) {
            this.createMetaTag('article:modified_time', seoData.modifiedTime, false, 'property');
        }
        if (seoData.section) {
            this.createMetaTag('article:section', seoData.section, false, 'property');
        }
        if (seoData.tags && seoData.tags.length > 0) {
            seoData.tags.forEach(tag => {
                this.createMetaTag('article:tag', tag, false, 'property');
            });
        }

        // Canonical Link
        this.createCanonicalLink(seoData.url || window.location.href);

        // Cache the meta data
        this.metaCache.set(window.location.pathname + window.location.search, seoData);
    }

    createMetaTag(name, content, isTitle = false, attribute = 'name') {
        if (!content) return;

        let tag;
        if (isTitle) {
            tag = document.createElement('title');
            tag.textContent = content;
        } else {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            tag.setAttribute('content', content);
        }
        
        tag.setAttribute('data-auto-seo', 'true');
        document.head.appendChild(tag);
    }

    createCanonicalLink(url) {
        // Remove existing canonical link
        const existingCanonical = document.querySelector('link[rel="canonical"][data-auto-seo]');
        if (existingCanonical) {
            existingCanonical.remove();
        }

        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);
        link.setAttribute('data-auto-seo', 'true');
        document.head.appendChild(link);
    }

    // === STRUCTURED DATA / SCHEMA MARKUP ===
    injectStructuredData(content) {
        if (!content) return;

        const schema = this.generateContentSchema(content);
        this.injectSchema(schema, `content-${content.id}`);
    }

    generateContentSchema(content) {
        const baseSchema = {
            "@context": "https://schema.org",
            "@type": this.config.contentTypes[content.type] || "VideoObject",
            "name": content.title,
            "description": content.description,
            "url": `${this.config.baseUrl}/watch?id=${content.id}`,
            "image": content.thumbnail,
            "thumbnailUrl": content.thumbnail,
            "uploadDate": content.addedDate,
            "duration": content.duration ? `PT${content.duration}M` : undefined,
            "genre": content.genre,
            "contentRating": content.rating ? `${content.rating}/10` : undefined,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": content.rating || 0,
                "ratingCount": content.views || 0,
                "bestRating": 10,
                "worstRating": 0
            },
            "interactionStatistic": {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/WatchAction",
                "userInteractionCount": content.views || 0
            },
            "provider": {
                "@type": "Organization",
                "name": this.config.siteName,
                "url": this.config.baseUrl
            }
        };

        // Add specific properties based on content type
        if (content.type === 'movie' && content.releaseDate) {
            baseSchema.datePublished = content.releaseDate;
            baseSchema.productionCompany = {
                "@type": "Organization",
                "name": "Various Studios"
            };
        }

        if (content.type === 'series') {
            baseSchema.numberOfEpisodes = content.episodes || 1;
            baseSchema.numberOfSeasons = content.seasons || 1;
        }

        if (content.cast) {
            baseSchema.actor = content.cast.map(actor => ({
                "@type": "Person",
                "name": actor
            }));
        }

        if (content.director) {
            baseSchema.director = {
                "@type": "Person",
                "name": content.director
            };
        }

        return baseSchema;
    }

    injectOrganizationSchema() {
        const organizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": this.config.siteName,
            "url": this.config.baseUrl,
            "logo": `${this.config.baseUrl}/icon-512.png`,
            "description": "Premium streaming platform for movies, TV shows, and live channels",
            "sameAs": [
                "https://twitter.com/bulldogstream",
                "https://facebook.com/bulldogstream",
                "https://instagram.com/bulldogstream"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@bulldogstream.com"
            }
        };

        this.injectSchema(organizationSchema, 'organization');
    }

    injectWebsiteSchema() {
        const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": this.config.siteName,
            "url": this.config.baseUrl,
            "description": "Stream movies, TV shows, and live channels online",
            "publisher": {
                "@type": "Organization",
                "name": this.config.siteName
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${this.config.baseUrl}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };

        this.injectSchema(websiteSchema, 'website');
    }

    injectSchema(schema, id) {
        // Remove existing schema with same ID
        const existingSchema = document.querySelector(`script[data-schema-id="${id}"]`);
        if (existingSchema) {
            existingSchema.remove();
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-schema-id', id);
        script.setAttribute('data-auto-seo', 'true');
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);

        // Cache the schema
        this.schemaCache.set(id, schema);
    }

    // === SITEMAP GENERATION ===
    generateSitemap() {
        const sitemap = {
            version: '1.0',
            generated: new Date().toISOString(),
            urls: []
        };

        // Static pages
        const staticPages = [
            { url: '/', priority: 1.0, changefreq: 'daily' },
            { url: '/home.htm', priority: 1.0, changefreq: 'daily' },
            { url: '/home.htm#tv', priority: 0.9, changefreq: 'daily' },
            { url: '/home.htm#movies', priority: 0.9, changefreq: 'daily' },
            { url: '/home.htm#series', priority: 0.9, changefreq: 'daily' },
            { url: '/home.htm#community', priority: 0.7, changefreq: 'weekly' }
        ];

        sitemap.urls.push(...staticPages);

        // Dynamic content pages
        try {
            const content = window.BulldogAPI?.content.getAll() || [];
            const contentUrls = content.map(item => ({
                url: `/watch?id=${item.id}`,
                priority: 0.8,
                changefreq: 'weekly',
                lastmod: item.addedDate,
                images: [
                    {
                        url: item.thumbnail,
                        title: item.title,
                        caption: item.description
                    }
                ],
                videos: item.streamUrl ? [
                    {
                        url: item.streamUrl,
                        title: item.title,
                        description: item.description,
                        thumbnail: item.thumbnail,
                        duration: item.duration
                    }
                ] : undefined
            }));

            sitemap.urls.push(...contentUrls);
        } catch (error) {
            console.warn('Could not fetch content for sitemap:', error);
        }

        this.sitemapCache = sitemap;
        return sitemap;
    }

    generateXMLSitemap() {
        const sitemap = this.generateSitemap();
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
        xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ';
        xml += 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

        sitemap.urls.forEach(page => {
            xml += '  <url>\n';
            xml += `    <loc>${this.config.baseUrl}${page.url}</loc>\n`;
            if (page.lastmod) {
                xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
            }
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;

            // Add image sitemap data
            if (page.images) {
                page.images.forEach(image => {
                    xml += '    <image:image>\n';
                    xml += `      <image:loc>${image.url}</image:loc>\n`;
                    xml += `      <image:title>${this.escapeXML(image.title)}</image:title>\n`;
                    if (image.caption) {
                        xml += `      <image:caption>${this.escapeXML(image.caption)}</image:caption>\n`;
                    }
                    xml += '    </image:image>\n';
                });
            }

            // Add video sitemap data
            if (page.videos) {
                page.videos.forEach(video => {
                    xml += '    <video:video>\n';
                    xml += `      <video:content_loc>${video.url}</video:content_loc>\n`;
                    xml += `      <video:thumbnail_loc>${video.thumbnail}</video:thumbnail_loc>\n`;
                    xml += `      <video:title>${this.escapeXML(video.title)}</video:title>\n`;
                    xml += `      <video:description>${this.escapeXML(video.description)}</video:description>\n`;
                    if (video.duration) {
                        xml += `      <video:duration>${video.duration * 60}</video:duration>\n`;
                    }
                    xml += '    </video:video>\n';
                });
            }

            xml += '  </url>\n';
        });

        xml += '</urlset>';
        return xml;
    }

    // === UTILITY FUNCTIONS ===
    optimizeDescription(description, content) {
        if (!description) {
            description = `Watch ${content.title} online`;
        }

        // Optimize length for SEO (150-160 characters)
        let optimized = description.length > 155 ? 
            description.substring(0, 152) + '...' : 
            description;

        // Add streaming keywords
        const streamingTerms = ['stream', 'watch', 'online'];
        const hasStreamingTerm = streamingTerms.some(term => 
            optimized.toLowerCase().includes(term)
        );

        if (!hasStreamingTerm) {
            optimized = `Stream ${optimized}`;
        }

        // Add site name if space allows
        if (optimized.length < 140) {
            optimized += ` | ${this.config.siteName}`;
        }

        return optimized;
    }

    generateContentKeywords(content) {
        const keywords = [...this.config.keywords];
        
        // Add content-specific keywords
        if (content.genre) {
            keywords.push(...content.genre.map(g => `${g} ${content.type}`));
            keywords.push(...content.genre.map(g => `watch ${g} online`));
        }

        // Add title-based keywords
        const titleWords = content.title.toLowerCase().split(' ').filter(word => word.length > 3);
        keywords.push(...titleWords);

        // Add type-specific keywords
        if (content.type === 'movie') {
            keywords.push('full movie', 'movie online', 'watch movie', 'hd movie');
        } else if (content.type === 'series') {
            keywords.push('tv series', 'episodes online', 'season', 'watch series');
        }

        // Remove duplicates and return
        return [...new Set(keywords)];
    }

    escapeXML(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    getContentData(contentId) {
        try {
            return window.BulldogAPI?.content.get(parseInt(contentId));
        } catch (error) {
            console.warn('Could not fetch content data:', error);
            return null;
        }
    }

    // === CONTENT MONITORING ===
    observeContentChanges() {
        // Monitor URL changes for SPA navigation
        let currentUrl = window.location.href;
        
        const checkUrlChange = () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(() => this.injectPageSEO(), 100); // Small delay for content to load
            }
        };

        // Monitor for navigation changes
        window.addEventListener('popstate', checkUrlChange);
        window.addEventListener('pushstate', checkUrlChange);
        window.addEventListener('replacestate', checkUrlChange);

        // Monitor hash changes
        window.addEventListener('hashchange', () => {
            setTimeout(() => this.injectPageSEO(), 100);
        });

        // Monitor DOM changes for dynamic content
        const observer = new MutationObserver((mutations) => {
            const hasContentChanges = mutations.some(mutation => 
                mutation.type === 'childList' && 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.classList.contains('content-section') || 
                     node.querySelector && node.querySelector('[data-content-id]'))
                )
            );

            if (hasContentChanges) {
                setTimeout(() => this.injectPageSEO(), 200);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    scheduleUpdates() {
        // Update sitemap every hour
        setInterval(() => {
            this.generateSitemap();
            console.log('📍 Sitemap updated automatically');
        }, 3600000); // 1 hour

        // Clear meta cache every 4 hours
        setInterval(() => {
            this.metaCache.clear();
            this.schemaCache.clear();
            console.log('🧹 SEO cache cleared');
        }, 14400000); // 4 hours
    }

    // === PERFORMANCE TRACKING ===
    initializePerformanceTracking() {
        // Track Core Web Vitals
        this.trackWebVitals();
        
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => this.reportPerformanceMetrics(), 1000);
        });
    }

    trackWebVitals() {
        // Track Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('📊 LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Track First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('📊 FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('📊 CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    reportPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const metrics = {
                pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                firstByte: navigation.responseStart - navigation.requestStart,
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnect: navigation.connectEnd - navigation.connectStart
            };
            
            console.log('📈 Performance Metrics:', metrics);
            
            // Report to analytics if available
            if (window.BulldogAPI?.analytics.trackEvent) {
                window.BulldogAPI.analytics.trackEvent('performance', metrics);
            }
        }
    }

    // === PUBLIC API ===
    updatePageSEO(contentId = null) {
        if (contentId) {
            this.injectContentSEO(contentId);
        } else {
            this.injectPageSEO();
        }
    }

    getSitemap(format = 'json') {
        if (format === 'xml') {
            return this.generateXMLSitemap();
        }
        return this.generateSitemap();
    }

    getMetaData(url = window.location.href) {
        return this.metaCache.get(url) || null;
    }

    clearCache() {
        this.metaCache.clear();
        this.schemaCache.clear();
        this.sitemapCache = null;
    }

    getStatus() {
        return {
            initialized: true,
            cacheSize: {
                meta: this.metaCache.size,
                schema: this.schemaCache.size,
                sitemap: this.sitemapCache ? 1 : 0
            },
            lastUpdate: new Date(this.lastUpdate).toISOString(),
            features: {
                autoMetaInjection: true,
                structuredData: true,
                sitemapGeneration: true,
                performanceTracking: true,
                contentMonitoring: true
            }
        };
    }
}

// Initialize Auto SEO when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.BulldogSEO = new AdvancedSEOAutomation();
    
    // Expose global API
    window.updateSEO = (contentId) => window.BulldogSEO.updatePageSEO(contentId);
    window.getSitemap = (format) => window.BulldogSEO.getSitemap(format);
    
    console.log('🎯 Advanced SEO Automation ready!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedSEOAutomation;
}
