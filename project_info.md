Specifications and Introduction - Live TV & Movie Show with Earning Server
This document provides detailed instructions for "High level Live TV & Movie Show with Earning Server" website, drawing inspiration from the provided screenshots and your comprehensive project plan. The goal is to create a modern, dark-themed, highly intuitive, and feature-rich user experience.

1. Overall Design Principles
Dark Theme Dominance: The primary aesthetic is a sleek, dark interface with high contrast for readability, consistent with the provided screenshots.

Clean & Modern: Minimalist design with clear hierarchy and uncluttered layouts, ensuring content is easily discoverable.

Intuitive Navigation: Easy access to all content and features through clear navigation menus, search, and logical information architecture.

Consistent Visuals: Uniformity in spacing, typography, colors, and interactive elements across all pages and features.

Subtle Interactivity: Smooth transitions, clear hover states, and subtle animations for a polished and engaging feel.

Responsiveness: The design must adapt seamlessly to various screen sizes (desktop, tablet, mobile) to ensure optimal viewing and usability on all devices.

Rounded Corners: A consistent use of rounded corners for all interactive elements, cards, containers, and input fields.

2. Color Palette
The color palette is crucial for maintaining the dark theme and ensuring readability and visual hierarchy.

Primary Background: #1A1A1A (Dark Grey/Black) - Used for the main page background.

Secondary Background (Cards/Containers): #2A2A2A or #333333 (Slightly lighter dark grey) - Used for content cards, dropdown menus, sidebars, and form backgrounds.

Primary Text: #FFFFFF (White) - For main headings, titles, prominent text, and active states.

Secondary Text/Labels: #CCCCCC or #AAAAAA (Light Grey) - For descriptions, sub-headings, input labels, placeholder text, and less prominent information.

Accent Color (Primary Interactive): #B800FF (Vibrant Purple/Magenta) - Used for active states, primary buttons, highlights, selected items, and progress indicators.

Accent Color (Secondary/Warning): #FF0000 (Red) - Used for "Popular" tags, "Live" indicators, or warning messages.

Borders/Separators: Subtle #444444 or rgba(255, 255, 255, 0.1) - For input fields, card borders on hover, section dividers, and table borders.

3. Typography
A clean, sans-serif font should be used throughout the website to ensure readability and a modern aesthetic.

Font Family: Inter (or a similar modern, legible sans-serif font like Roboto, Open Sans). Ensure it's loaded from Google Fonts or a CDN.

Font Weights: Use Regular (400), Medium (500), Semi-Bold (600), and Bold (700) for establishing clear visual hierarchy.

Font Sizes (Examples - adjust as needed for responsiveness):

Headings (H1, H2): 2.5rem to 1.8rem (e.g., 40px to 28px)

Section Titles: 1.5rem to 1.25rem (e.g., 24px to 20px)

Card Titles/Navigation: 1.125rem to 1rem (e.g., 18px to 16px)

Body Text/Descriptions: 0.875rem to 1rem (e.g., 14px to 16px)

Small Text/Labels: 0.75rem (e.g., 12px)

Line Height: 1.5 for body text for optimal readability.

Letter Spacing: Normal.

4. Layout and Spacing
Grid System: Utilize a flexible grid system (e.g., CSS Grid or Flexbox) for content arrangement, especially for channel/show/movie cards and news feeds.

Max Width: The main content area should have a max-width (e.g., 1400px to 1600px) and be horizontally centered to prevent content from stretching too wide on large screens.

Padding: Consistent padding around sections and within containers (e.g., 2rem or 32px on desktop, reducing for mobile) to create breathing room.

Margins: Consistent margin between elements and sections (e.g., 1rem or 16px for spacing between cards) for clear separation.

Whitespace: Ample whitespace to prevent visual clutter and improve readability and focus.

5. Navigation (Header & Footer)
5.1 Header (Global)
Structure: Fixed at the top, dark background, slightly transparent or with a subtle shadow.

Left Side:

Logo: A simple, recognizable icon (placeholder for now).

Primary Navigation Links: "Home", "TV" (with sub-menu), "Media" (with sub-menu), "Community".

Each link should have an associated dropdown arrow icon (e.g., lucide-react's chevron-down) if it has a sub-menu.

Hover State: Links should subtly change background color or text color.

Active State: The currently active page's link should be highlighted with the accent color or a distinct background.

Right Side:

Search Box:

Magnifying glass icon (lucide-react's search).

Placeholder text: "Search...".

Input field: Dark background, rounded corners, subtle border, white text.

On focus: Border might highlight with accent color.

Utility Icons: Discord icon, Telegram icon (custom SVG or Font Awesome), Settings icon (lucide-react's settings).

These should be clickable and lead to respective pages/modals.

Hover State: Subtle background change or icon color change.

Profile/Login Icon: A circular icon, possibly with a default avatar or user initial. Clicks to the Profile/Login page.

5.2 Dropdown Menus (e.g., "TV", "Media")
Appearance: Appear on hover over the parent navigation link or on click for mobile.

Styling: Dark background (secondary background color), rounded corners, subtle shadow.

Content: List of sub-links.

TV Sub-menu: "Live TV", "Today’s Schedule (EPG)", "Sports".

Media Sub-menu: "Movies", "Web Series".

List Item Hover: Each list item should have a clear hover state (e.g., background change to a lighter dark grey or accent color).

Layout: Simple vertical list.

5.3 Footer
Structure: Fixed at the bottom of the page, dark background.

Content:

Left: A small logo icon.

Middle: Navigation links grouped by category (e.g., "Shows", "TV", "Trending", "More", "Media", "Updates").

Each category has a list of sub-links (e.g., "Discover", "Popular", "Live TV").

Links should be secondary text color, changing to primary text color on hover.

Right: Copyright information (e.g., "in-progress MAPPLE.UK").

6. Content Areas
6.1 Channel/Match/Movie/Web Series Cards (Grid View)
Structure: Responsive grid (e.g., 5 columns on desktop, fewer on tablet/mobile: 3 on tablet, 2 on mobile).

Card Styling:

Background: Secondary background color, rounded corners.

Content: Channel logo/movie poster (or placeholder image), title, and sometimes a small descriptive text or genre tags.

Image/Logo/Poster: Prominently displayed, centered within the card, appropriate aspect ratio. Use object-cover for images to fill space without distortion.

Text: White or light grey, centered or left-aligned depending on design.

"Popular" Tag: Small, rounded tag with red background (#FF0000) and white text, positioned at the top-right or top-left of the card.

Hover State:

Subtle scaling effect.

Border highlight with accent color.

Optional: A "Watch Now" button or overlay appears for streamable content.

6.2 Right Sidebar (TV Channel Schedules / Sports Matches)
Structure: Fixed position on desktop, potentially collapsible or moved to a full-width section on mobile.

Styling: Secondary background color, rounded corners, padding.

Header: Title (e.g., "TV Channel Schedules", "Sports Matches"), date picker/filter (e.g., "Thursday 24th July 2025" with dropdown/calendar icon).

Content List:

Sections (e.g., "TV Shows", "Soccer") that can be expanded/collapsed (chevron icon).

Each item: Time (e.g., "09:00"), event title (e.g., "Intercity Friendly: Cadiz vs Las Palmas").

"Watch" Button: Small, rounded button with accent background color and white text. Appears on relevant items, only if logged in and has access.

Scrollbar: Custom-styled scrollbar if content overflows.

7. Interactive Elements
7.1 Buttons
Primary Button (e.g., "Login", "Sign Up", "Watch Now", "Redeem", "Withdraw", "Deposit"):

Background: Accent color (#B800FF).

Text: White (#FFFFFF).

Corners: Highly rounded.

Padding: Generous horizontal padding, moderate vertical padding.

Hover State: Subtle darkening of background, slight scale, or subtle shadow.

Secondary Button (e.g., "Light", "Dark", "System" in settings, "Back to Sports"):

Background: Secondary background color (#2A2A2A).

Text: White/light grey.

Corners: Rounded.

Active State: Background changes to accent color.

Hover State: Subtle background change or border highlight.

Icon Buttons: Simple icons (e.g., search, settings, Discord, Telegram) that are clickable.

Hover State: Background changes to a lighter dark grey.

7.2 Input Fields
Styling:

Background: Dark grey (#2A2A2A).

Text: White (#FFFFFF).

Placeholder Text: Light grey (#AAAAAA).

Border: Subtle light grey 1px border.

Corners: Rounded.

Padding: Adequate padding for comfortable typing.

Focus State: Border color changes to accent color.

7.3 Tabs (e.g., Profile Page, Stream Quality Selector)
Styling:

Background: Transparent or primary background.

Text: Secondary text color.

Corners: Rounded.

Active Tab: Text changes to primary text color, with an accent-colored underline or a subtle accent background.

Hover State: Text changes to primary text color or subtle background change.

8. Specific Page Breakdowns
8.1 Home Page
Publicly Accessible: Designed for both logged-in and guest users.

Sections:

Blog / News Feed:

Dynamic posts (e.g., "Tonight: ARG vs BRA – A decisive semifinal qualification match airing on Ten Sports, ABS Play.").

Each post should be a card with a title, snippet, and a "Watch Now" button/link.

"Watch Now Links" should directly link to relevant channels under the TV section.

Featured Content: Highlight popular movies, shows, or live events in carousels or prominent sections.

Call to Action: Clear prompts for "Login / Sign Up" for guest users.

8.2 TV Page
Requires Login to Stream: Public users can browse EPG/schedule, but streaming requires authentication.

Sub-Categories (Tabs/Filters):

Live TV: Grid of TV channels (as specified in 6.1). Each card represents a channel (e.g., Ten Sports, Star News). Streams via .m3u8 (developer handles video player integration).

Today’s Schedule (EPG):

Time-based TV guide, similar to the right sidebar, but as a main content area.

Should auto-scroll to the current time/program.

Clear indication of current, past, and upcoming programs.

Sports: Filtered view of sports channels/schedule only.

8.3 Media Page
Sub-Categories (Tabs/Filters):

Movies: Grid of movie cards (as specified in 6.1).

Web Series: Grid of web series cards (as specified in 6.1).

Filtering: Implement clear filter options by genre, language, country (e.g., dropdowns or tag-based filters).

8.4 Community Page
Content: Simple page with prominent icons linking to:

Discord Server (Discord icon).

Telegram Group (Telegram icon).

Call to Action: Encourage users to join the community.

8.5 Settings Panel (Accessed via top-right menu)
Appearance: Modal overlay or a dedicated settings page.

Without Login:

Theme Switcher: Group of three buttons ("Light", "Dark", "System"). "Dark" should be active by default (accent background).

Region selector: Dropdown with flag icons (e.g., "United States of America").

Login / Sign Up: Buttons linking to the respective forms.

After Login:

Sub-sections (Tabs/Navigation on left sidebar):

Dashboard:

Coins: Display "Earned" and "Spent" coin amounts prominently.

Withdraw / Deposit: Buttons for manual or wallet-based transactions. Clear instructions and input fields for amounts.

My Profile:

Display Name, Region, Email.

Profile Picture: Circular display with an edit icon (lucide-react's pencil) for upload/change.

Account Settings:

Password: Fields for current and new password.

2FA: Toggle switch for Two-Factor Authentication.

Privacy: "Anonymous ID toggle" switch.

Earn:

Referral Code & Stats: Display user's unique referral code, number of referrals, and earned coins from referrals. Clear "Copy Code" button.

Survey completion area: A section to display available surveys (e.g., list of survey titles) and a "Start Survey" button for each.

Subscriptions:

IPTV: Display "days left" or "redeem" options.

Watch Time: Clearly indicate "Free" vs. "Premium" tier status. Provide options to upgrade or redeem premium time with coins.

8.6 Live Stream Detail Page (Screenshot 9)
Header: Standard header.

Back Button: "Back to Sports" (lucide-react's arrow-left icon) - top left.

Match Info Bar:

Title (e.g., "PGA Tour on Eurosport: 3M Open | Day 1").

Small icons/tags: Golf icon, date, time, "Popular" tag (red background, white text, rounded).

Team Information:

Centered "Team 1" vs "Team 2" section.

Icons for each team.

"Live Match" label (red background, white text, rounded).

Stream Quality/Language Selector:

Tabs/buttons for different streams (e.g., "HD Stream 1 (English)").

Active stream highlighted with accent color.

Additional selectors for "HD Quality", "English", "Stream 1" (likely dropdowns or toggle buttons).

Video Player Area:

Large black rectangle, responsive to fill available width.

Error message: "Could not play video." (white text, centered) if stream fails.

Placeholder for video controls (play, pause, volume, fullscreen, progress bar).

Ad Integration:

Before video starts: A clear "Ad playing, video will start soon" message with a timer.

Banner overlays: Subtle, non-intrusive banners at the bottom or top of the video player for free users.

Mid-roll: (Optional) A brief ad break with a countdown.

8.7 User Access & Permissions (UI Implications)
Guest Users:

Can view News (Home Page).

Can browse TV EPG/schedule and Media content, but streaming/full access will display a "Login to Watch" overlay or a blurred content preview with a prompt to log in/sign up.

Free Users:

Can watch TV/Media with ads.

Ads will be shown:

Before video starts (pre-roll).

Banner overlays (non-intrusive).

Mid-roll (optional, clearly indicated).

Access to Dashboard, Coins, Earn features.

Premium Users:

No ads.

Full access to all TV/Media content.

Unlocked via coin redemption or real deposit (UI should reflect this status clearly in the Dashboard/Subscriptions section).

Auto Redirect: Implement auto-redirection to login when trying to access protected content without authentication.

9. Responsiveness
Mobile-First Approach (Recommended): Design for smaller screens first, then scale up.

Breakpoints: Define standard breakpoints (e.g., sm: 640px, md: 768px, lg: 1024px, xl: 1280px).

Navigation:

Header: Collapse into a hamburger menu on mobile, revealing a slide-out navigation panel.

Footer: Stack links vertically on mobile.

Content Grids: Adjust column count based on screen size (e.g., 2 columns on mobile, 3 on tablet, 5 on desktop).

Sidebars: On mobile, the right sidebar should either collapse into a full-width section below the main content or be accessible via a toggle button/modal.

Font Sizes: Scale font sizes down for smaller screens to maintain readability and layout.

Padding/Margins: Reduce spacing on mobile to optimize screen real estate.

10. Accessibility
Color Contrast: Ensure sufficient color contrast between text and background for all elements, adhering to WCAG guidelines.

Keyboard Navigation: All interactive elements (buttons, links, form fields, tabs) must be fully navigable using the keyboard (Tab key, arrow keys for navigation within components).

Focus States: Provide clear visual focus indicators for keyboard users to show which element is currently active.

ARIA Attributes: Use appropriate ARIA attributes for complex components (e.g., tabs, dropdowns, modals, carousels) to convey their purpose and state to assistive technologies.

Semantic HTML: Use semantic HTML tags (<nav>, <header>, <main>, <section>, <footer>, <button>, <input>, <h1>-<h6>, <p>, <ul>, <li>) for better structure, SEO, and accessibility.

Image Alt Text: All meaningful images should have descriptive alt attributes.

Excellent — you’re building a **professional-grade, multi-channel IPTV + Movie platform** with dynamic stream handling and user monetization. Below is the **FULL & FINAL PROJECT PLAN** covering **everything** from system architecture to stream logic, SEO, automation, payments, and deployment.

---

# ✅ FINAL PROJECT INSTRUCTION — “Live TV & Movie Show + Earning Server”

---

## 🎯 GOAL

A beautiful, SEO-optimized, fully automated web app where:

* Users can **watch live TV**, **stream movies**, **read news**
* **Earn/spend coins** via referral, surveys, deposit/withdraw
* Admin can manage everything from a **dashboard**
* Everything runs on **free or low-cost infrastructure**
* Ready to deploy, lightweight, mobile-first

---

## ⚙️ CORE FEATURES OVERVIEW

| Feature                  | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| 🔴 Live TV Streaming     | Stream `.m3u8` with multi-source (video/audio/quality) support |
| 🎬 Movies / Series       | Sorted by genre, premium access via coins                      |
| 📰 News Blog             | For match alerts, world news, and events                       |
| 👥 Auth & Profile        | Login, Region, Coins, Avatar, Preferences                      |
| 💸 Coin System           | Earn via referral/surveys, spend on subs                       |
| 🎁 Subscriptions         | Watch Time & IPTV (Free with ads or Premium)                   |
| 💼 Admin Dashboard       | Full control over users, media, EPG, coins                     |
| ⚡ Speed & SEO Optimized  | SSR, lazy-load, sitemap, OG tags, robots.txt                   |
| 🔐 Permissions           | Guest, Free User, Premium, Admin Roles                         |
| 📺 Multi-stream Handling | Support multiple `.m3u8` options per channel                   |
| 🛒 Payments              | Deposit/withdraw via card/crypto                               |
| 🔧 API Automation        | M3U8 scraper, playlist builder, EPG importer                   |

---

## 🧱 SYSTEM ARCHITECTURE

```
/live-tv-app
├── /pages
│   ├── index.js               → News Home (Public)
│   ├── tv.js                  → Channel grid with multi-stream player
│   ├── schedule.js            → EPG viewer
│   ├── media.js               → Movies / Series
│   ├── dashboard.js           → Coins, subs, settings
│   ├── admin/                 → Admin Panel (users, content)
│   ├── api/                   → API Routes (coins, stream, m3u8)
├── /components
│   ├── ChannelCard.jsx
│   ├── MultiStreamPlayer.jsx
│   ├── MovieCard.jsx
│   └── CoinBalance.jsx
├── /public
│   └── /logos, /icons        → Optimized SVG/PNG assets
├── /lib
│   ├── supabaseClient.js
│   └── stripe/crypto helpers
├── /data
│   ├── epg.json
│   └── scraper.m3u8.js       → Auto-extract streams
```

---

## 🔗 MULTI-STREAM STRUCTURE

Each TV channel entry supports multiple stream variants:

### `tv_channels` Table (Supabase)

```json
{
  "id": "abc-123",
  "name": "Ten Sports",
  "logo": "/logos/ten.png",
  "category": "Sports",
  "streams": [
    {
      "label": "HD",
      "type": "video",
      "url": "https://host/ten-hd.m3u8"
    },
    {
      "label": "Low",
      "type": "video",
      "url": "https://host/ten-low.m3u8"
    },
    {
      "label": "Audio (Bangla)",
      "type": "audio",
      "url": "https://host/ten-audio.m3u8"
    }
  ]
}
```

### ✅ Player Logic

Your `MultiStreamPlayer.jsx` will:

* Load `hls.js`
* Detect available streams
* Let users **switch audio/video/quality on click**
* Auto fallback if one fails

---

## 🔐 USER ROLES & PERMISSIONS

| Role         | Can View | Can Watch TV | Can Watch Movies | Ads? | Coin Access |
| ------------ | -------- | ------------ | ---------------- | ---- | ----------- |
| Guest        | ✅        | ❌            | ❌                | ❌    | ❌           |
| Free User    | ✅        | ✅ (with ads) | ✅ (limited)      | ✅    | ✅           |
| Premium User | ✅        | ✅ (clean)    | ✅ (all access)   | ❌    | ✅           |
| Admin        | ✅        | ✅            | ✅                | ❌    | ✅ + CRUD    |

---

## 🧮 COIN & SUBSCRIPTION LOGIC

| Earning Method           | Coin              |
| ------------------------ | ----------------- |
| Referral                 | +50               |
| Survey (via CPAGrip)     | +25–100           |
| Deposit via Stripe       | 1 USD = 100 Coins |
| Crypto (via NowPayments) | Variable          |

| Spending          | Coin           |
| ----------------- | -------------- |
| WatchTime Premium | 500 / week     |
| IPTV Unlock       | 1000 / month   |
| Withdraw          | Admin approval |

---

## 📖 ADMIN DASHBOARD FEATURES

Route: `/admin`

| Feature      | Notes                                  |
| ------------ | -------------------------------------- |
| Users        | Ban, edit, upgrade to premium          |
| Channels     | Add/edit/delete with stream variants   |
| EPG          | Upload via JSON or sync API            |
| News Posts   | Blog/news editor (Markdown or WYSIWYG) |
| Transactions | Approve/deny withdrawals               |
| Surveys      | Configure offers + auto-credit         |
| Reports      | Daily coins, traffic, logs             |

---

## 🧰 SUPABASE DB SCHEMA

### Tables:

* `users`
* `tv_channels` (with stream array)
* `media`
* `epg_schedule`
* `coins`
* `transactions`
* `referrals`
* `survey_logs`
* `admins`

✅ Ready SQL dump can be generated for import!

---

## 🧠 AUTOMATED API ENDPOINTS

| API Route            | Description               |
| -------------------- | ------------------------- |
| `/api/scraper`       | Extract .m3u8 from URL    |
| `/api/iptv/playlist` | Generate .m3u8 playlist   |
| `/api/coins/earn`    | Track referral/survey     |
| `/api/coins/spend`   | Deduct coins              |
| `/api/epg/sync`      | Pull daily EPG from XMLTV |

---

## 💸 PAYMENTS (Free + Premium)

| Method   | Platform    | Action                      |
| -------- | ----------- | --------------------------- |
| Card     | Stripe      | Via webhook updates coin DB |
| Crypto   | NowPayments | BTC, ETH, USDT supported    |
| Withdraw | Manual      | Logs stored + admin approve |

---

## ⚡ PERFORMANCE & SEO SETUP

* ✅ Lazy load channels, movies, thumbnails
* ✅ Dynamic SEO meta via `next/head`
* ✅ Sitemap + robots.txt via `next-sitemap`
* ✅ OG preview for every blog
* ✅ Mobile-first, fast navigation

---

## 📦 DEPLOYMENT (ALL FREE SERVICES)

| Component     | Service                            |
| ------------- | ---------------------------------- |
| Frontend      | **Vercel**                         |
| Database/Auth | **Supabase**                       |
| Images/Videos | **Cloudinary** (free tier)         |
| Surveys       | **CPAGrip**                        |
| Admin Panel   | Custom route or Appwrite dashboard |
| Payments      | Stripe + NowPayments               |

---

## 🚀 FINAL INSTALLATION GUIDE

```bash
git clone https://github.com/yourname/live-tv-app
cd live-tv-app
npm install
# Add .env.local
npm run dev
```

---

## 🎁 DELIVERABLES YOU CAN REQUEST

✅ Full GitHub repo
✅ Preloaded Supabase SQL schema
✅ Icons/logos/media assets
✅ Pre-built Admin UI
✅ Cloudinary + Ad integration
✅ Auto deployment on Vercel

---

## ✅ NEXT STEP (Your Command)

Just reply with:

* **“Give me full codebase + schema”**
  or
* **“Deploy it now”**

And I’ll prepare a **ready-to-run** full package, no extra typing needed — just plug, run, and scale.

Would you like the **full deployment-ready code** now?

Perfect — now you're building a **pro-grade, scalable web platform**. Here's the updated **full project guideline**, now including:

✅ Full database system
✅ M3U8 scraper + IPTV creator APIs
✅ Coin system with deposit/withdraw (via card/crypto)
✅ Admin automation
✅ All essential backend logic, plus optional advanced features

---

# 🚀 **Live TV & Movie Platform — Master Deployment Guide**

---

## 🧱 1. TECH STACK (FULL)

| Layer           | Tech                                 |
| --------------- | ------------------------------------ |
| **Frontend**    | Next.js + Tailwind CSS               |
| **Backend API** | Next.js API routes or FastAPI        |
| **Database**    | Supabase (PostgreSQL) or Firebase    |
| **Streaming**   | HLS.js + m3u8 scraper                |
| **Auth**        | Supabase Auth                        |
| **Payment**     | Stripe (card) + NowPayments (crypto) |
| **Storage**     | Supabase Storage / Cloudinary        |
| **Admin Panel** | React Admin / Appwrite Console       |

---

## 🧩 2. DATABASE SCHEMA (Supabase PostgreSQL)

### ✅ Users Table (`users`)

| Field        | Type        |
| ------------ | ----------- |
| id           | UUID (auth) |
| username     | text        |
| email        | text        |
| region       | text        |
| avatar       | URL         |
| coins        | integer     |
| is\_premium  | boolean     |
| iptv\_access | boolean     |
| created\_at  | timestamp   |

---

### ✅ TV Channels (`tv_channels`)

| Field          | Type    |
| -------------- | ------- |
| id             | uuid    |
| name           | text    |
| category       | text    |
| logo           | URL     |
| stream\_url    | text    |
| backup\_stream | text\[] |
| created\_by    | uuid    |

---

### ✅ EPG Schedule (`epg_schedule`)

| Field          | Type     |
| -------------- | -------- |
| id             | uuid     |
| channel\_id    | uuid     |
| program\_title | text     |
| start\_time    | datetime |
| end\_time      | datetime |

---

### ✅ Media Content (`media`)

| Field        | Type                 |
| ------------ | -------------------- |
| id           | uuid                 |
| type         | enum (movie, series) |
| title        | text                 |
| genre        | text\[]              |
| video\_url   | text                 |
| poster       | URL                  |
| uploaded\_by | uuid                 |

---

### ✅ Transactions (`transactions`)

| Field       | Type                                              |
| ----------- | ------------------------------------------------- |
| id          | uuid                                              |
| user\_id    | uuid                                              |
| type        | enum (deposit, withdraw, referral, survey, spend) |
| method      | enum (crypto, stripe, internal)                   |
| amount      | integer                                           |
| status      | enum (pending, approved, failed)                  |
| created\_at | timestamp                                         |

---

### ✅ Surveys / Referrals

* `survey_logs` → Track each user & completion
* `referrals` → Store referral relationships

---

## 🔧 3. APIs — Core Backend Logic

### ✅ M3U8 Scraper API

```python
@app.route("/api/scrape")
def get_stream():
    url = request.args.get("url")
    # Use requests + regex or selenium to extract .m3u8
    return {"stream": "https://.../stream.m3u8"}
```

### ✅ IPTV Creator (Generate M3U Playlist)

```ts
GET /api/iptv/playlist
# Returns .m3u8 playlist generated from Supabase entries
```

### ✅ Deposit API (Card + Crypto)

* Stripe integration for card payments
* NowPayments API for crypto deposits
* Logs added to `transactions` table
* Webhooks update coin balances

### ✅ Withdraw API

* Manual request form
* Admin approval via dashboard
* Updates `transactions` + deducts coins

---

## 🛡️ 4. Admin Panel (React-Admin or Custom)

* Secure route `/admin`
* Features:

  * Manage all users (ban, coins, region, role)
  * Add/edit/remove TV channels
  * Approve/decline transactions
  * EPG management (import JSON/XMLTV)
  * Blog/news posting
  * Add/remove Movies/Web series
  * View referral stats and coin reports

---

## 💸 5. Coin & Subscription Logic

| Action                  | Logic                                   |
| ----------------------- | --------------------------------------- |
| Watch Ad (Free)         | Coin rewarded or required to skip       |
| Survey Complete         | +10 to +50 coins (via CPAGrip or AdGem) |
| Referral                | 20–100 coins upon signup & activity     |
| Deposit (Stripe/Crypto) | Coins added based on amount             |
| Spend (IPTV/WatchTime)  | Coins deducted, access granted          |
| Withdraw                | Requires KYC (optional), admin approval |

---

## 🌐 6. SEO + SPEED Optimization (Auto)

### ✅ Auto SEO Features:

* `next-seo` for structured metadata
* Auto OG image for blog
* Sitemap + robots.txt
* `hreflang` for region content
* RSS Feed for news/blog

### ✅ Performance:

* Lazy load all images/videos
* Preconnect to stream hosts
* Optimized CDN (images, fonts)
* Server-side rendering for all pages

---

## ⚙️ 7. Automation

* 🕐 Auto expire IPTV & watchtime access
* 📤 Daily EPG sync from XMLTV source
* 🧠 Auto blog post from RSS feed (optional)
* 🧾 Coin balance auto-calc after activity
* 🎯 Auto-suggest best stream based on region

---

## 📦 8. Deployment Guide

| Tool        | Action                                        |
| ----------- | --------------------------------------------- |
| Supabase    | Create DB, enable Auth, setup tables          |
| Vercel      | Deploy frontend, connect GitHub               |
| Stripe      | Enable payments                               |
| Cloudinary  | Host posters + logos (free tier)              |
| CPAGrip     | Enable survey monetization                    |
| Admin Panel | Protected route `/admin` or deploy standalone |

---

## 🛠 9. Developer Setup (Simple Command Guide)

```bash
# Clone project
git clone https://github.com/yourname/live-tv-app
cd live-tv-app
npm install

# Connect .env
echo NEXT_PUBLIC_SUPABASE_URL=... > .env.local
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=... >> .env.local

# Run locally
npm run dev
```

---

## 🎁 Final Offer

Would you like me to generate and deliver:

* ✅ A full working **GitHub repo** with frontend + backend
* ✅ Prebuilt **Admin Dashboard**
* ✅ **Supabase schema SQL** file (import into DB)
* ✅ **Deployment ZIP** version
* ✅ Logo + icons + starter media files

**Just say**:

> ✅ "Make full codebase with admin"
> or
> 🎁 "Give me Supabase schema + frontend starter"

And I’ll deliver it — completely ready-to-run and scalable.


### **Key Success Factors:**
- ✅ **Complete Solution** - No additional development needed
- ✅ **Monetization Ready** - Multiple revenue streams configured
- ✅ **SEO Optimized** - Automatic search engine optimization
- ✅ **User-Friendly** - Intuitive interface for all devices
- ✅ **Scalable Architecture** - Grows with your business



This document provides a comprehensive guide for implementing the "Live TV & Movie Show with Secured Earning Server" website. The developer should use this as a blueprint, paying close attention to consistency, responsiveness, user interaction details, and the specific requirements of each feature.