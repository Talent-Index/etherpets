FROM node:18-alpine

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S etherpets -u 1001

# Change ownership
RUN chown -R etherpets:nodejs /usr/src/app
USER etherpets

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node src/scripts/health-check.js

# Start the application
CMD ["npm", "start"]