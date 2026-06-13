# SKYNZ - Creator Command Page Platform

A full-stack web application for creators to build their own command pages, manage multiple streaming platforms, and monetize their content.

## 🚀 Features

- **Creator Profiles** - Build your creator profile with bio, avatar, and social links
- **SKYNZ Pages** - Create custom landing pages with embedded media and platform links
- **Multi-Platform Integration** - Connect YouTube, Spotify, Twitch, Instagram, TikTok, Discord, Patreon, and more
- **Live Chat** - Real-time chat on creator pages using WebSockets
- **Analytics Dashboard** - Track page views, watch time, and visitor data
- **NFT Badges** - Mint collectible badges on Solana blockchain
- **Responsive Design** - Dark cyberpunk aesthetic with neon accents

## 📁 Project Structure

```
/app
├── /backend          # Node.js Express API server
│   ├── server.js     # Main server file
│   ├── database.sql  # Database schema
│   ├── package.json  # Dependencies
│   └── .env.example  # Environment variables template
├── /frontend         # React web application
│   ├── /src
│   │   ├── App.jsx   # Main app component
│   │   ├── /pages    # Page components
│   │   ├── /components # Reusable components
│   │   ├── /store    # Zustand state management
│   │   └── index.jsx # Entry point
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** for database
- **Socket.io** for real-time features
- **JWT** for authentication
- **Solana Web3.js** for NFT integration

### Frontend
- **React 18** with React Router
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Chart.js** for analytics
- **Socket.io Client** for real-time chat

## 📋 Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn
- Git

## 🚀 Installation

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=postgresql://user:password@localhost:5432/skynz
# JWT_SECRET=your-secret-key
# SPOTIFY_API_KEY=your-spotify-key
# YOUTUBE_API_KEY=your-youtube-key
# etc...

# Create database
psql -U postgres -d postgres -f database.sql

# Start server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URL
# REACT_APP_API_URL=http://localhost:3000

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🔑 API Keys Required

Add these to your backend `.env` file:

```
# Streaming Platforms
SPOTIFY_API_KEY=YOUR_KEY_HERE
YOUTUBE_API_KEY=YOUR_KEY_HERE
TWITCH_API_KEY=YOUR_KEY_HERE
INSTAGRAM_API_KEY=YOUR_KEY_HERE
TIKTOK_API_KEY=YOUR_KEY_HERE
RESTREAM_API_KEY=YOUR_KEY_HERE

# Blockchain
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE

# AWS (optional, for file uploads)
AWS_ACCESS_KEY_ID=YOUR_KEY_HERE
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_HERE
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new creator account
- `POST /api/auth/login` - Login creator

### Creator Profile
- `GET /api/creator/profile` - Get creator profile
- `PUT /api/creator/profile` - Update creator profile

### Pages
- `POST /api/pages` - Create new page
- `GET /api/pages` - Get creator's pages
- `GET /api/pages/:handle` - Get public page
- `PUT /api/pages/:pageId` - Update page
- `DELETE /api/pages/:pageId` - Delete page

### Analytics
- `GET /api/analytics/:pageId` - Get page analytics
- `POST /api/analytics/view` - Record page view

### Badges
- `GET /api/badges` - Get creator's badges
- `POST /api/badges/mint` - Mint new badge

## 🔌 WebSocket Events

### Client → Server
- `join_page` - Join a page's chat room
- `send_message` - Send chat message

### Server → Client
- `new_message` - New chat message received
- `user_joined` - User joined chat
- `user_left` - User left chat

## 🎨 Design System

### Colors
- **Primary**: `#9333ea` (Purple)
- **Secondary**: `#ec4899` (Pink)
- **Accent**: `#06b6d4` (Cyan)
- **Background**: `#000000` (Black)

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter

## 📦 Deployment

### Backend (AWS/Heroku)

```bash
# Build
npm run build

# Deploy
# Push to your hosting platform
```

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy
# Connect your GitHub repo to Vercel/Netlify
```

## 🔐 Security Notes

- Never commit `.env` files
- Always use HTTPS in production
- Rotate JWT secrets regularly
- Use environment variables for all sensitive data
- Implement rate limiting on API endpoints
- Validate all user inputs

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
```

### Socket.io Connection Error
```bash
# Check CORS settings in server.js
# Ensure frontend URL matches FRONTEND_URL in .env
```

### API Errors
```bash
# Check backend logs
# Verify all API keys are set in .env
# Test endpoints with Postman
```

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
SPOTIFY_API_KEY=...
YOUTUBE_API_KEY=...
# ... other API keys
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000
```

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review API endpoints
3. Check browser console for errors
4. Check backend logs

## 📄 License

MIT License - Feel free to use this project

## 🙏 Credits

Built with ❤️ for creators

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
