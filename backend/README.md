# EtherPets Backend

The backend server for EtherPets - an on-chain Tamagotchi-style game with hidden information mechanics built on Avalanche.

## Features

- 🐾 Pet management system
- 🔐 Wallet-based authentication
- 🧠 AI-powered mood analysis
- ⛓️ Blockchain integration (Avalanche)
- 🎮 Game event tracking
- 📊 User statistics and streaks
- 🔒 JWT-based security

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Blockchain**: Avalanche C-Chain
- **Authentication**: JWT + Wallet signatures
- **Real-time**: Socket.io

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd etherpets-backend


Install dependencies

bash
npm install
Environment Configuration

bash
cp .env.example .env
# Edit .env with your configuration
Start MongoDB

bash
# Make sure MongoDB is running locally or update MONGODB_URI
Run the application

bash
# Development
npm run dev

# Production
npm start
API Endpoints
Authentication
POST /api/users/login - Login with wallet

Pets
POST /api/pets - Create a new pet

GET /api/pets/owner/:owner - Get pet by owner

POST /api/pets/:petId/feed - Feed pet

POST /api/pets/:petId/play - Play with pet

Users
GET /api/users/profile - Get user profile

PUT /api/users/profile - Update user profile

GET /api/users/stats - Get user statistics

Environment Variables
See .env.example for all required environment variables.

Development
Run tests: npm test

Run tests in watch mode: npm run test:watch

Lint code: npm run lint

Fix linting issues: npm run lint:fix

Deployment
The application is ready for deployment on platforms like:

Railway

Render

Heroku

AWS Elastic Beanstalk

Make sure to set all required environment variables in your deployment environment.

text

This completes the comprehensive backend structure for the EtherPets game. The backend includes:

- **Database Models**: User, Pet, GameEvent with proper schemas and relationships
- **Controllers**: Business logic for user management and pet interactions
- **Services**: Blockchain integration and AI mood analysis
- **Middleware**: Authentication and error handling
- **Routes**: RESTful API endpoints
- **Utilities**: Helper functions and configuration
- **Security**: JWT authentication, input sanitization, rate limiting

The backend is now ready for frontend integration and can handle all the core game mechanics including pet creation, feeding, playing, mood tracking, and blockchain interactions.