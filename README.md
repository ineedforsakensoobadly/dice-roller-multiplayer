# Dice Roller Multiplayer

A multiplayer dice roller game with account system, real-time features, and persistent data storage.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Game
- Account System: http://localhost:3000
- Game: http://localhost:3000/game

## 📁 Project Structure

```
dice-roller-multiplayer/
├── package.json              # Node.js dependencies
├── backend/
│   └── server.js           # Express server
├── frontend/
│   ├── account_system.html   # Login/Registration
│   └── dice.html          # Main game
└── README.md               # This file
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub repository
2. Connect repository to Vercel
3. Vercel will auto-detect Node.js project
4. Deploy!

### Environment Variables
Set these in your hosting platform:
- `NODE_ENV` = production
- `PORT` = 3000 (or auto-assigned)
- `JWT_SECRET` = your-secret-key
- `DATABASE_URL` = your-database-url

## 🎮 Features

### Account System
- ✅ User registration and login
- ✅ Profile picture upload
- ✅ Account deletion
- ✅ Session management

### Game Features
- ✅ Dice rolling with animations
- ✅ Coin and Super Dicer economy
- ✅ Achievement system
- ✅ Shop with items and upgrades
- ✅ Quest system
- ✅ Auto-roll functionality
- ✅ N/A special effects with confetti

### Multiplayer (Planned)
- 🔄 Real-time dice battles
- 🔄 Leaderboards
- 🔄 Chat system
- 🔄 Tournaments

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Production Deployment
The server serves static files from the `frontend/` directory, making it perfect for platforms like:
- Vercel (recommended)
- Heroku
- Railway
- Netlify (with functions)

## 🔧 Configuration

The server automatically:
- Serves frontend files
- Handles CORS for local development
- Provides health check endpoint
- Ready for API expansion

## 📝 License

MIT License - Feel free to use this project for learning and development!
