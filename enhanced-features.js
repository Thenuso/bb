// Enhanced JavaScript for Bulldog Stream Platform
// Additional features and utilities

// Add HLS.js support for better video streaming
document.addEventListener('DOMContentLoaded', function() {
    // Load HLS.js for better video stream support
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js';
    script.onload = function() {
        console.log('HLS.js loaded successfully');
    };
    document.head.appendChild(script);
});

// Enhanced video player with HLS support
class EnhancedVideoPlayer {
    constructor(videoElement) {
        this.video = videoElement;
        this.hls = null;
        this.isFullscreen = false;
        this.volume = 0.7;
        this.init();
    }

    init() {
        this.setupControls();
        this.setupEventListeners();
        this.video.volume = this.volume;
    }

    setupControls() {
        // Custom video controls will be handled by the existing HTML structure
    }

    setupEventListeners() {
        this.video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });

        this.video.addEventListener('loadeddata', () => {
            console.log('Video data loaded');
        });

        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.showVideoError();
        });

        this.video.addEventListener('ended', () => {
            this.onVideoEnded();
        });
    }

    loadStream(url, isHLS = false) {
        if (isHLS && window.Hls && Hls.isSupported()) {
            if (this.hls) {
                this.hls.destroy();
            }
            this.hls = new Hls();
            this.hls.loadSource(url);
            this.hls.attachMedia(this.video);
        } else {
            this.video.src = url;
        }
    }

    showVideoError() {
        const errorElement = document.getElementById('video-error');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
    }

    onVideoEnded() {
        // Handle video end - could show related content or restart
        console.log('Video ended');
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (this.video.requestFullscreen) {
                this.video.requestFullscreen();
            } else if (this.video.webkitRequestFullscreen) {
                this.video.webkitRequestFullscreen();
            } else if (this.video.msRequestFullscreen) {
                this.video.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        this.isFullscreen = !this.isFullscreen;
    }
}

// Enhanced search functionality
class SearchManager {
    constructor() {
        this.searchResults = [];
        this.isSearching = false;
    }

    async performSearch(query) {
        if (!query.trim()) return [];

        this.isSearching = true;
        
        // Simulate search API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResults = this.generateMockSearchResults(query);
                this.searchResults = mockResults;
                this.isSearching = false;
                resolve(mockResults);
            }, 500);
        });
    }

    generateMockSearchResults(query) {
        const allContent = [
            { type: 'channel', name: 'ESPN', category: 'Sports' },
            { type: 'channel', name: 'HBO', category: 'Movies' },
            { type: 'movie', name: 'Action Movie 1', category: 'Action' },
            { type: 'series', name: 'Sci-Fi Series 1', category: 'Science Fiction' },
            { type: 'news', name: 'Breaking News', category: 'News' }
        ];

        return allContent.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// Enhanced analytics and user behavior tracking
class AnalyticsManager {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            pageViews: {},
            interactions: [],
            watchTime: 0
        };
        this.init();
    }

    init() {
        this.trackPageView('home');
        this.setupBeforeUnload();
    }

    trackPageView(page) {
        if (!this.sessionData.pageViews[page]) {
            this.sessionData.pageViews[page] = 0;
        }
        this.sessionData.pageViews[page]++;
        console.log(`Page view tracked: ${page}`);
    }

    trackInteraction(type, element, details = {}) {
        this.sessionData.interactions.push({
            timestamp: Date.now(),
            type,
            element,
            details
        });
        console.log(`Interaction tracked: ${type} on ${element}`);
    }

    trackWatchTime(seconds) {
        this.sessionData.watchTime += seconds;
    }

    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.sendAnalytics();
        });
    }

    sendAnalytics() {
        // In a real app, this would send data to analytics service
        console.log('Session analytics:', this.sessionData);
    }
}

// Enhanced notification system
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification bg-gray-800 text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        
        const colors = {
            info: 'border-l-4 border-blue-500',
            success: 'border-l-4 border-green-500',
            warning: 'border-l-4 border-yellow-500',
            error: 'border-l-4 border-red-500'
        };

        notification.className += ` ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button class="ml-4 text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }

        this.notifications.push(notification);
        return notification;
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Enhanced offline support
class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.onOnline();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.onOffline();
        });
    }

    onOnline() {
        console.log('Connection restored');
        if (window.notificationManager) {
            window.notificationManager.success('Connection restored!');
        }
    }

    onOffline() {
        console.log('Connection lost');
        if (window.notificationManager) {
            window.notificationManager.warning('Connection lost. Some features may not work properly.');
        }
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    window.searchManager = new SearchManager();
    window.analyticsManager = new AnalyticsManager();
    window.notificationManager = new NotificationManager();
    window.offlineManager = new OfflineManager();

    // Initialize enhanced video player when video element is available
    const videoElement = document.getElementById('main-video-player');
    if (videoElement) {
        window.enhancedPlayer = new EnhancedVideoPlayer(videoElement);
    }

    // Enhanced search with debouncing
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                if (e.target.value.length > 2) {
                    const results = await window.searchManager.performSearch(e.target.value);
                    console.log('Search results:', results);
                    // Could show search dropdown here
                }
            }, 300);
        });
    }

    // Track all button clicks for analytics
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
            window.analyticsManager.trackInteraction('click', 'button', {
                text: button.textContent.trim(),
                classes: button.className
            });
        }
    });

    // Show welcome notification for new users
    setTimeout(() => {
        window.notificationManager.info('Welcome to Bulldog Stream! Enjoy free streaming with ads or upgrade for premium experience.');
    }, 2000);
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Export for global use
window.BulldogStream = {
    SearchManager,
    AnalyticsManager,
    NotificationManager,
    OfflineManager,
    EnhancedVideoPlayer
};
