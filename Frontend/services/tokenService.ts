import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const authApiUrlPath = "/auth/v1";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

let refreshInProgress: Promise<boolean> | null = null;

const performTokenRefresh = async (): Promise<boolean> => {
  const storedRefreshToken =
    await AsyncStorage.getItem("refreshToken");

  if (!storedRefreshToken) {
    return false;
  }

  if (!API_URL) {
    console.error("EXPO_PUBLIC_API_URL is not configured");
    return false;
  }

  try {
    const response = await fetch(
      `${API_URL}${authApiUrlPath}/refreshToken`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          token: storedRefreshToken,
        }),
      },
    );

    if (!response.ok) {
      const message = await response.text();

      console.error(
        message ||
          `Token refresh failed with status ${response.status}`,
      );

      return false;
    }

    const tokens = (await response.json()) as AuthTokens;

    if (!tokens.accessToken || !tokens.refreshToken) {
      console.error("Refresh response did not contain both tokens");
      return false;
    }

    await Promise.all([
      AsyncStorage.setItem("accessToken", tokens.accessToken),
      AsyncStorage.setItem("refreshToken", tokens.refreshToken),
    ]);

    return true;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    return false;
  }
};

export const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshInProgress) {
    refreshInProgress = performTokenRefresh().finally(() => {
      refreshInProgress = null;
    });
  }

  return refreshInProgress;
};