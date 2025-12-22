// navigation/AppNavigation.tsx
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Auth from "../screens/Auth";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<"Auth" | "Home">("Auth");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        setInitialRoute("Home"); // 🔥 auto-login
      }
      setLoading(false);
    };

    checkLogin();
  }, []);

  if (loading) return null; // splash later

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
