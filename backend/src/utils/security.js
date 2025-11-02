const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

class SecurityUtils {
  // Generate secure random tokens
  static generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash data (for non-password use cases)
  static hashData(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  // Validate input against common attacks
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript/gi, '') // Remove javascript
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate Ethereum address
  static isValidEthereumAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Check for SQL injection patterns
  static hasSQLInjection(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC)\b)/i,
      /('|"|;|--|\/\*|\*\/)/,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // Check for XSS patterns
  static hasXSS(input) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting configuration
  static createRateLimit(config = {}) {
    return rateLimit({
      windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
      max: config.max || 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests, please try again later.',
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      ...config,
    });
  }

  // API-specific rate limits
  static getRateLimits() {
    return {
      general: this.createRateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
      }),
      auth: this.createRateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
      }),
      createPet: this.createRateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3,
      }),
      admin: this.createRateLimit({
        windowMs: 15 * 60 * 1000,
        max: 50,
      }),
    };
  }

  // CORS configuration
  static getCorsOptions() {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://etherpets.xyz',
    ];

    return {
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-auth-token',
        'x-api-key',
      ],
    };
  }

  // Security headers middleware
  static securityHeaders(req, res, next) {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Strict transport security
    if (req.secure || process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    // Content security policy
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    );
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  }

  // Request logging middleware
  static requestLogger(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log({
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });
    });
    
    next();
  }
}

module.exports = SecurityUtils;