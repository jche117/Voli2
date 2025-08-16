import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  sub: string; // email
  full_name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<User>(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false); // Set loading to false after checking token
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<User>(newToken);
      localStorage.setItem('access_token', newToken);
      setUser(decoded);
      setToken(newToken);
    } catch (error) {
      console.error('Failed to decode token on login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.roles?.includes('administrator') ?? false;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
