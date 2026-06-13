# 🚀 SKYNZ 2.0 - Creator Command Page Platform

> **Your Page. Your Vibe. Your Stage.**

SKYNZ 2.0 is a revolutionary creator platform that empowers content creators to own their destiny. Build custom landing pages, manage multiple streaming platforms, monetize your audience, and mint collectible NFT badges—all in one unified command center.

## 🎯 What is SKYNZ 2.0?

SKYNZ 2.0 is a **full-stack web application** designed for modern creators who want to:

- 🎬 **Own Their Presence** — Create custom creator pages without platform dependency
- 💰 **Maximize Earnings** — 95% revenue share on page sales and monetization
- 🌍 **Reach Everywhere** — Integrate 11+ streaming platforms in one place
- 🎖️ **Build Community** — Mint collectible NFT badges on Solana blockchain
- 📊 **Track Performance** — Real-time analytics and audience insights
- 💬 **Engage Live** — Real-time chat with your audience

## ✨ Key Features

### 🎨 Creator Dashboard
- Intuitive creator profile management
- Customizable avatar and bio
- Social media integration
- Account settings and preferences

### 📄 SKYNZ Page Builder
- **Drag-and-drop page creation** (coming soon)
- **11+ Platform Integration**: YouTube, Spotify, Twitch, Instagram, TikTok, Discord, Patreon, Twitter, Facebook, SoundCloud, Website
- **Embedded Media** — YouTube videos, Spotify playlists, live streams
- **Custom Branding** — Colors, fonts, layouts
- **Affiliate Links** — Monetize with partner links
- **Support Links** — Direct monetization buttons

### 💬 Live Chat System
- **Real-time WebSocket chat** on creator pages
- **Live viewer count** and engagement metrics
- **Message moderation** (coming soon)
- **Chat history** and analytics

### 📊 Advanced Analytics
- **Page Views** — Track daily, weekly, monthly trends
- **Unique Visitors** — Geographic and demographic data
- **Watch Time** — Total engagement duration
- **Chat Metrics** — Message count and engagement
- **Conversion Tracking** — Link clicks and monetization

### 🎖️ NFT Badge System
- **Collectible Badges** — Creator-specific NFTs on Solana
- **Badge Types**: Founder, Gold Creator, Platinum Founder, Legendary Collectible, Silver Dashboard
- **Blockchain Verification** — Transparent ownership
- **Secondary Market** — Trade badges on Solana marketplaces
- **Utility** — Special perks and access for badge holders

### 🔐 Authentication & Security
- **JWT-based authentication** — Secure login/registration
- **Password hashing** — bcrypt encryption
- **Protected routes** — Role-based access control
- **Session management** — Persistent login

### 🌐 Multi-Platform Streaming
- **Restream.io Integration** — Stream to multiple platforms simultaneously
- **Platform API Keys** — Connect all your accounts
- **Unified Dashboard** — Manage all platforms from one place
- **Cross-platform Analytics** — Aggregate data across all channels

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js 16+** | Runtime environment |
| **Express.js** | Web framework |
| **PostgreSQL 12+** | Database |
| **Socket.io** | Real-time WebSocket communication |
| **JWT** | Authentication & authorization |
| **bcryptjs** | Password hashing |
| **Solana Web3.js** | Blockchain NFT integration |
| **Multer** | File upload handling |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **React Router v6** | Client-side routing |
| **Zustand** | State management |
| **Tailwind CSS** | Styling |
| **Chart.js** | Analytics visualization |
| **Socket.io Client** | Real-time communication |
| **React Hot Toast** | Notifications |
| **React Icons** | Icon library |

### Deployment
- **Backend**: AWS EC2, Heroku, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS, Heroku Postgres
- **Storage**: AWS S3, Cloudinary

## 📋 Project Structure

```
skynz-2.0/
├── backend/
│   ├── server.js                 # Express server & routes
│   ├── database.sql              # PostgreSQL schema
│   ├── package.json              # Dependencies
│   ├── .env.example              # Environment template
│   └── README.md                 # Backend docs
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app component
│   │   ├── index.jsx             # Entry point
│   │   ├── pages/                # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── PageBuilderPage.jsx
│   │   │   ├── PublicCreatorPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── CreatorProfilePage.jsx
│   │   ├── components/           # Reusable components
│   │   │   ├── Navigation.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── store/                # Zustand stores
│   │   │   └── authStore.js
│   │   └── index.css             # Global styles
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── package.json              # Dependencies
│   ├── tailwind.config.js        # Tailwind config
│   ├── .env.example              # Environment template
│   └── README.md                 # Frontend docs
├── README.md                     # This file
└── LICENSE                       # MIT License
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- PostgreSQL 12 or higher
- npm or yarn package manager
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file with:
# - Database connection string
# - JWT secret
# - API keys (Spotify, YouTube, Twitch, etc.)
# - Solana configuration

# Initialize database
psql -U postgres -d postgres -f database.sql

# Start development server
npm run dev

# Server runs on http://localhost:3000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file with:
# - REACT_APP_API_URL=http://localhost:3000

# Start development server
npm start

# App opens at http://localhost:3000
```

## 🔑 Required API Keys

To use all features, you'll need:

### Streaming Platforms
```
SPOTIFY_API_KEY          # Spotify Web API
YOUTUBE_API_KEY          # YouTube Data API v3
TWITCH_API_KEY           # Twitch API
INSTAGRAM_API_KEY        # Instagram Graph API
TIKTOK_API_KEY           # TikTok API
RESTREAM_API_KEY         # Restream.io API
```

### Blockchain
```
SOLANA_RPC_URL           # Solana mainnet RPC endpoint
SOLANA_PRIVATE_KEY       # Your Solana wallet private key
```

### Cloud Storage (Optional)
```
AWS_ACCESS_KEY_ID        # AWS credentials
AWS_SECRET_ACCESS_KEY    # AWS credentials
AWS_REGION               # AWS region
AWS_S3_BUCKET            # S3 bucket name
```

## 📚 API Documentation

### Authentication Endpoints

#### Register Creator
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "creator@example.com",
  "password": "secure_password",
  "name": "Creator Name",
  "handle": "creator_handle"
}

Response: { token, creator }
```

#### Login Creator
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "creator@example.com",
  "password": "secure_password"
}

Response: { token, creator }
```

### Creator Profile Endpoints

#### Get Profile
```http
GET /api/creator/profile
Authorization: Bearer {token}

Response: { id, name, handle, bio, avatar_url, created_at }
```

#### Update Profile
```http
PUT /api/creator/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Name",
  "bio": "New bio",
  "avatar_url": "https://..."
}

Response: { id, name, handle, bio, avatar_url }
```

### Page Management Endpoints

#### Create Page
```http
POST /api/pages
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Night Vibe Lounge",
  "handle": "night-vibe",
  "description": "A late-night lounge...",
  "platforms": ["youtube", "spotify", "twitch"],
  "embed_url": "https://www.youtube.com/embed/...",
  "affiliate_link": "https://skynz.link/night-vibe"
}

Response: { success: true, page }
```

#### Get Creator's Pages
```http
GET /api/pages
Authorization: Bearer {token}

Response: [{ id, title, handle, description, ... }]
```

#### Get Public Page
```http
GET /api/pages/:handle

Response: { id, title, handle, description, platforms, ... }
```

#### Update Page
```http
PUT /api/pages/:pageId
Authorization: Bearer {token}
Content-Type: application/json

Response: { id, title, handle, description, ... }
```

#### Delete Page
```http
DELETE /api/pages/:pageId
Authorization: Bearer {token}

Response: { success: true }
```

### Analytics Endpoints

#### Get Page Analytics
```http
GET /api/analytics/:pageId
Authorization: Bearer {token}

Response: [{ id, event_type, visitor_count, watch_time, created_at }]
```

#### Record Page View
```http
POST /api/analytics/view
Content-Type: application/json

{
  "pageId": "page-uuid"
}

Response: { success: true }
```

### Badge Endpoints

#### Get Creator Badges
```http
GET /api/badges
Authorization: Bearer {token}

Response: [{ id, badge_type, mint_address, created_at }]
```

#### Mint Badge
```http
POST /api/badges/mint
Authorization: Bearer {token}
Content-Type: application/json

{
  "badgeType": "founder"
}

Response: { success: true, badge }
```

## 🔌 WebSocket Events

### Real-Time Chat

#### Client Events
```javascript
// Join a page's chat room
socket.emit('join_page', 'page-handle');

// Send a message
socket.emit('send_message', {
  pageHandle: 'page-handle',
  username: 'Your Name',
  message: 'Hello everyone!'
});
```

#### Server Events
```javascript
// New message received
socket.on('new_message', (data) => {
  // { id, username, message, timestamp }
});

// User joined chat
socket.on('user_joined', (data) => {
  // { message, timestamp }
});

// User left chat
socket.on('user_left', (data) => {
  // { message, timestamp }
});
```

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Purple | `#9333ea` | Buttons, accents |
| Secondary Pink | `#ec4899` | Highlights, gradients |
| Accent Cyan | `#06b6d4` | Links, interactive |
| Background Black | `#000000` | Main background |
| Surface | `#1a1a2e` | Cards, panels |
| Border | `#9333ea33` | Borders, dividers |

### Typography
- **Headings**: Space Grotesk, Bold (32px-48px)
- **Body**: Inter, Regular (14px-16px)
- **Code**: Monospace, Regular (12px-14px)

### Spacing
- Base unit: 4px
- Padding: 4px, 8px, 12px, 16px, 24px, 32px
- Margin: Same as padding
- Gap: 8px, 12px, 16px, 24px

## 🔐 Security

### Best Practices Implemented
- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React escaping)
- ✅ HTTPS enforcement (production)
- ✅ Environment variable management
- ✅ Rate limiting (recommended for production)

### Security Checklist
- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS only in production
- [ ] Set secure CORS origins
- [ ] Enable database backups
- [ ] Implement rate limiting
- [ ] Add API request validation
- [ ] Enable CSRF protection
- [ ] Regular security audits

## 📈 Performance

### Optimization Features
- ✅ React lazy loading
- ✅ Code splitting with React Router
- ✅ Zustand for efficient state management
- ✅ Database query optimization with indexes
- ✅ WebSocket connection pooling
- ✅ Frontend minification & bundling
- ✅ Image optimization (coming soon)
- ✅ CDN support ready

### Performance Targets
- Page load: < 2 seconds
- API response: < 200ms
- Chat latency: < 100ms
- Analytics update: Real-time

## 🚀 Deployment

### Backend Deployment (Heroku Example)

```bash
# Create Heroku app
heroku create skynz-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set SPOTIFY_API_KEY=your-key
# ... other keys

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=https://skynz-backend.herokuapp.com

# Auto-deploys on push to main
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL format
# postgresql://user:password@localhost:5432/dbname
```

**Socket.io Connection Failed**
```bash
# Check CORS settings in server.js
# Verify FRONTEND_URL in .env matches your frontend URL
```

**API 401 Unauthorized**
```bash
# Check token is being sent in Authorization header
# Verify JWT_SECRET matches between login and protected routes
```

**Page Not Found (404)**
```bash
# Verify page handle exists in database
# Check URL format: /creator/page-handle
```

## 📊 Database Schema

### Key Tables
- **creators** — Creator accounts and profiles
- **pages** — Creator landing pages
- **analytics** — Page views and engagement data
- **chat_messages** — Real-time chat messages
- **badges** — NFT badge ownership
- **streaming_integrations** — API key storage

See `backend/database.sql` for complete schema.

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Support

For issues, questions, or suggestions:
- 📧 Email: support@skynz.io
- 💬 Discord: [Join our community](https://discord.gg/skynz)
- 🐛 GitHub Issues: [Report a bug](https://github.com/skynz/skynz-2.0/issues)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Creator profiles
- ✅ Page builder
- ✅ Live chat
- ✅ Analytics dashboard
- ✅ NFT badges

### Phase 2 (Q2 2024)
- 🔄 Drag-and-drop page builder
- 🔄 Advanced analytics
- 🔄 Payment processing
- 🔄 Creator marketplace

### Phase 3 (Q3 2024)
- 🔄 Mobile app (iOS/Android)
- 🔄 AI-powered recommendations
- 🔄 Creator collaboration tools
- 🔄 Enterprise features

## 📞 Contact

- **Website**: https://skynz.io
- **Twitter**: [@skynz_io](https://twitter.com/skynz_io)
- **Instagram**: [@skynz_io](https://instagram.com/skynz_io)
- **Discord**: [Join Community](https://discord.gg/skynz)

---

**SKYNZ 2.0** — Your Page. Your Vibe. Your Stage. 🚀

Built with ❤️ for creators by creators.

**Version**: 2.0.0  
**Last Updated**: June 2024  
**Status**: Production Ready
