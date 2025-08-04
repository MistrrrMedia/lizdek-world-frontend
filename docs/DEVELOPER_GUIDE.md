# Developer Guide

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup
```bash
git clone <repository-url>
cd lizdek-world-frontend
npm install
cp .env.example .env.local
npm run dev
```

## Development Workflow

### Daily Development
1. **Start Development Server**: `npm run dev`
2. **Make Changes**: Edit files in `src/`
3. **Test Changes**: Check browser at `http://localhost:5173`
4. **Lint Code**: `npm run lint`
5. **Type Check**: `npm run type-check`

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Build for production
npm run build
```

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

## Key Technologies

### Core Stack
- **React 18.3.1**: UI library
- **TypeScript 5.6.2**: Type safety
- **Vite 6.0.5**: Build tool
- **React Router DOM 7.4.1**: Routing

### State Management
- **TanStack React Query 5.0.0**: Server state
- **React Context**: Global state (auth)
- **React Hooks**: Local state

## Common Development Tasks

### Adding a New Page

1. **Create Page Component**:
```typescript
// src/pages/NewPage.tsx
import React from 'react';

const NewPage: React.FC = () => {
    return (
        <div className="new-page">
            <h1>New Page</h1>
        </div>
    );
};

export default NewPage;
```

2. **Add Route**:
```typescript
// src/App.tsx
import NewPage from './pages/NewPage';

// In Routes component
<Route path="/new-page" element={<NewPage />} />
```

3. **Add Styles**:
```css
/* src/styles/NewPage.css */
.new-page {
    /* Your styles here */
}
```

### Adding a New API Hook

1. **Create Hook**:
```typescript
// src/hooks/useNewData.ts
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useNewData = () => {
    return useQuery({
        queryKey: ['new-data'],
        queryFn: async () => {
            const response = await api.get('/new-data');
            return response.data;
        },
    });
};
```

2. **Use in Component**:
```typescript
import { useNewData } from '../hooks/useNewData';

const MyComponent: React.FC = () => {
    const { data, isLoading, error } = useNewData();
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;
    
    return <div>{data?.map(item => <div key={item.id}>{item.name}</div>)}</div>;
};
```

### Adding a New Type

```typescript
// src/types/newType.ts
export interface NewType {
    id: string;
    name: string;
    description?: string;
    created_at: string;
}

export interface CreateNewTypeData {
    name: string;
    description?: string;
}
```

### Creating a New Component

```typescript
// src/components/NewComponent.tsx
import React from 'react';
import { NewType } from '../types/newType';
import '../styles/NewComponent.css';

interface NewComponentProps {
    data: NewType;
    onAction?: (id: string) => void;
}

const NewComponent: React.FC<NewComponentProps> = ({ data, onAction }) => {
    const handleClick = () => {
        onAction?.(data.id);
    };

    return (
        <div className="new-component" onClick={handleClick}>
            <h3>{data.name}</h3>
            {data.description && <p>{data.description}</p>}
        </div>
    );
};

export default NewComponent;
```

## API Integration Patterns

### Data Fetching
```typescript
// Query pattern
export const useData = () => {
    return useQuery({
        queryKey: ['data'],
        queryFn: async () => {
            const response = await api.get('/data');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
```

### Mutations
```typescript
// Mutation pattern
export const useCreateData = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: CreateData) => {
            const response = await api.post('/data', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['data'] });
        },
    });
};
```

### Error Handling
```typescript
const MyComponent: React.FC = () => {
    const { data, isLoading, error } = useData();
    const createData = useCreateData();

    const handleSubmit = async (formData: CreateData) => {
        try {
            await createData.mutateAsync(formData);
            // Handle success
        } catch (error) {
            // Handle error
            console.error('Failed to create data:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {/* Component content */}
        </div>
    );
};
```

## Authentication Patterns

### Protected Routes
```typescript
// src/components/admin/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/admin/login" replace />;

    return <>{children}</>;
};
```

### Using Authentication
```typescript
import { useAuth } from '../context/AuthContext';

const AdminComponent: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div>
            <p>Welcome, {user?.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};
```

## Styling Guidelines

### CSS Organization
- **Component-Specific**: Each component has its own CSS file
- **Global Styles**: Base styles in `src/index.css`
- **Responsive Design**: Mobile-first approach

### CSS Naming
```css
/* Use kebab-case for class names */
.component-name {
    /* styles */
}

.component-name__element {
    /* BEM methodology for complex components */
}

.component-name--modifier {
    /* modifier styles */
}
```

### Responsive Design
```css
/* Mobile first */
.container {
    padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .container {
        padding: 3rem;
    }
}
```

## TypeScript Best Practices

### Type Definitions
```typescript
// Always define interfaces for props
interface ComponentProps {
    title: string;
    description?: string;
    onAction: (id: string) => void;
}

// Use React.FC for functional components
const MyComponent: React.FC<ComponentProps> = ({ title, description, onAction }) => {
    return <div>{title}</div>;
};
```

### API Types
```typescript
// Define API response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

// Use in API calls
const response = await api.get<ApiResponse<User[]>>('/users');
return response.data.data; // Access the actual data
```

### Generic Types
```typescript
// Use generics for reusable components
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string;
}

const List = <T,>({ items, renderItem, keyExtractor }: ListProps<T>) => {
    return (
        <div>
            {items.map(item => (
                <div key={keyExtractor(item)}>
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
};
```

## Performance Optimization

### React.memo
```typescript
import React from 'react';

const ExpensiveComponent = React.memo<ComponentProps>(({ data }) => {
    return <div>{/* Expensive rendering */}</div>;
});
```

### useMemo and useCallback
```typescript
import React, { useMemo, useCallback } from 'react';

const MyComponent: React.FC<Props> = ({ items, onAction }) => {
    // Memoize expensive calculations
    const processedItems = useMemo(() => {
        return items.filter(item => item.active).map(processItem);
    }, [items]);

    // Memoize callbacks
    const handleClick = useCallback((id: string) => {
        onAction(id);
    }, [onAction]);

    return (
        <div>
            {processedItems.map(item => (
                <div key={item.id} onClick={() => handleClick(item.id)}>
                    {item.name}
                </div>
            ))}
        </div>
    );
};
```

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const App: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
        </Suspense>
    );
};
```

## Debugging

### Development Tools
```bash
# Start with debugging
npm run dev -- --debug

# Check bundle size
npm run build && npx vite-bundle-analyzer dist

# Type checking
npm run type-check

# Linting
npm run lint
```

### Console Debugging
```typescript
// Development-only logging
if (process.env.NODE_ENV === 'development') {
    console.log('Debug info:', data);
}

// Error boundaries
class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        console.error('Error caught:', error, errorInfo);
    }
}
```

## Common Issues and Solutions

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint
```

### Runtime Errors
```typescript
// Handle undefined data
const { data = [] } = useData();

// Safe navigation
const userName = user?.username || 'Guest';

// Type guards
if (typeof data === 'object' && data !== null) {
    // Safe to use data
}
```

### API Errors
```typescript
// Handle API errors gracefully
const { data, error, isLoading } = useData();

if (error) {
    return <div>Error: {error.message}</div>;
}

if (isLoading) {
    return <div>Loading...</div>;
}
```

## Environment Setup

### Local Development
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```bash
# .env.local
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=Lizdek World (Dev)
```

### IDE Configuration
```json
// .vscode/settings.json
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

## Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

### Tools
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Vite Bundle Analyzer](https://github.com/btd/rollup-plugin-visualizer)

---

This developer guide provides essential information for working with the Lizdek World Frontend. 