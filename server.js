const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

// In-memory database (replace with real database in production)
const users = {};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper functions
function generateToken(user) {
  return jwt.sign(
    { username: user.username, profilePicture: user.profilePicture },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/account_system.html'));
});

app.get('/game', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dice.html'));
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, profilePicture } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    
    if (username.length < 3) {
      return res.status(400).json({ success: false, error: 'Username must be at least 3 characters' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    
    if (users[username]) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = {
      password: hashedPassword,
      profilePicture: profilePicture || null,
      createdAt: new Date().toISOString(),
      gameData: {
        coins: 0,
        achievements: [],
        ownedTracks: []
      }
    };
    
    res.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password: userPassword } = req.body;
    
    if (!username || !userPassword) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    
    if (!users[username]) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }
    
    // Compare password
    const user = users[username];
    const passwordMatch = await bcrypt.compare(userPassword, user.password);
    
    if (!passwordMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect password' });
    }
    
    // Generate token and return user data
    const token = generateToken(user);
    const { password, ...safeUser } = user;
    
    res.json({ 
      success: true, 
      user: safeUser,
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/update-user', authenticateToken, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const username = req.user.username;
    
    if (!users[username]) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }
    
    // Update user
    if (profilePicture) {
      users[username].profilePicture = profilePicture;
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/delete-user', authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;
    
    if (!users[username]) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }
    
    // Delete user
    delete users[username];
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎲 Dice Roller Server running on port ${PORT}`);
  console.log(`🌐 Frontend available at: http://localhost:${PORT}`);
});
