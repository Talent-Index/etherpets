const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/etherpets',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Blockchain
  blockchain: {
    avalancheRpc: process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
    privateKey: process.env.PRIVATE_KEY,
    chainId: process.env.CHAIN_ID || 43113, // Fuji testnet
  },

  // AI Services
  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
    huggingfaceKey: process.env.HUGGINGFACE_API_KEY,
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && config.nodeEnv === 'production') {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

module.exports = config;