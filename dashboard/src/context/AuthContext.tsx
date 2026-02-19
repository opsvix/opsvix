import { createContext, useContext, useState, useEffect, type ReactNode, } from 'react';
import client from '../api/client';

interface AuthContextType {
    isAuthenticated: boolean;
    admin: { email: string; role: string } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [admin, setAdmin] = useState<{ email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('opsvix_token');
        if (token) {
            client
                .get('/auth/verify')
                .then((res) => {
                    setAdmin(res.data.admin);
                })
                .catch(() => {
                    localStorage.removeItem('opsvix_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await client.post('/auth/login', { email, password });
        localStorage.setItem('opsvix_token', res.data.token);
        setAdmin(res.data.admin);
    };

    const logout = () => {
        localStorage.removeItem('opsvix_token');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!admin,
                admin,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
