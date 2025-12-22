import axios from "axios";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import {
  BACKEND_API_ANDROID_EMULATOR,
  BACKEND_API_DEVICE,
  BACKEND_API_PROD,
} from "@env";

/*
  ENV LOGIC:
  - __DEV__ === true  → local development
  - __DEV__ === false → production build (APK / Play Store)
*/

// Get initial base URL (synchronous fallback)
const getInitialBaseURL = () => {
  if (!__DEV__) {
    // Production build → Render
    return BACKEND_API_PROD || "https://fixitflow-backend.onrender.com";
  }

  // Development - default to device URL for Android (will be updated if emulator detected)
  if (Platform.OS === "android") {
    return BACKEND_API_DEVICE || "http://192.168.0.133:5000";
  }

  // iOS simulator or physical device - use your computer's IP
  return BACKEND_API_DEVICE || "http://localhost:5000";
};

// Initialize with default URL (defaults to device URL for Android)
let baseURL = getInitialBaseURL();

console.log("🌐 API Base URL (initial):", baseURL);
console.log("📱 Platform:", Platform.OS);
console.log("🔧 Dev Mode:", __DEV__);

const api = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Check if emulator and update URL if needed (async, runs after initialization)
if (__DEV__ && Platform.OS === "android") {
  DeviceInfo.isEmulator().then((isEmulator) => {
    if (isEmulator) {
      const emulatorURL = BACKEND_API_ANDROID_EMULATOR || "http://10.0.2.2:5000";
      baseURL = emulatorURL;
      api.defaults.baseURL = emulatorURL;
      console.log("🔄 Updated to Emulator URL:", emulatorURL);
    } else {
      const deviceURL = BACKEND_API_DEVICE || "http://192.168.0.133:5000";
      baseURL = deviceURL;
      api.defaults.baseURL = deviceURL;
      console.log("🔄 Confirmed Physical Device URL:", deviceURL);
    }
  }).catch((err) => {
    console.log("⚠️ Could not detect device type, using default:", baseURL);
  });
}

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.log("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("📥 API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("❌ Response Error:", {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      url: error?.config?.url,
    });
    return Promise.reject(error);
  }
);

export default api;
