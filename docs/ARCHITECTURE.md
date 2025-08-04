# Architecture Documentation

## Overview

Technical overview of the Lizdek World Frontend architecture, including design patterns, data flow, and implementation decisions.

## Core Architecture Patterns

### Component-Based Architecture

```
App (Root)
├── Providers (Context, Query Client)
├── Router
└── Pages
    ├── Public Pages
    │   ├── Home
    │   ├── Shows
    │   ├── Releases
    │   └── ReleaseDetail
    └── Admin Pages
        ├── Login
        ├── Dashboard
        ├── CreateRelease
        └── EditRelease
```

### State Management Strategy

#### Global State (Authentication)
- **Pattern**: React Context API
- **Implementation**: `AuthContext` provides authentication state
- **Scope**: User authentication, session management

#### Server State (API Data)
- **Pattern**: TanStack React Query
- **Implementation**: Custom hooks for data fetching
- **Scope**: Shows, releases, and other API data

#### Local State (UI State)
- **Pattern**: React hooks (useState, useReducer)
- **Implementation**: Component-level state management
- **Scope**: Form inputs, UI interactions, component state

### Data Flow Architecture

```
User Action → Component → Hook → API → Cache → UI Update
     ↑                                                    ↓
     └────────────── Error Handling ←────────────────────┘
```

## Technical Implementation Details

### Authentication Architecture

#### Token-Based Authentication
```typescript
// Token storage in sessionStorage
sessionStorage.setItem('auth_token', token);

// Automatic token injection
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

#### Protected Route Pattern
```typescript
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/admin/login" replace />;
    
    return <>{children}</>;
};
```

### API Integration Architecture

#### Axios Configuration
```typescript
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('auth_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);
```

#### React Query Integration
```typescript
// Query configuration
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

// Custom hook pattern
export const useShows = () => {
    return useQuery({
        queryKey: ['shows'],
        queryFn: async (): Promise<Show[]> => {
            const response = await api.get('/shows');
            return response.data;
        },
    });
};
```

### Routing Architecture

#### Route Structure
```typescript
<Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/shows" element={<Shows />} />
    <Route path="/releases" element={<Releases />} />
    <Route path="/release/:urlTitle" element={<ReleaseDetail />} />
    
    {/* Admin Routes */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route 
        path="/admin/dashboard" 
        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
    />
</Routes>
```

### Type Safety Architecture

#### TypeScript Integration
```typescript
// Interface definitions
export interface Show {
    id: string;
    venue: string;
    city: string;
    state_province: string;
    country: string;
    ticket_link?: string;
    show_date: string;
}

// Component props typing
interface ShowCardProps {
    show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
    // Component implementation
};
```

## Performance Optimization Strategies

### React Query Caching

#### Caching Strategy
- **Stale Time**: 5 minutes for most queries
- **Cache Invalidation**: Automatic on mutations
- **Background Updates**: Seamless data synchronization
- **Optimistic Updates**: Immediate UI updates for mutations

#### Cache Configuration
```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
```

### Code Splitting

#### Route-Based Splitting
- **Automatic Splitting**: Vite handles code splitting
- **Lazy Loading**: Components loaded on demand
- **Bundle Optimization**: Reduced initial bundle size

## Security Architecture

### Authentication Security

#### Token Management
- **Session Storage**: Tokens stored in sessionStorage
- **Automatic Cleanup**: Tokens cleared on tab close
- **Token Verification**: Automatic token validation
- **Secure Logout**: Complete session cleanup

#### Route Protection
- **Authentication Guards**: Protected route components
- **Redirect Logic**: Automatic redirect to login
- **Loading States**: Proper loading indicators

### API Security

#### Request Security
- **HTTPS**: Secure communication with backend
- **Token Injection**: Automatic authentication headers
- **Error Handling**: Graceful error responses
- **CORS**: Proper cross-origin configuration

## Error Handling Architecture

### Error Boundaries

#### React Error Boundaries
- **Component Error Isolation**: Errors contained to components
- **Fallback UI**: Graceful error displays
- **Error Reporting**: Centralized error logging

### API Error Handling

#### Axios Interceptors
```typescript
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle authentication errors
            sessionStorage.removeItem('auth_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);
```

#### React Query Error Handling
```typescript
const { data, error, isLoading } = useShows();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error loading shows</div>;
```

## Development Architecture

### Code Organization

#### Directory Structure
```
src/
├── components/     # Reusable UI components
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API and external services
├── styles/        # CSS stylesheets
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `ShowCard`)
- **Hooks**: camelCase with `use` prefix (e.g., `useShows`)
- **Files**: kebab-case (e.g., `show-card.css`)
- **Types**: PascalCase with descriptive names

## Scalability Considerations

### Component Scalability

#### Reusable Components
- **Generic Components**: Flexible, reusable UI components
- **Props Interface**: Well-defined component contracts
- **Composition**: Component composition over inheritance

#### State Management Scalability
- **Context API**: Suitable for global state
- **React Query**: Handles server state efficiently
- **Local State**: Component-specific state management

### Performance Scalability

#### Caching Strategy
- **React Query**: Efficient data caching
- **Asset Optimization**: Optimized static assets
- **Code Splitting**: Reduced bundle sizes

#### API Scalability
- **RESTful Design**: Standard API patterns
- **Error Handling**: Robust error management
- **Authentication**: Secure API access

---

This architecture documentation provides a comprehensive overview of the technical decisions and patterns used in the Lizdek World Frontend. 