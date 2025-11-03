# EtherPets Backend - Quick Start Guide

## 🚀 Fast Setup (5 Minutes)

### Prerequisites
- Node.js v18+ installed
- MongoDB running (local or cloud)
- Redis running (optional but recommended)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - PORT (default: 5000)
```

### 3. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**With PM2:**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 logs etherpets-backend
```

### 4. Verify Installation
```bash
# Check health endpoint
curl http://localhost:5000/health

# Should return:
# {"success":true,"message":"EtherPets API is running",...}
```

---

## 📋 Key Endpoints

### Base URL
```
http://localhost:5000
```

### Health Check
```
GET /health
```

### User Management
```
POST /api/users/register - Create account
POST /api/users/login - Login
GET /api/users/:walletAddress - Get profile
```

### Pet Management
```
POST /api/pets/create - Create pet
GET /api/pets/:petId - Get pet details
POST /api/pets/:petId/feed - Feed pet
POST /api/pets/:petId/play - Play with pet
```

### Game Activities
```
POST /api/game/feed - Feed action
POST /api/game/play - Play action
POST /api/game/train - Train pet
GET /api/game/events/:petId - Get events
```

### Shop & Economy
```
GET /api/shop/items - Browse shop
POST /api/shop/items/:itemId/purchase - Buy item
GET /api/inventory - View inventory
GET /api/currency/balance - Check balance
```

### Achievements & Quests
```
GET /api/achievements/:walletAddress - User achievements
GET /api/quests - Available quests
POST /api/quests/:questId/start - Start quest
```

### Leaderboards
```
GET /api/leaderboards/global - Global rankings
GET /api/leaderboards/seasonal - Season rankings
```

---

## 🔑 Authentication

All protected endpoints require JWT token in Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

To get a token:
1. Register: `POST /api/users/register`
2. Login: `POST /api/users/login`
3. Use returned token in subsequent requests

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📊 Admin Panel

Admin endpoints require admin role:
```
GET /api/admin/dashboard - System overview
GET /api/admin/users - User management
GET /api/admin/analytics - System analytics
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 🔧 Common Commands

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Seed database
node src/scripts/seedData.js

# Create backup
node src/scripts/backup.js

# Health check
node src/scripts/health-check.js
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers (18 files)
│   ├── middleware/      # Express middleware (5 files)
│   ├── models/          # Database schemas (8 files)
│   ├── routes/          # API routes (18 files)
│   ├── services/        # Business logic (15 files)
│   ├── utils/           # Helper utilities (9 files)
│   ├── scripts/         # Maintenance scripts (4 files)
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example         # Environment template
├── package.json         # Dependencies
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Multi-container setup
└── ecosystem.config.js  # PM2 configuration
```

---

## 🌟 Features Overview

✅ **Authentication** - Wallet-based auth with JWT  
✅ **Pet System** - Create, care for, and evolve pets  
✅ **Game Mechanics** - Feed, play, train, meditate  
✅ **Economy** - Coins, shop, inventory, marketplace  
✅ **Progression** - Levels, achievements, quests  
✅ **Social** - Leaderboards, seasons, events  
✅ **Admin** - Full management dashboard  
✅ **Analytics** - Comprehensive tracking  
✅ **Real-time** - WebSocket support  
✅ **Security** - Rate limiting, validation, encryption  

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Or use Docker
docker-compose up -d mongodb
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### Redis Connection Issues
```bash
# Redis is optional, server will work without it
# To enable caching, start Redis:
docker-compose up -d redis
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

- **Documentation:** See `README.md` and `BACKEND_VERIFICATION.md`
- **API Reference:** Check individual route files in `src/routes/`
- **Issues:** Review error logs in `logs/` directory

---

## 🎯 Quick Testing Flow

1. **Register a user**
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"walletAddress":"0x123...","username":"testuser"}'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"walletAddress":"0x123..."}'
   ```

3. **Create a pet** (use token from login)
   ```bash
   curl -X POST http://localhost:5000/api/pets/create \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"name":"Fluffy","species":"dragon"}'
   ```

4. **Feed your pet**
   ```bash
   curl -X POST http://localhost:5000/api/pets/PET_ID/feed \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

**Backend is 100% complete and ready to use! 🎉**

*For detailed information, see BACKEND_VERIFICATION.md*
