import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUserId,
  refreshToken,
  loginUser,
  logoutUser
} from "../services/authService";

type AuthUser = {
  userId: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: ()=> Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        let userId = await getCurrentUserId();

        if (!userId) {
          const refreshed = await refreshToken();

          if (refreshed) {
            userId = await getCurrentUserId();
          }
        }

        setUser(userId ? { userId } : null);
      } catch (error) {
        console.error("Failed to restore session", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const successful = await loginUser(username, password);

    if (!successful) {
      return false;
    }

    const userId = await getCurrentUserId();

    if (!userId) {
      return false;
    }

    setUser({ userId });
    return true;
  };

  const logout = async () : Promise<void> => {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
