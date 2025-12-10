import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // Token is valid, restore user session
          setUser(data.user);
          setToken(storedToken);
        } else {
          // No user data, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("userFirstName");
        }
      } else {
        // Token invalid or expired
        const errorData = await res.json().catch(() => ({}));
        
        // Clear storage regardless of reason (expired or invalid)
        localStorage.removeItem("token");
        localStorage.removeItem("userFirstName");
        setUser(null);
        setToken(null);
        
        // Log for debugging (optional)
        if (errorData.expired) {
          console.log("Session expired. Please login again.");
        }
      }
    } catch (error) {
      // Network error or other issues
      // If offline, keep the token but don't set user (will require re-authentication when online)
      if (!navigator.onLine) {
        console.warn("Offline: Cannot verify token. User will need to login when online.");
        // Clear token if we can't verify it (safer approach)
        localStorage.removeItem("token");
        localStorage.removeItem("userFirstName");
      } else {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userFirstName");
      }
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    if (newUser.firstName) {
      localStorage.setItem("userFirstName", newUser.firstName);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userFirstName");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
