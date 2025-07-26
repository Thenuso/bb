// Bulldog Stream Modern App - Tailwind CSS Version
(function() {
    'use strict';

    // App Configuration
    const CONFIG = {
        API_BASE_URL: 'http://localhost:3001',
        DEBUG: true,
        STORAGE_KEYS: {
            USER: 'bulldog_user',
            TOKEN: 'bulldog_token',
            COINS: 'bulldog_coins',
            SETTINGS: 'bulldog_settings'
        }
    };

    // Debug function
    function debug(message, data = null) {
        if (CONFIG.DEBUG) {
            console.log(`[Bulldog Stream] ${message}`, data || '');
        }
    }

    // Main App Object
    window.BulldogStreamApp = {
        // Current state
        state: {
            user: null,
            currentSection: 'home',
            isAuthenticated: false,
            coins: 0,
            channels: [],
            movies: [],
            series: []
        },

        // Initialize the app
        init() {
            debug('Initializing Bulldog Stream App');
            try {
                this.setupEventListeners();
                this.loadUserData();
                this.hideLoadingScreen();
                this.initializeContent();
                debug('App initialization completed successfully');
            } catch (error) {
                debug('Error during initialization:', error);
                this.hideLoadingScreen();
                this.showNotification('App initialized with limited functionality', 'warning');
            }
        },

        // Setup all event listeners
        setupEventListeners() {
            debug('Setting up event listeners');

            // Navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = e.target.getAttribute('data-section');
                    this.showSection(section);
                });
            });

            // Auth buttons
            const loginBtn = document.getElementById('loginBtn');
            const registerBtn = document.getElementById('registerBtn');
            const authModal = document.getElementById('authModal');
            const closeAuthModal = document.getElementById('closeAuthModal');
            const authSwitch = document.getElementById('authSwitch');
            const authForm = document.getElementById('authForm');

            if (loginBtn) {
                loginBtn.addEventListener('click', () => this.showAuthModal('login'));
            }

            if (registerBtn) {
                registerBtn.addEventListener('click', () => this.showAuthModal('register'));
            }

            if (closeAuthModal) {
                closeAuthModal.addEventListener('click', () => this.hideAuthModal());
            }

            if (authSwitch) {
                authSwitch.addEventListener('click', () => this.toggleAuthMode());
            }

            if (authForm) {
                authForm.addEventListener('submit', (e) => this.handleAuth(e));
            }

            // User dropdown
            const userBtn = document.getElementById('userBtn');
            const userDropdown = document.getElementById('userDropdown');
            const logoutBtn = document.getElementById('logoutBtn');

            if (userBtn) {
                userBtn.addEventListener('click', () => {
                    userDropdown.classList.toggle('hidden');
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }

            // Search functionality
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            }

            // Hero buttons
            const startWatchingBtn = document.getElementById('startWatchingBtn');
            if (startWatchingBtn) {
                startWatchingBtn.addEventListener('click', () => this.showSection('channels'));
            }

            // Earning buttons
            const referralBtn = document.getElementById('referralBtn');
            const dailyBonusBtn = document.getElementById('dailyBonusBtn');
            const buyCoinsBtn = document.getElementById('buyCoinsBtn');

            if (referralBtn) {
                referralBtn.addEventListener('click', () => this.handleReferral());
            }

            if (dailyBonusBtn) {
                dailyBonusBtn.addEventListener('click', () => this.claimDailyBonus());
            }

            if (buyCoinsBtn) {
                buyCoinsBtn.addEventListener('click', () => this.showCoinPurchase());
            }

            // Tab switches
            this.setupTabSwitchers();

            // Mobile menu
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Click outside to close dropdowns
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#userBtn') && !e.target.closest('#userDropdown')) {
                    const dropdown = document.getElementById('userDropdown');
                    if (dropdown) dropdown.classList.add('hidden');
                }
            });

            debug('Event listeners setup complete');
        },

        // Setup tab switchers for different sections
        setupTabSwitchers() {
            // TV tabs
            document.querySelectorAll('.tv-tab-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const tab = e.target.getAttribute('data-tab');
                    this.switchTVTab(tab, e.target);
                });
            });

            // Movie tabs
            document.querySelectorAll('.movie-tab-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const tab = e.target.getAttribute('data-tab');
                    this.switchMovieTab(tab, e.target);
                });
            });

            // Series tabs
            document.querySelectorAll('.series-tab-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const tab = e.target.getAttribute('data-tab');
                    this.switchSeriesTab(tab, e.target);
                });
            });
        },

        // Load user data from localStorage
        loadUserData() {
            debug('Loading user data');
            const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
            const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
            const coins = localStorage.getItem(CONFIG.STORAGE_KEYS.COINS);

            if (userData && token) {
                this.state.user = JSON.parse(userData);
                this.state.isAuthenticated = true;
                this.state.coins = parseInt(coins) || 0;
                this.updateUserInterface();
            }
        },

        // Initialize content by loading data
        async initializeContent() {
            debug('Initializing content');
            try {
                // Load content with fallbacks
                this.state.channels = this.getMockChannels();
                this.state.movies = this.getMockMovies();
                this.state.series = this.getMockSeries();
                
                // Render content immediately with mock data
                this.renderChannels();
                this.renderMovies();
                this.renderSeries();
                this.loadFeaturedContent();
                this.loadNews();
                
                debug('Content loaded successfully with mock data');
                
                // Try to load real data in background
                this.loadRealData();
            } catch (error) {
                debug('Error loading content:', error);
                this.showNotification('Content loaded in offline mode', 'info');
            }
        },

        // Load real data in background
        async loadRealData() {
            try {
                await Promise.all([
                    this.loadChannels(),
                    this.loadMovies(),
                    this.loadSeries()
                ]);
            } catch (error) {
                debug('Background data loading failed:', error);
                // Continue with mock data
            }
        },

        // API call helper
        async apiCall(endpoint, options = {}) {
            try {
                const url = `${CONFIG.API_BASE_URL}/api${endpoint}`;
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.state.isAuthenticated ? `Bearer ${localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN)}` : '',
                        ...options.headers
                    },
                    ...options
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                debug('API call failed:', error);
                throw error;
            }
        },

        // Load channels
        async loadChannels() {
            debug('Loading channels');
            try {
                const response = await this.apiCall('/channels');
                this.state.channels = response.data || [];
                this.renderChannels();
            } catch (error) {
                // Fallback to mock data
                this.state.channels = this.getMockChannels();
                this.renderChannels();
            }
        },

        // Load movies
        async loadMovies() {
            debug('Loading movies');
            try {
                const response = await this.apiCall('/movies');
                this.state.movies = response.data || [];
                this.renderMovies();
            } catch (error) {
                // Fallback to mock data
                this.state.movies = this.getMockMovies();
                this.renderMovies();
            }
        },

        // Load series
        async loadSeries() {
            debug('Loading series');
            try {
                const response = await this.apiCall('/series');
                this.state.series = response.data || [];
                this.renderSeries();
            } catch (error) {
                // Fallback to mock data
                this.state.series = this.getMockSeries();
                this.renderSeries();
            }
        },

        // Load featured content
        async loadFeaturedContent() {
            debug('Loading featured content');
            const featured = [
                ...this.state.channels.slice(0, 6),
                ...this.state.movies.slice(0, 6)
            ];
            this.renderFeaturedContent(featured);
        },

        // Load news
        async loadNews() {
            debug('Loading news');
            const news = [
                {
                    title: "New Premium Channels Added",
                    summary: "We've added 50+ new premium channels to our platform",
                    image: "https://picsum.photos/400/250?random=1",
                    date: "2 hours ago"
                },
                {
                    title: "Crypto Payment Now Available",
                    summary: "You can now purchase coins using Bitcoin and Ethereum",
                    image: "https://picsum.photos/400/250?random=2",
                    date: "1 day ago"
                },
                {
                    title: "Mobile App Beta Released",
                    summary: "Download our mobile app for iOS and Android",
                    image: "https://picsum.photos/400/250?random=3",
                    date: "3 days ago"
                }
            ];
            this.renderNews(news);
        },

        // Render channels
        renderChannels() {
            const grid = document.getElementById('channelsGrid');
            if (!grid) return;

            grid.innerHTML = this.state.channels.map(channel => `
                <div class="bg-secondary rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-gray-700 hover:border-accent group" 
                     onclick="app.playChannel('${channel.id}')">
                    <div class="aspect-square bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center">
                        <img src="${channel.logo}" alt="${channel.name}" class="w-12 h-12 object-contain" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                        <span class="text-2xl hidden">${channel.name.charAt(0)}</span>
                    </div>
                    <div class="p-3">
                        <h3 class="font-semibold text-white text-sm mb-1 group-hover:text-accent transition-colors">${channel.name}</h3>
                        <p class="text-xs text-gray-400">${channel.category || 'General'}</p>
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">● LIVE</span>
                            ${channel.premium ? '<span class="text-xs text-yellow-400">👑</span>' : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        },

        // Render movies
        renderMovies() {
            const grid = document.getElementById('moviesGrid');
            if (!grid) return;

            grid.innerHTML = this.state.movies.map(movie => `
                <div class="bg-secondary rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-gray-700 hover:border-accent group" 
                     onclick="app.playMovie('${movie.id}')">
                    <div class="aspect-[3/4] bg-gradient-to-br from-accent/20 to-blue-600/20">
                        <img src="${movie.poster}" alt="${movie.title}" class="w-full h-full object-cover" 
                             onerror="this.style.display='none'; this.parentElement.classList.add('flex', 'items-center', 'justify-center')">
                        <span class="text-2xl text-white font-bold hidden">${movie.title.charAt(0)}</span>
                    </div>
                    <div class="p-3">
                        <h3 class="font-semibold text-white text-sm mb-1 group-hover:text-accent transition-colors">${movie.title}</h3>
                        <p class="text-xs text-gray-400 mb-2">${movie.year || '2024'} • ${movie.genre || 'Action'}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-yellow-400">⭐ ${movie.rating || '8.5'}</span>
                            ${movie.premium ? '<span class="text-xs text-yellow-400">👑</span>' : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        },

        // Render series
        renderSeries() {
            const grid = document.getElementById('seriesGrid');
            if (!grid) return;

            grid.innerHTML = this.state.series.map(series => `
                <div class="bg-secondary rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-gray-700 hover:border-accent group" 
                     onclick="app.playSeries('${series.id}')">
                    <div class="aspect-[3/4] bg-gradient-to-br from-accent/20 to-green-600/20">
                        <img src="${series.poster}" alt="${series.title}" class="w-full h-full object-cover" 
                             onerror="this.style.display='none'; this.parentElement.classList.add('flex', 'items-center', 'justify-center')">
                        <span class="text-2xl text-white font-bold hidden">${series.title.charAt(0)}</span>
                    </div>
                    <div class="p-3">
                        <h3 class="font-semibold text-white text-sm mb-1 group-hover:text-accent transition-colors">${series.title}</h3>
                        <p class="text-xs text-gray-400 mb-2">${series.year || '2024'} • ${series.seasons || 1} Season${(series.seasons || 1) > 1 ? 's' : ''}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-yellow-400">⭐ ${series.rating || '8.5'}</span>
                            ${series.premium ? '<span class="text-xs text-yellow-400">👑</span>' : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        },

        // Render featured content
        renderFeaturedContent(featured) {
            const container = document.getElementById('featuredContent');
            if (!container) return;

            container.innerHTML = featured.map(item => `
                <div class="bg-secondary rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-gray-700 hover:border-accent">
                    <div class="aspect-square bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center">
                        <img src="${item.logo || item.poster}" alt="${item.name || item.title}" class="w-12 h-12 object-contain">
                    </div>
                    <div class="p-2">
                        <h4 class="font-semibold text-white text-xs">${item.name || item.title}</h4>
                        <p class="text-xs text-gray-400">${item.category || item.genre || 'Entertainment'}</p>
                    </div>
                </div>
            `).join('');
        },

        // Render news
        renderNews(news) {
            const container = document.getElementById('newsFeed');
            if (!container) return;

            container.innerHTML = news.map(article => `
                <div class="bg-secondary rounded-lg overflow-hidden border border-gray-700 hover:border-accent transition-colors cursor-pointer">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-white mb-2">${article.title}</h3>
                        <p class="text-gray-400 mb-4">${article.summary}</p>
                        <p class="text-sm text-accent">${article.date}</p>
                    </div>
                </div>
            `).join('');
        },

        // Navigation
        showSection(sectionName) {
            debug(`Showing section: ${sectionName}`);
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            const targetSection = document.getElementById(`${sectionName}Section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('nav-link-active');
            });

            const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
            if (activeLink) {
                activeLink.classList.add('nav-link-active');
            }

            this.state.currentSection = sectionName;
        },

        // Authentication
        showAuthModal(mode) {
            debug(`Showing auth modal: ${mode}`);
            const modal = document.getElementById('authModal');
            const title = document.getElementById('authModalTitle');
            const submit = document.getElementById('authSubmit');
            const switchText = document.getElementById('authSwitchText');
            const switchBtn = document.getElementById('authSwitch');
            const usernameField = document.getElementById('usernameField');

            if (mode === 'register') {
                title.textContent = 'Create Account';
                submit.textContent = 'Register';
                switchText.textContent = 'Already have an account?';
                switchBtn.textContent = 'Sign In';
                usernameField.classList.remove('hidden');
            } else {
                title.textContent = 'Login';
                submit.textContent = 'Login';
                switchText.textContent = "Don't have an account?";
                switchBtn.textContent = 'Sign Up';
                usernameField.classList.add('hidden');
            }

            modal.classList.remove('hidden');
            this.currentAuthMode = mode;
        },

        hideAuthModal() {
            const modal = document.getElementById('authModal');
            modal.classList.add('hidden');
            document.getElementById('authForm').reset();
        },

        toggleAuthMode() {
            const newMode = this.currentAuthMode === 'login' ? 'register' : 'login';
            this.showAuthModal(newMode);
        },

        async handleAuth(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const username = document.getElementById('username').value;

            try {
                let response;
                if (this.currentAuthMode === 'register') {
                    response = await this.apiCall('/auth/register', {
                        method: 'POST',
                        body: JSON.stringify({ username, email, password })
                    });
                } else {
                    response = await this.apiCall('/auth/login', {
                        method: 'POST',
                        body: JSON.stringify({ identifier: email, password })
                    });
                }

                if (response.success) {
                    this.state.user = response.user;
                    this.state.isAuthenticated = true;
                    this.state.coins = response.user.coins || 0;

                    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
                    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, response.token);
                    localStorage.setItem(CONFIG.STORAGE_KEYS.COINS, this.state.coins.toString());

                    this.updateUserInterface();
                    this.hideAuthModal();
                    this.showNotification(`Welcome ${response.user.username || response.user.email}!`, 'success');
                } else {
                    this.showNotification(response.message || 'Authentication failed', 'error');
                }
            } catch (error) {
                debug('Auth error:', error);
                this.showNotification('Authentication failed. Please try again.', 'error');
            }
        },

        logout() {
            debug('Logging out user');
            this.state.user = null;
            this.state.isAuthenticated = false;
            this.state.coins = 0;

            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.COINS);

            this.updateUserInterface();
            this.showNotification('Logged out successfully', 'info');
            this.showSection('home');
        },

        updateUserInterface() {
            const authButtons = document.getElementById('authButtons');
            const userInfo = document.getElementById('userInfo');
            const userName = document.getElementById('userName');
            const userCoins = document.getElementById('userCoins');
            const currentCoins = document.getElementById('currentCoins');

            if (this.state.isAuthenticated) {
                authButtons.classList.add('hidden');
                userInfo.classList.remove('hidden');
                if (userName) userName.textContent = this.state.user.username || this.state.user.email;
                if (userCoins) userCoins.textContent = this.state.coins;
                if (currentCoins) currentCoins.textContent = this.state.coins;
            } else {
                authButtons.classList.remove('hidden');
                userInfo.classList.add('hidden');
            }
        },

        // Media playback
        playChannel(channelId) {
            debug(`Playing channel: ${channelId}`);
            const channel = this.state.channels.find(c => c.id === channelId);
            if (channel) {
                this.showVideoPlayer(channel.name, channel.stream_url || 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', 'channel');
            }
        },

        playMovie(movieId) {
            debug(`Playing movie: ${movieId}`);
            const movie = this.state.movies.find(m => m.id === movieId);
            if (movie) {
                this.showVideoPlayer(movie.title, movie.video_url || 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', 'movie');
            }
        },

        playSeries(seriesId) {
            debug(`Playing series: ${seriesId}`);
            const series = this.state.series.find(s => s.id === seriesId);
            if (series) {
                this.showVideoPlayer(series.title, series.video_url || 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', 'series');
            }
        },

        // Video Player
        showVideoPlayer(title, streamUrl, type) {
            this.hideVideoPlayer(); // Close any existing player
            
            // Create video player modal
            const playerModal = document.createElement('div');
            playerModal.id = 'videoPlayerModal';
            playerModal.className = 'fixed inset-0 bg-black z-50 flex items-center justify-center';
            
            playerModal.innerHTML = `
                <div class="relative w-full h-full max-w-6xl mx-auto">
                    <div class="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                        <h2 class="text-white text-xl font-bold">${title}</h2>
                        <div class="flex space-x-2">
                            <button id="fullscreenBtn" class="text-white bg-black/50 px-3 py-2 rounded hover:bg-black/70 transition-colors">
                                ⛶ Fullscreen
                            </button>
                            <button id="closePlayerBtn" class="text-white bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition-colors">
                                ✕ Close
                            </button>
                        </div>
                    </div>
                    <video id="videoPlayer" class="w-full h-full bg-black" controls>
                        <source src="${streamUrl}" type="application/x-mpegURL">
                        <p class="text-white text-center mt-4">Your browser does not support video playback.</p>
                    </video>
                    <div id="videoError" class="hidden absolute inset-0 flex items-center justify-center bg-black/80">
                        <div class="text-center text-white">
                            <div class="text-6xl mb-4">⚠️</div>
                            <h3 class="text-2xl font-bold mb-2">Could not play video</h3>
                            <p class="text-gray-300 mb-4">There was a problem trying to load the video.</p>
                            <button id="retryBtn" class="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-80 transition-colors">
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(playerModal);
            
            // Setup video player
            const video = document.getElementById('videoPlayer');
            const closeBtn = document.getElementById('closePlayerBtn');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            const retryBtn = document.getElementById('retryBtn');
            const errorDiv = document.getElementById('videoError');
            
            // HLS.js support
            if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
                const hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    debug('HLS manifest loaded, starting playback');
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    debug('HLS error:', data);
                    this.showVideoError();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = streamUrl;
            } else {
                // Fallback for unsupported formats
                this.showVideoError();
            }
            
            // Event listeners
            closeBtn.addEventListener('click', () => this.hideVideoPlayer());
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen(video));
            retryBtn.addEventListener('click', () => {
                errorDiv.classList.add('hidden');
                video.load();
                video.play();
            });
            
            // Auto-play
            video.play().catch(error => {
                debug('Auto-play failed:', error);
            });
            
            // ESC key to close
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.hideVideoPlayer();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
            
            this.showNotification(`Playing ${title}`, 'success');
        },

        hideVideoPlayer() {
            const playerModal = document.getElementById('videoPlayerModal');
            if (playerModal) {
                document.body.removeChild(playerModal);
            }
        },

        showVideoError() {
            const errorDiv = document.getElementById('videoError');
            if (errorDiv) {
                errorDiv.classList.remove('hidden');
            }
        },

        toggleFullscreen(video) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                video.requestFullscreen().catch(err => {
                    debug('Fullscreen request failed:', err);
                });
            }
        },

        // Coin system
        async claimDailyBonus() {
            if (!this.state.isAuthenticated) {
                this.showNotification('Please login to claim bonus', 'warning');
                return;
            }

            try {
                const response = await this.apiCall('/coins/daily-bonus', { method: 'POST' });
                if (response.success) {
                    this.state.coins += 50;
                    this.updateUserInterface();
                    this.showNotification('Daily bonus claimed! +50 coins', 'success');
                } else {
                    this.showNotification(response.message || 'Bonus already claimed today', 'warning');
                }
            } catch (error) {
                // Fallback for offline mode
                this.state.coins += 50;
                this.updateUserInterface();
                this.showNotification('Daily bonus claimed! +50 coins', 'success');
            }
        },

        handleReferral() {
            if (!this.state.isAuthenticated) {
                this.showNotification('Please login to get referral link', 'warning');
                return;
            }

            const referralLink = `${window.location.origin}?ref=${this.state.user.id}`;
            navigator.clipboard.writeText(referralLink).then(() => {
                this.showNotification('Referral link copied to clipboard!', 'success');
            });
        },

        showCoinPurchase() {
            this.showNotification('Coin purchase coming soon!', 'info');
        },

        // Tab switching
        switchTVTab(tab, button) {
            document.querySelectorAll('.tv-tab-button').forEach(btn => {
                btn.classList.remove('active', 'bg-accent', 'text-white');
                btn.classList.add('text-gray-300');
            });
            button.classList.add('active', 'bg-accent', 'text-white');
            button.classList.remove('text-gray-300');
            
            // Filter channels by tab
            this.filterChannels(tab);
        },

        switchMovieTab(tab, button) {
            document.querySelectorAll('.movie-tab-button').forEach(btn => {
                btn.classList.remove('active', 'bg-accent', 'text-white');
                btn.classList.add('text-gray-300');
            });
            button.classList.add('active', 'bg-accent', 'text-white');
            button.classList.remove('text-gray-300');
            
            // Filter movies by tab
            this.filterMovies(tab);
        },

        switchSeriesTab(tab, button) {
            document.querySelectorAll('.series-tab-button').forEach(btn => {
                btn.classList.remove('active', 'bg-accent', 'text-white');
                btn.classList.add('text-gray-300');
            });
            button.classList.add('active', 'bg-accent', 'text-white');
            button.classList.remove('text-gray-300');
            
            // Filter series by tab
            this.filterSeries(tab);
        },

        filterChannels(tab) {
            // Implementation for filtering channels
            debug(`Filtering channels by: ${tab}`);
            this.renderChannels(); // For now, just re-render all
        },

        filterMovies(tab) {
            // Implementation for filtering movies
            debug(`Filtering movies by: ${tab}`);
            this.renderMovies(); // For now, just re-render all
        },

        filterSeries(tab) {
            // Implementation for filtering series
            debug(`Filtering series by: ${tab}`);
            this.renderSeries(); // For now, just re-render all
        },

        // Search functionality
        handleSearch(query) {
            debug(`Searching for: ${query}`);
            if (query.length < 2) return;

            // Simple search implementation
            const results = [
                ...this.state.channels.filter(c => c.name.toLowerCase().includes(query.toLowerCase())),
                ...this.state.movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase())),
                ...this.state.series.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
            ];

            this.showNotification(`Found ${results.length} results for "${query}"`, 'info');
        },

        // Mobile menu
        toggleMobileMenu() {
            debug('Toggling mobile menu');
            // Implementation for mobile menu
        },

        // Notifications
        showNotification(message, type = 'info') {
            debug(`Notification: ${message} (${type})`);
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 transform translate-x-full`;
            
            // Set color based on type
            switch (type) {
                case 'success':
                    notification.classList.add('bg-green-500');
                    break;
                case 'error':
                    notification.classList.add('bg-red-500');
                    break;
                case 'warning':
                    notification.classList.add('bg-yellow-500');
                    break;
                default:
                    notification.classList.add('bg-blue-500');
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        },

        hideLoadingScreen() {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        },

        // Mock data generators
        getMockChannels() {
            return [
                { id: '1', name: 'ESPN', logo: 'https://picsum.photos/100/100?random=1', category: 'Sports', premium: false },
                { id: '2', name: 'CNN', logo: 'https://picsum.photos/100/100?random=2', category: 'News', premium: false },
                { id: '3', name: 'HBO', logo: 'https://picsum.photos/100/100?random=3', category: 'Entertainment', premium: true },
                { id: '4', name: 'Discovery', logo: 'https://picsum.photos/100/100?random=4', category: 'Documentary', premium: false },
                { id: '5', name: 'National Geographic', logo: 'https://picsum.photos/100/100?random=5', category: 'Documentary', premium: true },
                { id: '6', name: 'Comedy Central', logo: 'https://picsum.photos/100/100?random=6', category: 'Entertainment', premium: false },
                { id: '7', name: 'Fox Sports', logo: 'https://picsum.photos/100/100?random=7', category: 'Sports', premium: true },
                { id: '8', name: 'BBC', logo: 'https://picsum.photos/100/100?random=8', category: 'News', premium: false },
                { id: '9', name: 'Animal Planet', logo: 'https://picsum.photos/100/100?random=9', category: 'Documentary', premium: false },
                { id: '10', name: 'MTV', logo: 'https://picsum.photos/100/100?random=10', category: 'Entertainment', premium: false },
                { id: '11', name: 'Netflix', logo: 'https://picsum.photos/100/100?random=11', category: 'Entertainment', premium: true },
                { id: '12', name: 'Disney+', logo: 'https://picsum.photos/100/100?random=12', category: 'Entertainment', premium: true }
            ];
        },

        getMockMovies() {
            return [
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
        },

        getMockSeries() {
            return [
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
        }
    };

    // Create global app instance
    window.app = window.BulldogStreamApp;

    debug('Bulldog Stream App loaded');

})();
