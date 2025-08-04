# API Integration Documentation

## Overview

API integration patterns, data flow, and implementation details for the Lizdek World Frontend application.

## API Client Configuration

### Base Configuration

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### Request Interceptors

#### Authentication Token Injection

```typescript
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### Response Interceptors

#### Error Handling

```typescript
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

## API Endpoints

### Public Endpoints

#### Shows

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/shows` | Retrieve all upcoming shows | `Show[]` |

**Implementation**:
```typescript
export const useShows = () => {
    return useQuery({
        queryKey: ['shows'],
        queryFn: async (): Promise<Show[]> => {
            const response = await api.get('/shows');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
```

#### Releases

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/releases` | Retrieve all releases | `Release[]` |
| GET | `/releases/:urlTitle` | Get specific release | `Release` |

### Admin Endpoints

#### Authentication

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/login` | Admin login | `LoginCredentials` | `{ token: string, user: AuthUser }` |
| GET | `/auth/verify` | Verify token | None | `{ user: AuthUser }` |

#### Show Management

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/shows` | Create new show | `CreateShowData` | `Show` |
| PUT | `/shows/:id` | Update show | `Partial<CreateShowData>` | `Show` |
| DELETE | `/shows/:id` | Delete show | None | `void` |

#### Release Management

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/releases` | Create new release | `CreateReleaseData` | `Release` |
| PUT | `/releases/:id` | Update release | `Partial<CreateReleaseData>` | `Release` |
| DELETE | `/releases/:id` | Delete release | None | `void` |

## Data Types

### Core Types

#### Show
```typescript
export interface Show {
    id: string;
    venue: string;
    city: string;
    state_province: string;
    country: string;
    ticket_link?: string;
    show_date: string;
}
```

#### Release
```typescript
export interface Release {
    id: string;
    title: string;
    url_title: string;
    cover_art_full: string;
    cover_art_thumbnail: string;
    collaborators?: string;
    release_date: string;
    links: ReleaseLink[];
}

export interface ReleaseLink {
    id: string;
    platform: 'spotify' | 'soundcloud' | 'apple_music' | 'youtube';
    url: string;
}
```

#### Authentication
```typescript
export interface AuthUser {
    id: string;
    username: string;
    role: 'admin';
}

export interface LoginCredentials {
    username: string;
    password: string;
}
```

### Create/Update Types

#### CreateShowData
```typescript
export interface CreateShowData {
    venue: string;
    city: string;
    state_province: string;
    country: string;
    ticket_link?: string;
    show_date: string;
}
```

#### CreateReleaseData
```typescript
export interface CreateReleaseData {
    title: string;
    collaborators?: string;
    release_date: string;
    cover_art_full: File;
    cover_art_thumbnail: File;
    links: Omit<ReleaseLink, 'id'>[];
}
```

## React Query Integration

### Query Client Configuration

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

### Query Patterns

#### Data Fetching
```typescript
export const useShows = () => {
    return useQuery({
        queryKey: ['shows'],
        queryFn: async (): Promise<Show[]> => {
            const response = await api.get('/shows');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
```

#### Mutations
```typescript
export const useCreateShow = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (showData: CreateShowData): Promise<Show> => {
            const response = await api.post('/shows', showData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
        },
    });
};
```

### Error Handling

#### Component-Level Error Handling
```typescript
const Shows: React.FC = () => {
    const { data: shows, isLoading, error } = useShows();

    if (isLoading) {
        return <div>Loading shows...</div>;
    }

    if (error) {
        return <div>Error loading shows</div>;
    }

    return (
        <div className="shows-page">
            {shows?.map((show) => (
                <ShowCard key={show.id} show={show} />
            ))}
        </div>
    );
};
```

#### Mutation Error Handling
```typescript
const CreateShowForm: React.FC = () => {
    const createShow = useCreateShow();
    const [error, setError] = useState<string>('');

    const handleSubmit = async (data: CreateShowData) => {
        try {
            await createShow.mutateAsync(data);
            // Handle success
        } catch (error) {
            setError('Failed to create show');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
            {error && <div className="error">{error}</div>}
        </form>
    );
};
```

## File Upload Handling

### FormData Implementation

```typescript
const handleFileUpload = (releaseData: CreateReleaseData) => {
    const formData = new FormData();
    
    // Append form fields
    formData.append('title', releaseData.title);
    formData.append('release_date', releaseData.release_date);
    
    // Append files
    formData.append('cover_art_full', releaseData.cover_art_full);
    formData.append('cover_art_thumbnail', releaseData.cover_art_thumbnail);
    
    // Append links array
    releaseData.links.forEach((link, index) => {
        formData.append(`links[${index}][platform]`, link.platform);
        formData.append(`links[${index}][url]`, link.url);
    });
    
    return formData;
};
```

### Content-Type Configuration

```typescript
const response = await api.post('/releases', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
```

## Caching Strategy

### Query Caching

- **Stale Time**: 5 minutes for most queries
- **Cache Keys**: Organized by resource type and identifier
- **Background Updates**: Automatic refetching when data becomes stale
- **Optimistic Updates**: Immediate UI updates for mutations

### Cache Invalidation

```typescript
// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['shows'] });
queryClient.invalidateQueries({ queryKey: ['releases'] });
```

## Performance Optimization

### Request Optimization

1. **Query Deduplication**: React Query automatically deduplicates identical requests
2. **Background Refetching**: Data is refetched in the background when stale
3. **Optimistic Updates**: UI updates immediately for better perceived performance
4. **Error Retry**: Automatic retry for failed requests

### Bundle Optimization

1. **Code Splitting**: Route-based code splitting with React Router
2. **Tree Shaking**: Unused code elimination during build
3. **Asset Optimization**: Optimized images and static assets

## Security Considerations

### Authentication

1. **Token Storage**: JWT tokens stored in sessionStorage
2. **Automatic Token Injection**: Tokens automatically added to requests
3. **Token Verification**: Automatic token validation on app load
4. **Secure Logout**: Complete session cleanup on logout

### Error Handling

1. **401 Handling**: Automatic logout and redirect on authentication errors
2. **Error Boundaries**: Component-level error isolation
3. **User Feedback**: Clear error messages for users

---

This API integration documentation provides comprehensive coverage of how the frontend communicates with the backend, handles data, and manages the application state. 