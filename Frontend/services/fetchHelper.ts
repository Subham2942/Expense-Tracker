import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from "./tokenService";
import { logoutUser } from "./authService";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiRequestOptions<T> = {
  headers?: HeadersInit;
  body?: T;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const apiRequest = async <TResponse, TBody = undefined>(
  path: string,
  method: HTTPMethod,
  options: ApiRequestOptions<TBody> = {},
  sendToken: boolean = true,
): Promise<TResponse> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (sendToken) headers.set("Authorization", `Bearer ${accessToken}`);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`Hitting API: ${API_URL}${path}`);

  let response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 401 && sendToken) {
    console.log("Auth failed. Trying to refresh token")
  const refreshed = await refreshAccessToken();

  if (refreshed) {
    console.log(`Refreshed succesfully, trying the api ${API_URL}${path} again`);
    const newAccessToken =
      await AsyncStorage.getItem("accessToken");

    headers.set(
      "Authorization",
      `Bearer ${newAccessToken}`,
    );

    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body:
        options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
    });
  }
}

  if (!response.ok) {

    console.log("API FAILED");

    const message = await response.text();

    await logoutUser();

    throw new Error(message || `Request Failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json() as Promise<TResponse>;
  }

  return response.text() as Promise<TResponse>;
};

export const getRequest = <TResponse>(
  path: string,
  headers?: HeadersInit,
  sendToken: boolean = true,
) => {
  return apiRequest<TResponse>(path, "GET", { headers }, sendToken);
};

export const postRequest = <TResponse, TBody>(
  path: string,
  body: TBody,
  headers?: HeadersInit,
  sendToken: boolean = true,
) => {
  return apiRequest<TResponse, TBody>(
    path,
    "POST",
    {
      body,
      headers,
    },
    sendToken,
  );
};

export const putRequest = <TResponse, TBody>(
  path: string,
  body: TBody,
  headers?: HeadersInit,
  sendToken: boolean = true,
) => {
  return apiRequest<TResponse, TBody>(
    path,
    "PUT",
    {
      body,
      headers,
    },
    sendToken,
  );
};

export const deleteRequest = <TResponse>(
  path: string,
  headers?: HeadersInit,
  sendToken: boolean = true,
) => {
  return apiRequest<TResponse>(path, "DELETE", { headers }, sendToken);
};

export default apiRequest;
