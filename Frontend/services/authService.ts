import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRequest, postRequest } from "./fetchHelper";
import { refreshAccessToken } from "./tokenService";

const authApiUrlPath = "/auth/v1";

const requestHeaders = {
  "X-Requested-With": "XMLHttpRequest",
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const loginUser = async (username: string, password: string) => {
  console.log("Logging in with:", username, password);

  try {
    const data = await postRequest<
      AuthTokens,
      { username: string; password: string }
    >(
      `${authApiUrlPath}/login`,
      { username, password },
      requestHeaders,
      false,
    );

    await AsyncStorage.setItem("accessToken", data.accessToken);
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
    return true;
  } catch (error) {
    console.error("Login failed", error);
    return false;
  }
};

const getCurrentUserId = async () => {
  console.log("Checking login status...");

  try {
    return await getRequest<string>(
      `${authApiUrlPath}/ping`,
      {
        ...requestHeaders,
        Accept: "text/plain",
      },
      true,
    );
  } catch (error) {
    console.error("Login status check failed", error);
    return null;
  }
};

const refreshToken = refreshAccessToken;

const signUp = async (
  first_name: string,
  last_name: string,
  username: string,
  password: string,
  email: string,
  phone_number: number,
) => {
  console.log(
    "Signing up with:",
    first_name,
    last_name,
    username,
    password,
    email,
    phone_number,
  );
  try {
    const data = await postRequest<
      AuthTokens,
      {
        first_name: string;
        last_name: string;
        username: string;
        password: string;
        email: string;
        phone_number: number;
      }
    >(
      `${authApiUrlPath}/signup`,
      { first_name, last_name, username, password, email, phone_number },
      requestHeaders,
      false,
    );

    await AsyncStorage.setItem("accessToken", data.accessToken);
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
    return true;
  } catch (error) {
    console.error("Signup failed", error);
    return false;
  }
};

const logoutUser = async () => {
  console.log("Logging out user...");
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
};

export {
  loginUser,
  getCurrentUserId,
  refreshToken,
  signUp,
  logoutUser,
};
