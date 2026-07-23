import { getApiUrl } from '@/services/api-config';
import { AuthTokens } from '@/services/token-storage';

const REQUEST_TIMEOUT_MS = 5000;

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
