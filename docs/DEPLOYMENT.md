# Deployment Documentation

## Overview

Guidance for deploying the Lizdek World Frontend application to various environments.

## Prerequisites

### System Requirements
- Node.js 18+
- npm or yarn
- Git

### Environment Setup

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd lizdek-world-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```

## Environment Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:3001/api` |
| `VITE_APP_TITLE` | Application title | No | `Lizdek World` |
| `VITE_APP_VERSION` | Application version | No | `0.0.0` |

### Environment-Specific Configuration

#### Development Environment
```bash
# .env.development
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=Lizdek World (Dev)
VITE_APP_VERSION=0.0.0
```

#### Staging Environment
```bash
# .env.staging
VITE_API_URL=https://staging-api.lizdek.world/api
VITE_APP_TITLE=Lizdek World (Staging)
VITE_APP_VERSION=0.0.0
```

#### Production Environment
```bash
# .env.production
VITE_API_URL=https://api.lizdek.world/api
VITE_APP_TITLE=Lizdek World
VITE_APP_VERSION=1.0.0
```

## Build Process

### Development Build

```bash
# Start development server
npm run dev
```

**Features**:
- Hot module replacement
- Source maps for debugging
- Fast refresh for React components

### Production Build

```bash
# Build for production
npm run build
```

**Build Output**:
- Optimized static files in `dist/` directory
- Minified JavaScript and CSS
- Asset hashing for cache busting
- Tree-shaken bundle

### Build Configuration

#### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
```

## Deployment Strategies

### Static Hosting Deployment

#### Netlify Deployment

1. **Connect Repository**:
   - Link GitHub repository to Netlify
   - Configure build settings

2. **Build Configuration**:
   ```yaml
   # netlify.toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     VITE_API_URL = "https://api.lizdek.world/api"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Vercel Deployment

1. **Project Setup**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Configuration**:
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

#### GitHub Pages Deployment

1. **Build Script**:
   ```bash
   # Add to package.json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

2. **Deploy Command**:
   ```bash
   npm run deploy
   ```

### Container Deployment

#### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.lizdek.world/api
    restart: unless-stopped
```

## Deployment Environments

### Development Environment

**Purpose**: Local development and testing
**URL**: `http://localhost:5173`
**Configuration**: Development API endpoint

**Setup**:
```bash
npm run dev
```

### Staging Environment

**Purpose**: Pre-production testing
**URL**: `https://staging.lizdek.world`
**Configuration**: Staging API endpoint

**Deployment**:
```bash
# Build for staging
npm run build:staging

# Deploy to staging server
npm run deploy:staging
```

### Production Environment

**Purpose**: Live application
**URL**: `https://lizdek.world`
**Configuration**: Production API endpoint

**Deployment**:
```bash
# Build for production
npm run build

# Deploy to production
npm run deploy:production
```

## Build Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:staging": "tsc -b && vite build --mode staging",
    "build:production": "tsc -b && vite build --mode production",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "deploy:staging": "npm run build:staging && deploy-staging",
    "deploy:production": "npm run build:production && deploy-production"
  }
}
```

### Build Pipeline

1. **Type Checking**: TypeScript compilation
2. **Linting**: ESLint code quality checks
3. **Building**: Vite production build
4. **Optimization**: Asset optimization and minification
5. **Deployment**: Upload to hosting platform

## Performance Optimization

### Build Optimization

#### Code Splitting
```typescript
// Automatic route-based code splitting
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Shows = lazy(() => import('./pages/Shows'));
const Releases = lazy(() => import('./pages/Releases'));
```

#### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Analyze bundle
npm run build && npx vite-bundle-analyzer dist
```

### Asset Optimization

#### Image Optimization
- **Format Selection**: WebP for modern browsers
- **Compression**: Optimized image compression
- **Responsive Images**: Multiple sizes for different devices
- **Lazy Loading**: Images loaded on demand

#### CSS Optimization
- **Minification**: Compressed CSS output
- **PurgeCSS**: Remove unused CSS
- **Critical CSS**: Inline critical styles

## Security Considerations

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://api.lizdek.world;">
```

### Security Headers

```nginx
# nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### Environment Variable Security

- **Client-Side Variables**: Only `VITE_` prefixed variables are exposed
- **Sensitive Data**: Never expose API keys or secrets
- **Environment Separation**: Different configs for each environment

## Monitoring and Analytics

### Performance Monitoring

#### Web Vitals
```typescript
// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### Error Tracking
```typescript
// Error boundary with tracking
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Send to error tracking service
    console.error('Error:', error, errorInfo);
  }
}
```

### Health Checks

#### Application Health
```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION
  });
});
```

## Rollback Procedures

### Version Management

#### Git Tags
```bash
# Create release tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

#### Deployment Rollback
```bash
# Rollback to previous version
git checkout v0.9.0
npm run build
npm run deploy:production
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables
```bash
# Check environment variables
echo $VITE_API_URL
npm run build -- --mode development
```

#### Network Issues
```bash
# Test API connectivity
curl -I https://api.lizdek.world/health
```

### Debug Commands

```bash
# Development debugging
npm run dev -- --debug

# Production debugging
npm run build -- --debug

# Bundle analysis
npm run build && npx vite-bundle-analyzer dist
```

---

This deployment documentation provides comprehensive guidance for deploying the Lizdek World Frontend across different environments. 