# Bulldog Stream - Live TV & Movie Show with Earning Server

A complete streaming platform with dark theme design, coin-based earning system, premium subscriptions, and comprehensive user management features.

## 🚀 Features

### Core Functionality
- **Single Page Application (SPA)** with smooth transitions
- **Dark Theme Design** with purple accent (#B800FF)
- **Responsive Design** for mobile, tablet, and desktop
- **Progressive Web App (PWA)** capabilities

### Content & Streaming
- **Live TV Channels** with EPG (Electronic Program Guide)
- **Movies & Web Series** library
- **Video Player** with multiple quality options
- **HLS Streaming Support** for live content
- **Ad Integration** for free users (pre-roll, banner overlays)

### User Management
- **Guest Access** (limited browsing)
- **Free Tier** (full access with ads)
- **Premium Tier** (ad-free experience)
- **User Authentication** (Login/Signup)
- **Profile Management**

### Earning & Monetization System
- **Coin-based Economy** 
- **Survey Completion** rewards
- **Referral Program** 
- **Subscription Management** (Premium watch time, IPTV access)
- **Coin Redemption** system

### Enhanced Features
- **AI-Powered Content Summaries** using Pollinations.AI
- **Real-time Notifications**
- **Offline Support** with Service Worker
- **Analytics Tracking**
- **Enhanced Search** functionality
- **Accessibility Features** (WCAG compliant)

## 📁 Project Structure

```
iptvandmovie/
├── home.htm              # Main application file
├── style.css             # Enhanced CSS styles
├── enhanced-features.js   # Advanced JavaScript features
├── manifest.json         # PWA manifest
├── sw.js                 # Service Worker
└── README.md            # This file
```

## 🛠️ Installation & Setup

### Option 1: Direct File Access
1. Download all files to a local folder
2. Open `home.htm` in any modern web browser
3. The application will work immediately with all features

### Option 2: Local Server (Recommended)
1. Install Python 3.x on your system
2. Navigate to the project folder in terminal/command prompt
3. Run a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
4. Open `http://localhost:8000/home.htm` in your browser

### Option 3: Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `home.htm`
3. Select "Open with Live Server"

## 🎯 Usage Guide

### For Guests (No Login Required)
- Browse news articles on the home page
- View TV schedules and channel listings
- Browse movie and series catalogs
- **Limited**: Cannot stream content (requires login)

### For Free Users (After Login/Signup)
- Full streaming access with advertisements
- Earn coins through surveys and referrals
- Access to dashboard and earning features
- Ad-supported viewing experience

### For Premium Users (Coin Redemption)
- Ad-free streaming experience
- Full access to all content
- Enhanced video quality options
- Priority customer support

## 💰 Earning System

### How to Earn Coins:
1. **Sign Up Bonus**: 100 coins
2. **Complete Surveys**: 75-150 coins each
3. **Refer Friends**: 500 coins per successful referral
4. **Daily Login**: Bonus coins (future feature)

### How to Spend Coins:
- **1 Hour Premium**: 10 coins
- **1 Day Premium**: 100 coins
- **7 Days Premium**: 500 coins
- **IPTV Access**: 50-1000 coins

## 🎨 Design Specifications

### Color Palette
- **Primary Background**: #1A1A1A
- **Secondary Background**: #2A2A2A
- **Accent Color**: #B800FF (Purple)
- **Text Colors**: #FFFFFF (primary), #CCCCCC (secondary)
- **Error/Live**: #FF0000

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Responsive scaling** for different screen sizes

### Responsive Breakpoints
- **Mobile**: < 640px (2 columns)
- **Tablet**: 640px - 1024px (3-4 columns)
- **Desktop**: > 1024px (6 columns)

## 🔧 Technical Features

### Video Streaming
- **HLS.js Integration** for live streaming
- **Multiple Quality Options** (HD, SD)
- **Multi-language Support** (English, Spanish)
- **Error Handling** with retry functionality

### AI Integration
- **Pollinations.AI** for content summarization
- **Dynamic content enhancement**
- **Natural language processing**

### PWA Features
- **Offline Caching** with Service Worker
- **Install Prompt** for mobile/desktop
- **Background Sync** for offline actions
- **Push Notifications** ready

### Performance Optimizations
- **Lazy Loading** for images and content
- **Efficient DOM Manipulation**
- **Minimal HTTP Requests**
- **Optimized Asset Loading**

## 🌐 Browser Compatibility

### Fully Supported
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Partially Supported
- Internet Explorer 11 (limited features)
- Older mobile browsers

## 📱 Mobile Features

### Responsive Design
- **Touch-friendly Interface**
- **Swipe Gestures** (future enhancement)
- **Mobile-optimized Navigation**
- **Adaptive Video Player**

### PWA Capabilities
- **Add to Home Screen**
- **Offline Functionality**
- **Native App Experience**
- **Background Updates**

## 🔒 Security Features

### Data Protection
- **Client-side Data Storage** (localStorage)
- **Secure Token Handling** (simulation)
- **Input Validation** on all forms
- **XSS Protection** measures

### Privacy
- **Anonymous Mode** option
- **No Third-party Tracking** (except AI API)
- **User Data Control**
- **GDPR Compliance** ready

## 🎭 Content Categories

### TV Channels
- **Sports**: ESPN, Ten Sports
- **News**: Star News, CNN
- **Entertainment**: HBO, Discovery
- **Documentary**: National Geographic

### Movies & Series
- **Action & Adventure**
- **Science Fiction**
- **Drama & Romance**
- **Comedy & Family**

## 🚀 Future Enhancements

### Planned Features
- **Real Backend Integration**
- **Live Chat System**
- **Advanced Analytics Dashboard**
- **Social Features** (sharing, comments)
- **Download for Offline** viewing
- **Chromecast/AirPlay Support**

### Technical Improvements
- **WebRTC Integration** for live streaming
- **Advanced Caching** strategies
- **Performance Monitoring**
- **A/B Testing** framework

## 🐛 Known Issues & Limitations

### Current Limitations
- **Mock Data**: All content uses placeholder data
- **Simulated Streaming**: Video URLs are demo content
- **No Real Authentication**: Login is simulated
- **Limited Search**: Basic text matching only

### Browser-Specific Issues
- **Safari**: Some CSS features may not work in older versions
- **Firefox**: Service Worker notifications need user permission
- **Mobile Safari**: Video autoplay restrictions

## 📞 Support & Community

### Getting Help
- Check this README for common questions
- Use browser developer tools for debugging
- Test in multiple browsers for compatibility

### Contributing
This is a demo project showcasing modern web development techniques. Feel free to:
- Enhance existing features
- Add new functionality
- Improve responsive design
- Optimize performance

## 📄 License

This project is created for demonstration purposes. All placeholder images are from Unsplash and Placehold.co.

### Third-party Services Used
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Chart and graph library
- **Pollinations.AI**: AI text generation
- **HLS.js**: HTTP Live Streaming library
- **Google Fonts**: Inter font family

---

**Created with ❤️ for the modern web**

*Last updated: July 26, 2025*
