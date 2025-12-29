import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  type UserData,
  getUserData,
  setUserData as saveUserData,
  setAuthTokens,
  getAccessToken,
  clearAuthData,
} from "~/utils/cookies";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (user: UserData, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  accessToken: string | null;
  updateUserData: (userData: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user data and token from cookies on mount (client-side only)
    const userData = getUserData();
    const token = getAccessToken();

    if (userData && token) {
      setUser(userData);
      setAccessToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: UserData, access: string, refresh: string) => {
    // Save to cookies
    saveUserData(userData);
    setAuthTokens(access, refresh);

    // Update state
    setUser(userData);
    setAccessToken(access);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const updateUserData = (updatedData: Partial<UserData>) => {
    if (user) {
      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);
      saveUserData(newUserData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        accessToken,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
