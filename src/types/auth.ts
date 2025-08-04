export interface AuthUser {
    id: string;
    username: string;
    role: 'admin';
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
} 