# Lizdek World Frontend

A React-based web application for Lizdek, featuring a public-facing website with artist information, releases, and shows, plus an administrative interface for content management.

## Features

### Public Features
- **Home Page**: Artist introduction with navigation to releases and shows
- **Shows Page**: Display of upcoming live performances with ticket links
- **Releases Page**: Music releases with cover art and streaming links
- **Release Details**: Individual release pages with full information
- **Social Media Integration**: Direct links to artist social platforms

### Administrative Features
- **Secure Login**: Admin authentication with session management
- **Dashboard**: Centralized admin interface
- **Release Management**: Create, edit, and manage music releases
- **Show Management**: Add and update live performance information

## Technology Stack

- **React 18.3.1**: UI library
- **TypeScript 5.6.2**: Type safety
- **Vite 6.0.5**: Build tool
- **React Router DOM 7.4.1**: Client-side routing
- **TanStack React Query 5.0.0**: Server state management
- **Axios 1.6.0**: HTTP client
- **React Hook Form 7.48.0**: Form handling
- **Framer Motion 10.16.0**: Animation library

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── shows/          # Show-related components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   └── admin/          # Admin pages
├── services/           # API and external services
├── styles/             # CSS stylesheets
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lizdek-world-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create environment file
   touch .env.local
   ```
   
   Add the following configuration to `.env.local`:
   ```bash
   # Development configuration
   VITE_API_URL="http://localhost:3001/api"
   VITE_APP_TITLE="Lizdek World"
   VITE_APP_VERSION="1.0.0"
   ```
   
   **Note**: For production deployment, update `VITE_API_URL` to your production API endpoint.

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Development

### Available Scripts

- **`npm run dev`**: Start development server with hot reload
- **`npm run build`**: Build for production
- **`npm run lint`**: Run ESLint for code quality
- **`npm run preview`**: Preview production build locally

## API Integration

The application integrates with a backend API for data management:

- **Public Endpoints**: Shows, releases, and release details
- **Admin Endpoints**: Authentication, show management, release management
- **Authentication**: JWT token-based authentication
- **Data Fetching**: React Query for efficient caching and state management

## Routing

### Public Routes
- `/` - Home page with artist introduction
- `/shows` - Upcoming shows listing
- `/releases` - Music releases listing
- `/release/:urlTitle` - Individual release details

### Admin Routes
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin dashboard (protected)
- `/admin/create` - Create new release (protected)
- `/admin/release/:id/edit` - Edit existing release (protected)

## Environment Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `"http://localhost:3001/api"` |
| `VITE_APP_TITLE` | Application title | `"Lizdek World"` |
| `VITE_APP_VERSION` | Application version | `"1.0.0"` |

## Build and Deployment

### Production Build

```