import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "../services/userService";

import {
  getCurrentUserId,
  loginUser,
  logoutUser,
  signUp as signUpUser,
} from "../services/authService";
import { UserDetails } from "../constants/types/UserType";


type AuthContextValue = {
  user: UserDetails | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    phoneNumber: number,
  ) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
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

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error("Failed to load user details", e);
      await logoutUser();
      setUser(null);
      return false;
    }
    return true;
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
  };

  const signup = async (
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    phoneNumber: number,
  ): Promise<boolean> => {
    const successful = await signUpUser(
      firstName,
      lastName,
      username,
      password,
      email,
      phoneNumber,
    );

    if (!successful) {
      return false;
    }

    const userId = await getCurrentUserId();

    if (!userId) {
      await logoutUser();
      return false;
    }

    setUser({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      profile_picture: null,
    });

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        signup,
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
