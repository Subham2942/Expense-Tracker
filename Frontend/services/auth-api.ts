import { getApiUrl } from '@/services/api-config';
import { AuthTokens } from '@/services/token-storage';

const REQUEST_TIMEOUT_MS = 5000;

export type AuthMode = 'login' | 'signup';

export type LoginPayload = {
  username: string;
  password: string;
};

export type SignupPayload = LoginPayload & {
  first_name: string;
  last_name: string;
  email: string;
};

async function authFetch(path: string, options: RequestInit = {}) {
  const apiUrl = getApiUrl();
  if (!apiUrl) throw new Error('The auth API URL is not configured.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${apiUrl}${path}`, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function authenticate(
  mode: AuthMode,
  payload: LoginPayload | SignupPayload
): Promise<AuthTokens> {
  const response = await authFetch(`/auth/v1/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Authentication failed. Please try again.');
  }

  const tokens = (await response.json()) as AuthTokens;
  if (!tokens.accessToken || !tokens.refreshToken) {
    throw new Error('The auth service returned an invalid token response.');
  }
  return tokens;
}

export async function pingSession(accessToken: string) {
  return authFetch('/auth/v1/ping', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function refreshSession(refreshToken: string): Promise<AuthTokens | null> {
  const response = await authFetch('/auth/v1/refreshToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) return null;

  const tokens = (await response.json()) as AuthTokens;
  if (!tokens.accessToken || !tokens.refreshToken) return null;
  return tokens;
}

export async function revokeSession(refreshToken: string) {
  await authFetch('/auth/v1/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
}
