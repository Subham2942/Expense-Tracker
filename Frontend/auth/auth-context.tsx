import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { pingSession, refreshSession, revokeSession } from '@/services/auth-api';
import { AuthTokens, clearTokens, getTokens, saveTokens } from '@/services/token-storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function revokeRefreshToken(refreshToken: string | null) {
  if (refreshToken) await revokeSession(refreshToken);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const storedTokens = await getTokens();
        if (!storedTokens) return;

        const pingResponse = await pingSession(storedTokens.accessToken);
        if (pingResponse.ok) {
          if (isMounted) setTokens(storedTokens);
          return;
        }

        const refreshedTokens = await refreshSession(storedTokens.refreshToken);
        if (!refreshedTokens) {
          await Promise.allSettled([clearTokens()]);
          return;
        }

        await saveTokens(refreshedTokens);
        if (isMounted) setTokens(refreshedTokens);
      } catch {
        // A session that cannot be validated or refreshed is treated as signed
        // out. This also prevents stale credentials from surviving startup.
        await Promise.allSettled([clearTokens()]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(tokens),
    isLoading,
    login: async (nextTokens) => {
      await saveTokens(nextTokens);
      setTokens(nextTokens);
    },
    logout: async () => {
      const refreshToken = tokens?.refreshToken ?? null;

      // Changing this first activates the route guard immediately. Storage and
      // server cleanup cannot prevent navigation back to the login screen.
      setTokens(null);
      await Promise.allSettled([
        clearTokens(),
        revokeRefreshToken(refreshToken),
      ]);
    },
  }), [isLoading, tokens]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
