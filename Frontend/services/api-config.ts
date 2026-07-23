import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getApiUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/$/, '');
  if (!configuredUrl || Platform.OS === 'web') return configuredUrl;

  try {
    const url = new URL(configuredUrl);
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') return configuredUrl;

    const developmentHost = Constants.expoConfig?.hostUri?.split(':')[0];
    if (developmentHost && developmentHost !== 'localhost' && developmentHost !== '127.0.0.1') {
      url.hostname = developmentHost;
      return url.toString().replace(/\/$/, '');
    }

    if (Platform.OS === 'android') {
      url.hostname = '10.0.2.2';
      return url.toString().replace(/\/$/, '');
    }
  } catch {
    return configuredUrl;
  }

  return configuredUrl;
}
