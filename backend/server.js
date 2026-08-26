import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/skynz'
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ==================== AUTHENTICATION ROUTES ====================

// Register Creator
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, handle } = req.body;
    
    if (!email || !password || !name || !handle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if creator exists
    const existingCreator = await pool.query(
      'SELECT * FROM creators WHERE email = $1 OR handle = $2',
      [email, handle]
    );

    if (existingCreator.rows.length > 0) {
      return res.status(400).json({ error: 'Email or handle already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const creatorId = uuidv4();

    // Create creator
    const result = await pool.query(
      `INSERT INTO creators (id, email, password, name, handle, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, email, name, handle`,
      [creatorId, email, hashedPassword, name, handle]
    );

    // Create JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      creator: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login Creator
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query(
      'SELECT * FROM creators WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const creator = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, creator.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: creator.id, email: creator.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      creator: {
        id: creator.id,
        email: creator.email,
        name: creator.name,
        handle: creator.handle
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==================== MIDDLEWARE: VERIFY TOKEN ====================

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.creatorId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ==================== CREATOR PROFILE ROUTES ====================

// Get Creator Profile
app.get('/api/creator/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, handle, bio, avatar_url, created_at FROM creators WHERE id = $1',
      [req.creatorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Creator Profile
app.put('/api/creator/profile', verifyToken, async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;

    const result = await pool.query(
      `UPDATE creators 
       SET name = COALESCE($1, name), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4
       RETURNING id, name, handle, bio, avatar_url`,
      [name, bio, avatar_url, req.creatorId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ==================== SKYNZ PAGE ROUTES ====================

// Create SKYNZ Page
app.post('/api/pages', verifyToken, async (req, res) => {
  try {
    const { title, handle, description, platforms } = req.body;
    const pageId = uuidv4();

    const result = await pool.query(
      `INSERT INTO pages (id, creator_id, title, handle, description, platforms, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [pageId, req.creatorId, title, handle, description, JSON.stringify(platforms || [])]
    );

    res.json({
      success: true,
      page: result.rows[0]
    });
  } catch (error) {
    console.error('Page creation error:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Get Creator Pages
app.get('/api/pages', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE creator_id = $1 ORDER BY created_at DESC',
      [req.creatorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Pages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get Single Page by Handle (Public)
app.get('/api/pages/:handle', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE handle = $1',
      [req.params.handle]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Page fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Update Page
app.put('/api/pages/:pageId', verifyToken, async (req, res) => {
  try {
    const { title, description, platforms, embed_url, affiliate_link } = req.body;

    const result = await pool.query(
      `UPDATE pages 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description),
           platforms = COALESCE($3, platforms),
           embed_url = COALESCE($4, embed_url),
           affiliate_link = COALESCE($5, affiliate_link)
       WHERE id = $6 AND creator_id = $7
       RETURNING *`,
      [title, description, JSON.stringify(platforms), embed_url, affiliate_link, req.params.pageId, req.creatorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Page update error:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Delete Page
app.delete('/api/pages/:pageId', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM pages WHERE id = $1 AND creator_id = $2 RETURNING id',
      [req.params.pageId, req.creatorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Page deletion error:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get Page Analytics
app.get('/api/analytics/:pageId', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM analytics 
       WHERE page_id = $1 AND creator_id = $2
       ORDER BY created_at DESC
       LIMIT 30`,
      [req.params.pageId, req.creatorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Record Page View
app.post('/api/analytics/view', async (req, res) => {
  try {
    const { pageId } = req.body;
    const viewId = uuidv4();

    await pool.query(
      `INSERT INTO analytics (id, page_id, event_type, created_at)
       VALUES ($1, $2, 'page_view', NOW())`,
      [viewId, pageId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Analytics recording error:', error);
    res.status(500).json({ error: 'Failed to record view' });
  }
});

// ==================== LIVE CHAT WITH SOCKET.IO ====================

const activeSessions = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join page chat room
  socket.on('join_page', (pageHandle) => {
    socket.join(`page_${pageHandle}`);
    activeSessions.set(socket.id, { pageHandle, joinedAt: Date.now() });
    
    io.to(`page_${pageHandle}`).emit('user_joined', {
      message: 'User joined the chat',
      timestamp: new Date()
    });
  });

  // Send chat message
  socket.on('send_message', async (data) => {
    try {
      const { pageHandle, username, message } = data;
      const messageId = uuidv4();

      // Save to database
      await pool.query(
        `INSERT INTO chat_messages (id, page_handle, username, message, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [messageId, pageHandle, username, message]
      );

      // Broadcast to all users in this page
      io.to(`page_${pageHandle}`).emit('new_message', {
        id: messageId,
        username,
        message,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const session = activeSessions.get(socket.id);
    if (session) {
      io.to(`page_${session.pageHandle}`).emit('user_left', {
        message: 'User left the chat',
        timestamp: new Date()
      });
      activeSessions.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// ==================== NFT BADGE ROUTES ====================

// Get Creator Badges
app.get('/api/badges', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM badges WHERE creator_id = $1',
      [req.creatorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Badges fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Mint Badge (Placeholder for Solana integration)
app.post('/api/badges/mint', verifyToken, async (req, res) => {
  try {
    const { badgeType } = req.body;
    const badgeId = uuidv4();

    // TODO: Integrate with Solana Web3.js for actual NFT minting
    // For now, just save to database

    const result = await pool.query(
      `INSERT INTO badges (id, creator_id, badge_type, mint_address, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [badgeId, req.creatorId, badgeType, `placeholder_${badgeId}`]
    );

    res.json({
      success: true,
      badge: result.rows[0]
    });
  } catch (error) {
    console.error('Badge minting error:', error);
    res.status(500).json({ error: 'Failed to mint badge' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 SKYNZ Backend running on port ${PORT}`);
  console.log(`📊 WebSocket server ready for real-time features`);
});

export default app;
