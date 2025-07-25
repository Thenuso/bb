# 📚 Complete API Documentation

## Base URL
```
https://your-domain.com/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "unique_username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "country": "US",
  "referralCode": "OPTIONAL_REF_CODE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "unique_username",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "identifier": "user@example.com", // email or username
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "coins": 100,
      "isPremium": false
    },
    "token": "jwt_token_here"
  }
}
```

### GET /auth/profile
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "coins": 150,
    "isPremium": true,
    "premiumExpires": "2024-12-31T23:59:59.000Z",
    "watchHistory": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /auth/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "country": "CA",
  "preferences": {
    "language": "en",
    "autoplay": true,
    "quality": "auto"
  }
}
```

### POST /auth/change-password
Change user password (requires authentication).

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

---

## 📺 Channel Endpoints

### GET /channels
Get list of TV channels with filtering and pagination.

**Query Parameters:**
- `category` (string): Filter by category (sports, news, entertainment, etc.)
- `premium_only` (boolean): Filter premium channels
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `search` (string): Search by channel name

**Example Request:**
```
GET /api/channels?category=sports&premium_only=false&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "channels": [
      {
        "id": "uuid",
        "name": "ESPN",
        "description": "Sports Network",
        "category": "sports",
        "logoUrl": "https://example.com/logo.png",
        "isPremium": false,
        "isActive": true,
        "viewers": 1250,
        "schedule": [
          {
            "time": "20:00",
            "title": "NBA Game",
            "description": "Lakers vs Warriors"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### GET /channels/:id
Get detailed information about a specific channel.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ESPN",
    "description": "The Worldwide Leader in Sports",
    "category": "sports",
    "logoUrl": "https://example.com/logo.png",
    "isPremium": false,
    "isActive": true,
    "viewers": 1250,
    "streamUrls": {
      "hls": "https://stream.example.com/espn.m3u8",
      "backup": "https://backup.example.com/espn.m3u8"
    },
    "schedule": [
      {
        "startTime": "2024-01-01T20:00:00.000Z",
        "endTime": "2024-01-01T22:00:00.000Z",
        "title": "NBA Game",
        "description": "Lakers vs Warriors"
      }
    ]
  }
}
```

### GET /channels/:id/stream
Get streaming URL for a channel (requires authentication and sufficient permissions).

**Response:**
```json
{
  "success": true,
  "data": {
    "streamUrl": "https://authenticated-stream.example.com/espn.m3u8",
    "expiresAt": "2024-01-01T22:00:00.000Z",
    "qualityOptions": [
      {
        "quality": "1080p",
        "url": "https://stream.example.com/espn_1080p.m3u8"
      },
      {
        "quality": "720p",
        "url": "https://stream.example.com/espn_720p.m3u8"
      }
    ]
  }
}
```

### GET /channels/categories
Get all available channel categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "sports",
      "displayName": "Sports",
      "channelCount": 25,
      "icon": "sports-icon.svg"
    },
    {
      "name": "news",
      "displayName": "News",
      "channelCount": 15,
      "icon": "news-icon.svg"
    }
  ]
}
```

---

## 🎬 Content Endpoints

### GET /content
Get movies, series, and other video content.

**Query Parameters:**
- `type` (string): movie, series, documentary
- `genre` (string): action, comedy, drama, etc.
- `year` (number): Release year
- `rating` (string): G, PG, PG-13, R
- `premium_only` (boolean): Filter premium content
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by title

**Example Request:**
```
GET /api/content?type=movie&genre=action&year=2023&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "title": "Action Movie",
        "type": "movie",
        "genre": "action",
        "year": 2023,
        "rating": "PG-13",
        "duration": 120,
        "description": "An exciting action movie",
        "posterUrl": "https://example.com/poster.jpg",
        "trailerUrl": "https://example.com/trailer.mp4",
        "isPremium": false,
        "averageRating": 4.5,
        "totalRatings": 1250
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### GET /content/:id
Get detailed information about specific content.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Action Movie",
    "type": "movie",
    "genre": "action",
    "year": 2023,
    "rating": "PG-13",
    "duration": 120,
    "description": "A detailed description of the movie...",
    "posterUrl": "https://example.com/poster.jpg",
    "backdropUrl": "https://example.com/backdrop.jpg",
    "trailerUrl": "https://example.com/trailer.mp4",
    "streamUrl": "https://stream.example.com/movie.m3u8",
    "isPremium": false,
    "cast": ["Actor 1", "Actor 2"],
    "director": "Director Name",
    "averageRating": 4.5,
    "totalRatings": 1250,
    "subtitles": [
      {
        "language": "en",
        "url": "https://example.com/subtitles_en.vtt"
      }
    ]
  }
}
```

### GET /content/:id/stream
Get streaming URL for content (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "streamUrl": "https://authenticated-stream.example.com/movie.m3u8",
    "expiresAt": "2024-01-01T22:00:00.000Z",
    "qualityOptions": [
      {
        "quality": "4K",
        "url": "https://stream.example.com/movie_4k.m3u8"
      },
      {
        "quality": "1080p",
        "url": "https://stream.example.com/movie_1080p.m3u8"
      }
    ],
    "subtitles": [
      {
        "language": "en",
        "label": "English",
        "url": "https://example.com/subtitles_en.vtt"
      }
    ]
  }
}
```

### POST /content/:id/watch
Record that user watched content (for analytics and recommendations).

**Request Body:**
```json
{
  "watchTime": 3600, // seconds watched
  "totalDuration": 7200, // total content duration
  "completed": false
}
```

### POST /content/:id/rate
Rate content (requires authentication).

**Request Body:**
```json
{
  "rating": 4.5, // 1-5 stars
  "review": "Great movie!"
}
```

---

## 💳 Payment Endpoints

### POST /payments/stripe/create-payment-intent
Create Stripe payment intent for purchasing coins.

**Request Body:**
```json
{
  "amount": 1000, // amount in cents
  "coins": 1000,  // coins to purchase
  "currency": "usd"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234_secret_xyz",
    "amount": 1000,
    "coins": 1000
  }
}
```

### POST /payments/stripe/webhook
Stripe webhook endpoint for payment confirmation.

### POST /payments/crypto/generate-address
Generate cryptocurrency payment address.

**Request Body:**
```json
{
  "currency": "BTC", // BTC, ETH, USDT
  "amount_usd": 10.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "amount": "0.00025",
    "currency": "BTC",
    "qr_code": "data:image/png;base64,iVBORw0...",
    "expires_at": "2024-01-01T22:00:00.000Z"
  }
}
```

### GET /payments/transactions
Get user's transaction history (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): purchase, refund, earning
- `status` (string): pending, completed, failed

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "purchase",
        "amount": 10.00,
        "coins": 1000,
        "currency": "USD",
        "status": "completed",
        "paymentMethod": "stripe",
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

## 🎁 Referral Endpoints

### GET /referrals/code
Get user's referral code (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "USER123REF",
    "totalReferrals": 5,
    "totalEarnings": 500,
    "shareUrl": "https://your-domain.com/register?ref=USER123REF"
  }
}
```

### GET /referrals/stats
Get referral statistics (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReferrals": 10,
    "activeReferrals": 8,
    "totalEarnings": 1000,
    "thisMonthEarnings": 250,
    "referrals": [
      {
        "username": "referred_user",
        "joinedAt": "2024-01-01T12:00:00.000Z",
        "earnings": 100,
        "isActive": true
      }
    ]
  }
}
```

---

## 📊 EPG (Electronic Program Guide) Endpoints

### GET /epg
Get electronic program guide data.

**Query Parameters:**
- `channel_id` (string): Specific channel ID
- `date` (string): Date in YYYY-MM-DD format
- `hours` (number): Number of hours from now (default: 24)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "channelId": "uuid",
      "channelName": "ESPN",
      "programs": [
        {
          "id": "uuid",
          "title": "NBA Game",
          "description": "Lakers vs Warriors",
          "startTime": "2024-01-01T20:00:00.000Z",
          "endTime": "2024-01-01T22:30:00.000Z",
          "category": "sports",
          "rating": "TV-G"
        }
      ]
    }
  ]
}
```

### GET /epg/now-playing
Get currently playing programs across all channels.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "channelId": "uuid",
      "channelName": "ESPN",
      "currentProgram": {
        "title": "NBA Game",
        "description": "Lakers vs Warriors",
        "startTime": "2024-01-01T20:00:00.000Z",
        "endTime": "2024-01-01T22:30:00.000Z",
        "progress": 45 // percentage completed
      }
    }
  ]
}
```

---

## 🎯 Survey Endpoints

### GET /surveys/available
Get available surveys for earning coins (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Consumer Survey",
      "description": "Share your shopping preferences",
      "reward": 50,
      "estimatedTime": 10,
      "provider": "cpagrip",
      "url": "https://cpagrip.com/survey/123"
    }
  ]
}
```

### POST /surveys/:id/complete
Mark survey as completed and award coins.

**Request Body:**
```json
{
  "completionCode": "SURVEY123COMPLETED"
}
```

---

## 👨‍💼 Admin Endpoints

### GET /admin/dashboard
Get admin dashboard statistics (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 10000,
      "active": 8500,
      "premium": 2500,
      "newToday": 150
    },
    "content": {
      "totalChannels": 250,
      "totalMovies": 5000,
      "totalSeries": 1500
    },
    "revenue": {
      "today": 2500.50,
      "thisMonth": 75000.00,
      "totalRevenue": 500000.00
    },
    "streaming": {
      "activeViewers": 1250,
      "peakViewers": 3500,
      "totalViews": 1000000
    }
  }
}
```

### GET /admin/users
Get list of users with admin controls.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by email/username
- `filter` (string): active, premium, banned

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "username": "username",
        "firstName": "John",
        "lastName": "Doe",
        "coins": 500,
        "isPremium": true,
        "isActive": true,
        "lastLogin": "2024-01-01T12:00:00.000Z",
        "createdAt": "2023-06-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 10000,
      "totalPages": 200
    }
  }
}
```

### PUT /admin/users/:id
Update user details (admin only).

**Request Body:**
```json
{
  "coins": 1000,
  "isPremium": true,
  "premiumExpires": "2024-12-31T23:59:59.000Z",
  "isActive": true
}
```

### GET /admin/content
Get content management interface.

### POST /admin/content
Upload new content (admin only).

### GET /admin/transactions
Get all transactions for admin review.

---

## 📱 IPTV Endpoints

### GET /iptv/playlist
Generate M3U playlist for IPTV apps (requires authentication).

**Query Parameters:**
- `format` (string): m3u, m3u8
- `category` (string): Filter by category
- `premium` (boolean): Include premium channels

**Response:**
```
#EXTM3U
#EXTINF:-1 tvg-id="espn" tvg-name="ESPN" tvg-logo="logo.png" group-title="Sports",ESPN
https://stream.example.com/espn.m3u8
#EXTINF:-1 tvg-id="cnn" tvg-name="CNN" tvg-logo="logo.png" group-title="News",CNN
https://stream.example.com/cnn.m3u8
```

### GET /iptv/epg
Generate EPG XML for IPTV apps.

**Response:** XML EPG data compatible with IPTV applications.

---

## ❤️ Health & Monitoring Endpoints

### GET /health
Basic health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 86400,
  "version": "1.0.0"
}
```

### GET /health/detailed
Detailed health check with system information (admin only).

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "stripe": "healthy",
    "storage": "healthy"
  },
  "metrics": {
    "activeUsers": 1250,
    "memoryUsage": "512MB",
    "cpuUsage": "25%",
    "diskUsage": "45%"
  }
}
```

---

## 🚫 Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details if available"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Invalid request data
- `AUTHENTICATION_REQUIRED` - Missing or invalid authentication
- `AUTHORIZATION_FAILED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PAYMENT_FAILED` - Payment processing error
- `INSUFFICIENT_COINS` - Not enough coins for operation
- `SERVER_ERROR` - Internal server error

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🔒 Rate Limiting

API endpoints are rate limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Authentication endpoints**: 5 requests per minute
- **Payment endpoints**: 10 requests per minute
- **Admin endpoints**: 200 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 📝 API Versioning

Current API version: `v1`

All endpoints are prefixed with `/api/v1/` but `/api/` is also supported for backward compatibility.

Future versions will be accessible via `/api/v2/`, etc.

---

## 🔧 SDK & Integration

### JavaScript SDK Example

```javascript
class BulldogStreamAPI {
  constructor(baseUrl, token = null) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    return await response.json();
  }

  // Authentication
  async login(identifier, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    
    if (response.success) {
      this.token = response.data.token;
    }
    
    return response;
  }

  // Get channels
  async getChannels(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/channels?${query}`);
  }

  // Get stream URL
  async getChannelStream(channelId) {
    return await this.request(`/channels/${channelId}/stream`);
  }
}

// Usage
const api = new BulldogStreamAPI('https://your-domain.com');
await api.login('user@example.com', 'password');
const channels = await api.getChannels({ category: 'sports' });
```

---

**Last Updated:** January 2024  
**API Version:** 1.0.0
