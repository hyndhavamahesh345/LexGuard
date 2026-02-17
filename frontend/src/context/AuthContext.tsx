import React, { createContext, useContext, useEffect, useState } from "react";

type User = { email: string } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  login: (email: string, token?: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) as User : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = (email: string, t?: string) => {
    const newToken = t ?? "demo-token"; // replace with actual token from server
    setToken(newToken);
    setUser({ email });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // optionally call server logout endpoint here
  };

  const isAuthenticated = () => Boolean(token);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};