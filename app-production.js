/**
 * Bulldog Stream Platform - Production Frontend Application
 * Advanced streaming platform with real backend integration
 */

class BulldogStreamApp {
    constructor() {
        this.config = {
            apiBaseUrl: 'http://localhost:3001/api',
            stripePublishableKey: 'pk_test_your_stripe_key_here',
            hlsConfig: {
                debug: false,
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            }
        };

        this.state = {
            user: null,
            isAuthenticated: false,
            currentSection: 'home',
            currentVideo: null,
            videoPlayer: null,
            hls: null,
            channels: [],
            content: [],
            transactions: []
        };

        this.elements = {};
        this.stripe = null;
        this.cardElement = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeStripe();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            // Loading
            loadingScreen: document.getElementById('loadingScreen'),
            
            // Navigation
            navLinks: document.querySelectorAll('.nav-link'),
            sections: document.querySelectorAll('.section'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            navMenu: document.getElementById('navMenu'),
            
            // Search
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            
            // Authentication
            authButtons: document.getElementById('authButtons'),
            userInfo: document.getElementById('userInfo'),
            loginBtn: document.getElementById('loginBtn'),
            registerBtn: document.getElementById('registerBtn'),
            userBtn: document.getElementById('userBtn'),
            userDropdown: document.getElementById('userDropdown'),
            logoutBtn: document.getElementById('logoutBtn'),
            userName: document.getElementById('userName'),
            userCoins: document.getElementById('userCoins'),
            
            // Modals
            authModal: document.getElementById('authModal'),
            videoPlayerModal: document.getElementById('videoPlayerModal'),
            purchaseModal: document.getElementById('purchaseModal'),
            
            // Forms
            loginForm: document.getElementById('loginForm'),
            registerForm: document.getElementById('registerForm'),
            
            // Content containers
            channelsGrid: document.getElementById('channelsGrid'),
            moviesGrid: document.getElementById('moviesGrid'),
            seriesGrid: document.getElementById('seriesGrid'),
            featuredSlider: document.getElementById('featuredSlider'),
            channelsPreview: document.getElementById('channelsPreview'),
            
            // Video player
            videoPlayer: document.getElementById('videoPlayer'),
            videoTitle: document.getElementById('videoTitle'),
            videoInfo: document.getElementById('videoInfo'),
            
            // Statistics
            totalChannels: document.getElementById('totalChannels'),
            totalMovies: document.getElementById('totalMovies'),
            totalUsers: document.getElementById('totalUsers'),
            
            // Filters
            categoryFilter: document.getElementById('categoryFilter'),
            qualityFilter: document.getElementById('qualityFilter'),
            movieGenreFilter: document.getElementById('movieGenreFilter'),
            movieYearFilter: document.getElementById('movieYearFilter'),
            seriesGenreFilter: document.getElementById('seriesGenreFilter'),
            
            // IPTV
            generatePlaylistBtn: document.getElementById('generatePlaylistBtn'),
            viewEpgBtn: document.getElementById('viewEpgBtn'),
            setupGuideBtn: document.getElementById('setupGuideBtn'),
            
            // Earn coins
            currentCoins: document.getElementById('currentCoins'),
            referralBtn: document.getElementById('referralBtn'),
            surveysBtn: document.getElementById('surveysBtn'),
            dailyBonusBtn: document.getElementById('dailyBonusBtn'),
            buyCoinsBtn: document.getElementById('buyCoinsBtn'),
            transactionsList: document.getElementById('transactionsList'),
            
            // Purchase
            packageCards: document.querySelectorAll('.package-card'),
            paymentBtns: document.querySelectorAll('.payment-btn'),
            submitPayment: document.getElementById('submitPayment'),
            selectedPackage: document.getElementById('selectedPackage'),
            
            // Notifications
            notificationContainer: document.getElementById('notificationContainer')
        };
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Navigation
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Mobile menu
        this.elements.mobileMenuBtn?.addEventListener('click', () => {
            this.elements.navMenu.classList.toggle('active');
        });

        // Search
        this.elements.searchBtn?.addEventListener('click', () => this.performSearch());
        this.elements.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Authentication
        this.elements.loginBtn?.addEventListener('click', () => this.showAuthModal('login'));
        this.elements.registerBtn?.addEventListener('click', () => this.showAuthModal('register'));
        this.elements.logoutBtn?.addEventListener('click', () => this.logout());
        
        this.elements.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.elements.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));

        // User dropdown
        this.elements.userBtn?.addEventListener('click', () => {
            this.elements.userDropdown.classList.toggle('active');
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-dropdown')) {
                this.elements.userDropdown?.classList.remove('active');
            }
        });

        // Modal controls
        this.setupModalControls();

        // Video player controls
        this.setupVideoPlayerControls();

        // IPTV features
        this.elements.generatePlaylistBtn?.addEventListener('click', () => this.generatePlaylist());
        this.elements.viewEpgBtn?.addEventListener('click', () => this.showEPG());
        this.elements.setupGuideBtn?.addEventListener('click', () => this.showSetupGuide());

        // Earn coins
        this.elements.referralBtn?.addEventListener('click', () => this.showReferralLink());
        this.elements.surveysBtn?.addEventListener('click', () => this.showSurveys());
        this.elements.dailyBonusBtn?.addEventListener('click', () => this.claimDailyBonus());
        this.elements.buyCoinsBtn?.addEventListener('click', () => this.showPurchaseModal());

        // Purchase
        this.elements.packageCards?.forEach(card => {
            card.addEventListener('click', () => this.selectPackage(card));
        });

        this.elements.paymentBtns?.forEach(btn => {
            btn.addEventListener('click', () => this.selectPaymentMethod(btn.dataset.method));
        });

        this.elements.submitPayment?.addEventListener('click', () => this.processPayment());

        // Filters
        this.elements.categoryFilter?.addEventListener('change', () => this.applyChannelFilters());
        this.elements.qualityFilter?.addEventListener('change', () => this.applyChannelFilters());
        this.elements.movieGenreFilter?.addEventListener('change', () => this.applyContentFilters('movies'));
        this.elements.movieYearFilter?.addEventListener('change', () => this.applyContentFilters('movies'));
        this.elements.seriesGenreFilter?.addEventListener('change', () => this.applyContentFilters('series'));
    }

    // Initialize Stripe
    async initializeStripe() {
        try {
            this.stripe = Stripe(this.config.stripePublishableKey);
            const elements = this.stripe.elements();
            this.cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                },
            });
            
            const cardElementDiv = document.getElementById('card-element');
            if (cardElementDiv) {
                this.cardElement.mount('#card-element');
            }
        } catch (error) {
            console.warn('Stripe initialization failed:', error);
        }
    }

    // Setup modal controls
    setupModalControls() {
        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal);
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal);
            });
        });

        // Auth switch
        const authSwitchLink = document.getElementById('authSwitchLink');
        authSwitchLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthMode();
        });
    }

    // Setup video player controls
    setupVideoPlayerControls() {
        const closeVideoBtn = document.getElementById('closeVideoBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const qualityBtn = document.getElementById('qualityBtn');

        closeVideoBtn?.addEventListener('click', () => this.closeVideoPlayer());
        fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
        qualityBtn?.addEventListener('click', () => this.showQualityMenu());
    }

    // API methods
    async apiRequest(endpoint, options = {}) {
        const url = `${this.config.apiBaseUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (this.state.isAuthenticated) {
            defaultOptions.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    // Authentication methods
    async handleLogin(e) {
        e.preventDefault();
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await this.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ identifier, password })
            });

            localStorage.setItem('token', response.token);
            this.state.user = response.user;
            this.state.isAuthenticated = true;
            
            this.updateUIForAuthentication();
            this.closeModal(this.elements.authModal);
            this.showNotification('Login successful!', 'success');
            
            // Load user data
            this.loadUserData();
        } catch (error) {
            this.showNotification('Login failed: ' + error.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const referralCode = document.getElementById('referralCode').value;

        try {
            const response = await this.apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, username, password, referralCode })
            });

            localStorage.setItem('token', response.token);
            this.state.user = response.user;
            this.state.isAuthenticated = true;
            
            this.updateUIForAuthentication();
            this.closeModal(this.elements.authModal);
            this.showNotification('Registration successful! Welcome to Bulldog Stream!', 'success');
            
            // Load user data
            this.loadUserData();
        } catch (error) {
            this.showNotification('Registration failed: ' + error.message, 'error');
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.state.user = null;
        this.state.isAuthenticated = false;
        
        this.updateUIForAuthentication();
        this.showNotification('Logged out successfully', 'info');
        this.navigateToSection('home');
    }

    updateUIForAuthentication() {
        if (this.state.isAuthenticated && this.state.user) {
            this.elements.authButtons.style.display = 'none';
            this.elements.userInfo.style.display = 'flex';
            this.elements.userName.textContent = this.state.user.display_name || this.state.user.username;
            this.elements.userCoins.textContent = this.state.user.coins || 0;
            
            // Update coins display in earn section
            if (this.elements.currentCoins) {
                this.elements.currentCoins.textContent = this.state.user.coins || 0;
            }
        } else {
            this.elements.authButtons.style.display = 'flex';
            this.elements.userInfo.style.display = 'none';
        }
    }

    async loadUserData() {
        if (!this.state.isAuthenticated) return;

        try {
            const response = await this.apiRequest('/auth/profile');
            this.state.user = response.user;
            this.updateUIForAuthentication();
            this.loadTransactions();
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    // Content loading methods
    async loadChannels() {
        try {
            const response = await this.apiRequest('/channels');
            this.state.channels = response.channels;
            this.renderChannels();
            this.renderChannelsPreview();
            this.updateStats();
        } catch (error) {
            console.error('Failed to load channels:', error);
        }
    }

    async loadContent(type = '') {
        try {
            const params = type ? `?type=${type}` : '';
            const response = await this.apiRequest(`/content${params}`);
            this.state.content = response.content;
            
            if (type === 'movie') {
                this.renderMovies();
            } else if (type === 'series') {
                this.renderSeries();
            } else {
                this.renderFeaturedContent();
            }
            this.updateStats();
        } catch (error) {
            console.error('Failed to load content:', error);
        }
    }

    async loadTransactions() {
        if (!this.state.isAuthenticated) return;

        try {
            // This would be implemented in the backend
            // const response = await this.apiRequest('/transactions');
            // this.state.transactions = response.transactions;
            // this.renderTransactions();
        } catch (error) {
            console.error('Failed to load transactions:', error);
        }
    }

    // Rendering methods
    renderChannels() {
        if (!this.elements.channelsGrid) return;

        const html = this.state.channels.map(channel => `
            <div class="channel-card" data-id="${channel.id}">
                <div class="channel-logo">
                    <img src="${channel.logo_url || 'https://picsum.photos/200/200?random=' + channel.id}" alt="${channel.name}">
                    ${channel.is_premium ? '<div class="premium-badge"><i class="fas fa-crown"></i></div>' : ''}
                </div>
                <div class="channel-info">
                    <h3>${channel.name}</h3>
                    <p class="channel-category">${channel.category}</p>
                    <p class="channel-description">${channel.description || ''}</p>
                    ${channel.coin_cost > 0 ? `<div class="coin-cost"><i class="fas fa-coins"></i> ${channel.coin_cost}/hour</div>` : ''}
                </div>
                <div class="channel-actions">
                    <button class="btn btn-primary play-btn" onclick="app.playChannel('${channel.id}')">
                        <i class="fas fa-play"></i> Watch Now
                    </button>
                    ${channel.is_live ? '<div class="live-indicator">LIVE</div>' : ''}
                </div>
            </div>
        `).join('');

        this.elements.channelsGrid.innerHTML = html;
    }

    renderChannelsPreview() {
        if (!this.elements.channelsPreview) return;

        const previewChannels = this.state.channels.slice(0, 6);
        const html = previewChannels.map(channel => `
            <div class="channel-preview-card" data-id="${channel.id}">
                <div class="channel-preview-logo">
                    <img src="${channel.logo_url || 'https://picsum.photos/150/150?random=' + channel.id}" alt="${channel.name}">
                </div>
                <h4>${channel.name}</h4>
                <p>${channel.category}</p>
                <button class="btn btn-sm btn-primary" onclick="app.playChannel('${channel.id}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');

        this.elements.channelsPreview.innerHTML = html;
    }

    renderMovies() {
        if (!this.elements.moviesGrid) return;

        const movies = this.state.content.filter(item => item.content_type === 'movie');
        const html = movies.map(movie => `
            <div class="content-card" data-id="${movie.id}">
                <div class="content-poster">
                    <img src="${movie.poster_url || 'https://picsum.photos/300/450?random=' + movie.id}" alt="${movie.title}">
                    <div class="play-overlay">
                        <button class="play-btn-large" onclick="app.playContent('${movie.id}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    ${movie.is_premium ? '<div class="premium-badge"><i class="fas fa-crown"></i></div>' : ''}
                </div>
                <div class="content-info">
                    <h3>${movie.title}</h3>
                    <p class="content-meta">
                        <span class="year">${movie.release_date ? new Date(movie.release_date).getFullYear() : ''}</span>
                        <span class="duration">${movie.duration_minutes}m</span>
                        <span class="rating">${movie.rating || 'NR'}</span>
                    </p>
                    <p class="content-genre">${Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                    ${movie.coin_cost > 0 ? `<div class="coin-cost"><i class="fas fa-coins"></i> ${movie.coin_cost}</div>` : ''}
                </div>
            </div>
        `).join('');

        this.elements.moviesGrid.innerHTML = html;
    }

    renderSeries() {
        if (!this.elements.seriesGrid) return;

        const series = this.state.content.filter(item => item.content_type === 'series');
        const html = series.map(show => `
            <div class="content-card" data-id="${show.id}">
                <div class="content-poster">
                    <img src="${show.poster_url || 'https://picsum.photos/300/450?random=' + show.id}" alt="${show.title}">
                    <div class="play-overlay">
                        <button class="play-btn-large" onclick="app.playContent('${show.id}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    ${show.is_premium ? '<div class="premium-badge"><i class="fas fa-crown"></i></div>' : ''}
                </div>
                <div class="content-info">
                    <h3>${show.title}</h3>
                    <p class="content-meta">
                        <span class="seasons">${show.total_seasons || 1} Season${show.total_seasons > 1 ? 's' : ''}</span>
                        <span class="episodes">${show.total_episodes || 0} Episodes</span>
                    </p>
                    <p class="content-genre">${Array.isArray(show.genre) ? show.genre.join(', ') : show.genre}</p>
                    ${show.coin_cost > 0 ? `<div class="coin-cost"><i class="fas fa-coins"></i> ${show.coin_cost}</div>` : ''}
                </div>
            </div>
        `).join('');

        this.elements.seriesGrid.innerHTML = html;
    }

    renderFeaturedContent() {
        if (!this.elements.featuredSlider) return;

        const featured = this.state.content.filter(item => item.featured).slice(0, 5);
        const html = featured.map(item => `
            <div class="featured-item" data-id="${item.id}">
                <div class="featured-background">
                    <img src="${item.backdrop_url || item.poster_url || 'https://picsum.photos/1920/1080?random=' + item.id}" alt="${item.title}">
                </div>
                <div class="featured-content">
                    <h2>${item.title}</h2>
                    <p class="featured-description">${item.description || ''}</p>
                    <div class="featured-meta">
                        <span class="content-type">${item.content_type}</span>
                        <span class="rating">${item.rating || 'NR'}</span>
                        <span class="genre">${Array.isArray(item.genre) ? item.genre[0] : item.genre}</span>
                    </div>
                    <div class="featured-actions">
                        <button class="btn btn-primary btn-large" onclick="app.playContent('${item.id}')">
                            <i class="fas fa-play"></i> Watch Now
                        </button>
                        <button class="btn btn-secondary btn-large">
                            <i class="fas fa-info-circle"></i> More Info
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.elements.featuredSlider.innerHTML = html;
    }

    // Video player methods
    async playChannel(channelId) {
        if (!this.state.isAuthenticated) {
            this.showAuthModal('login');
            return;
        }

        try {
            const response = await this.apiRequest(`/channels/${channelId}/stream`);
            const channel = this.state.channels.find(c => c.id === channelId);
            
            this.showVideoPlayer({
                title: channel.name,
                url: response.stream_url,
                type: 'live',
                qualityOptions: response.stream_quality,
                audioTracks: response.audio_tracks
            });
        } catch (error) {
            this.showNotification('Failed to load stream: ' + error.message, 'error');
        }
    }

    async playContent(contentId) {
        if (!this.state.isAuthenticated) {
            this.showAuthModal('login');
            return;
        }

        const content = this.state.content.find(c => c.id === contentId);
        if (!content) return;

        // Check if user has access
        if (content.is_premium && !this.state.user.is_premium) {
            this.showNotification('Premium subscription required', 'warning');
            return;
        }

        if (content.coin_cost > 0 && this.state.user.coins < content.coin_cost) {
            this.showNotification('Insufficient coins', 'warning');
            return;
        }

        this.showVideoPlayer({
            title: content.title,
            url: content.video_url,
            type: 'vod',
            description: content.description,
            poster: content.poster_url
        });
    }

    showVideoPlayer(options) {
        this.elements.videoTitle.textContent = options.title;
        this.elements.videoPlayerModal.style.display = 'flex';
        
        // Initialize video player
        if (this.state.videoPlayer) {
            this.state.videoPlayer.dispose();
        }

        this.state.videoPlayer = videojs(this.elements.videoPlayer, {
            controls: true,
            responsive: true,
            fluid: true,
            poster: options.poster,
            playbackRates: [0.5, 1, 1.25, 1.5, 2],
            plugins: {}
        });

        // Setup HLS if available
        if (Hls.isSupported() && options.url.includes('.m3u8')) {
            this.setupHLSPlayer(options.url);
        } else {
            this.state.videoPlayer.src(options.url);
        }

        this.state.videoPlayer.ready(() => {
            this.state.videoPlayer.play();
        });

        // Update video info
        if (options.description) {
            this.elements.videoInfo.innerHTML = `
                <p>${options.description}</p>
                ${options.qualityOptions ? '<div class="quality-options">' + Object.keys(options.qualityOptions).map(q => `<button class="quality-btn" data-quality="${q}">${q.toUpperCase()}</button>`).join('') + '</div>' : ''}
            `;
        }
    }

    setupHLSPlayer(url) {
        if (this.state.hls) {
            this.state.hls.destroy();
        }

        this.state.hls = new Hls(this.config.hlsConfig);
        this.state.hls.loadSource(url);
        this.state.hls.attachMedia(this.elements.videoPlayer);

        this.state.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded');
        });

        this.state.hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal) {
                this.showNotification('Streaming error occurred', 'error');
            }
        });
    }

    closeVideoPlayer() {
        this.elements.videoPlayerModal.style.display = 'none';
        
        if (this.state.videoPlayer) {
            this.state.videoPlayer.dispose();
            this.state.videoPlayer = null;
        }

        if (this.state.hls) {
            this.state.hls.destroy();
            this.state.hls = null;
        }
    }

    toggleFullscreen() {
        if (this.state.videoPlayer) {
            if (this.state.videoPlayer.isFullscreen()) {
                this.state.videoPlayer.exitFullscreen();
            } else {
                this.state.videoPlayer.requestFullscreen();
            }
        }
    }

    // Navigation methods
    navigateToSection(sectionName) {
        // Update navigation
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionName) {
                link.classList.add('active');
            }
        });

        // Update sections
        this.elements.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionName + 'Section') {
                section.classList.add('active');
            }
        });

        this.state.currentSection = sectionName;

        // Load content for section
        switch (sectionName) {
            case 'channels':
                this.loadChannels();
                break;
            case 'movies':
                this.loadContent('movie');
                break;
            case 'series':
                this.loadContent('series');
                break;
            case 'home':
                this.loadChannels();
                this.loadContent();
                break;
        }

        // Close mobile menu
        this.elements.navMenu?.classList.remove('active');
    }

    // Modal methods
    showModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    showAuthModal(mode = 'login') {
        const title = document.getElementById('authTitle');
        const switchText = document.getElementById('authSwitchText');
        const switchLink = document.getElementById('authSwitchLink');

        if (mode === 'login') {
            title.textContent = 'Login';
            this.elements.loginForm.style.display = 'block';
            this.elements.registerForm.style.display = 'none';
            switchText.innerHTML = 'Don\'t have an account? <a href="#" id="authSwitchLink">Register here</a>';
        } else {
            title.textContent = 'Register';
            this.elements.loginForm.style.display = 'none';
            this.elements.registerForm.style.display = 'block';
            switchText.innerHTML = 'Already have an account? <a href="#" id="authSwitchLink">Login here</a>';
        }

        this.showModal(this.elements.authModal);
    }

    switchAuthMode() {
        const isLogin = this.elements.loginForm.style.display !== 'none';
        this.showAuthModal(isLogin ? 'register' : 'login');
    }

    showPurchaseModal() {
        if (!this.state.isAuthenticated) {
            this.showAuthModal('login');
            return;
        }
        this.showModal(this.elements.purchaseModal);
    }

    // Payment methods
    selectPackage(card) {
        document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const coins = card.dataset.coins;
        const price = card.dataset.price;
        
        this.elements.selectedPackage.textContent = `${coins} Coins`;
        this.elements.submitPayment.setAttribute('data-coins', coins);
        this.elements.submitPayment.setAttribute('data-price', price);
    }

    selectPaymentMethod(method) {
        this.elements.paymentBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
        
        if (method === 'stripe') {
            document.getElementById('stripePayment').style.display = 'block';
            document.getElementById('cryptoPayment').style.display = 'none';
        } else {
            document.getElementById('stripePayment').style.display = 'none';
            document.getElementById('cryptoPayment').style.display = 'block';
        }
    }

    async processPayment() {
        const coins = this.elements.submitPayment.getAttribute('data-coins');
        const price = this.elements.submitPayment.getAttribute('data-price');
        const method = document.querySelector('.payment-btn.active').dataset.method;

        if (method === 'stripe') {
            await this.processStripePayment(coins, price);
        } else {
            await this.processCryptoPayment(coins, price);
        }
    }

    async processStripePayment(coins, price) {
        try {
            // Create payment intent
            const response = await this.apiRequest('/payments/stripe/create-payment-intent', {
                method: 'POST',
                body: JSON.stringify({
                    amount: price * 100, // Convert to cents
                    coins: parseInt(coins)
                })
            });

            // Confirm payment
            const result = await this.stripe.confirmCardPayment(response.client_secret, {
                payment_method: {
                    card: this.cardElement,
                }
            });

            if (result.error) {
                this.showNotification('Payment failed: ' + result.error.message, 'error');
            } else {
                this.showNotification('Payment successful! Coins added to your account.', 'success');
                this.closeModal(this.elements.purchaseModal);
                this.loadUserData(); // Refresh user data
            }
        } catch (error) {
            this.showNotification('Payment processing failed: ' + error.message, 'error');
        }
    }

    async processCryptoPayment(coins, price) {
        const selectedCrypto = document.querySelector('.crypto-btn.active');
        if (!selectedCrypto) {
            this.showNotification('Please select a cryptocurrency', 'warning');
            return;
        }

        try {
            const response = await this.apiRequest('/payments/crypto/generate-address', {
                method: 'POST',
                body: JSON.stringify({
                    currency: selectedCrypto.dataset.crypto,
                    amount_usd: parseFloat(price)
                })
            });

            // Show crypto payment details
            document.getElementById('cryptoAddress').value = response.address;
            document.getElementById('cryptoAmount').textContent = `${response.amount_crypto} ${selectedCrypto.dataset.crypto}`;
            document.getElementById('cryptoDetails').style.display = 'block';
            
            // Start countdown timer
            this.startCryptoTimer(response.expires_at);
            
            this.showNotification('Crypto payment address generated. Send the exact amount to complete purchase.', 'info');
        } catch (error) {
            this.showNotification('Failed to generate crypto address: ' + error.message, 'error');
        }
    }

    startCryptoTimer(expiresAt) {
        const timerElement = document.getElementById('cryptoTimer');
        const endTime = new Date(expiresAt).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const timeLeft = endTime - now;

            if (timeLeft <= 0) {
                timerElement.textContent = 'Expired';
                return;
            }

            const minutes = Math.floor(timeLeft / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        // Clear interval after expiration
        setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
    }

    // Utility methods
    performSearch() {
        const query = this.elements.searchInput.value.trim();
        if (!query) return;

        console.log('Searching for:', query);
        // Implement search functionality
        this.showNotification(`Searching for: ${query}`, 'info');
    }

    updateStats() {
        if (this.elements.totalChannels) {
            this.elements.totalChannels.textContent = this.state.channels.length;
        }
        if (this.elements.totalMovies) {
            this.elements.totalMovies.textContent = this.state.content.filter(c => c.content_type === 'movie').length;
        }
        // Add more stats as needed
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.elements.notificationContainer.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    // Feature methods
    async generatePlaylist() {
        if (!this.state.isAuthenticated) {
            this.showAuthModal('login');
            return;
        }

        this.showNotification('Generating M3U playlist...', 'info');
        
        // Generate playlist content
        let playlist = '#EXTM3U\n';
        this.state.channels.forEach(channel => {
            playlist += `#EXTINF:-1 tvg-id="${channel.id}" tvg-name="${channel.name}" tvg-logo="${channel.logo_url}" group-title="${channel.category}",${channel.name}\n`;
            playlist += `${channel.primary_stream_url}\n`;
        });

        // Create and download file
        const blob = new Blob([playlist], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bulldog-stream-playlist.m3u';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Playlist downloaded successfully!', 'success');
    }

    showEPG() {
        this.showNotification('EPG viewer coming soon!', 'info');
    }

    showSetupGuide() {
        this.showNotification('Setup guide coming soon!', 'info');
    }

    async claimDailyBonus() {
        if (!this.state.isAuthenticated) {
            this.showAuthModal('login');
            return;
        }

        // Implement daily bonus logic
        this.showNotification('Daily bonus claimed! +50 coins', 'success');
        this.loadUserData();
    }

    showReferralLink() {
        if (!this.state.isAuthenticated) {
            this.showAuthModal('login');
            return;
        }

        const referralLink = `${window.location.origin}?ref=${this.state.user.username}`;
        navigator.clipboard.writeText(referralLink).then(() => {
            this.showNotification('Referral link copied to clipboard!', 'success');
        });
    }

    showSurveys() {
        this.showNotification('Survey integration coming soon!', 'info');
    }

    // Filter methods
    applyChannelFilters() {
        const category = this.elements.categoryFilter?.value;
        const quality = this.elements.qualityFilter?.value;
        
        let filteredChannels = [...this.state.channels];
        
        if (category) {
            filteredChannels = filteredChannels.filter(c => c.category === category);
        }
        
        if (quality) {
            filteredChannels = filteredChannels.filter(c => 
                c.stream_quality && Object.keys(c.stream_quality).includes(quality)
            );
        }
        
        // Re-render with filtered channels
        const tempChannels = this.state.channels;
        this.state.channels = filteredChannels;
        this.renderChannels();
        this.state.channels = tempChannels;
    }

    applyContentFilters(type) {
        // Implement content filtering
        console.log('Applying filters for:', type);
    }

    // Initialization
    async init() {
        console.log('🚀 Initializing Bulldog Stream App...');
        
        // Show loading screen
        this.elements.loadingScreen.style.display = 'flex';
        
        try {
            // Check for existing authentication
            const token = localStorage.getItem('token');
            if (token) {
                this.state.isAuthenticated = true;
                await this.loadUserData();
            }
            
            // Load initial content
            await this.loadChannels();
            await this.loadContent();
            
            // Initialize default section
            this.navigateToSection('home');
            
            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showNotification('Failed to initialize app', 'error');
        } finally {
            // Hide loading screen
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
            }, 1000);
        }
    }
}

// Create global app instance
window.BulldogStreamApp = BulldogStreamApp;
window.app = new BulldogStreamApp();
