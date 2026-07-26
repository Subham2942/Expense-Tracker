import { getApiUrl } from '@/services/api-config';
import { refreshSession } from '@/services/auth-api';
import { getTokens, saveTokens } from '@/services/token-storage';

export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired. Please log in again.');
    this.name = 'SessionExpiredError';
  }
}

let refreshPromise: ReturnType<typeof refreshSession> | null = null;

async function getRefreshedTokens(refreshToken: string) {
  if (!refreshPromise) {
    refreshPromise = refreshSession(refreshToken).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const apiUrl = getApiUrl();
  const tokens = await getTokens();
  if (!apiUrl || !tokens) throw new SessionExpiredError();

  const send = (accessToken: string) => {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(`${apiUrl}${path}`, {
      ...options,
      headers,
    });
  };

  let response = await send(tokens.accessToken);
  if (response.status !== 401) return response;

  const refreshedTokens = await getRefreshedTokens(tokens.refreshToken);
  if (!refreshedTokens) throw new SessionExpiredError();

  await saveTokens(refreshedTokens);
  response = await send(refreshedTokens.accessToken);
  if (response.status === 401) throw new SessionExpiredError();
  return response;
}
