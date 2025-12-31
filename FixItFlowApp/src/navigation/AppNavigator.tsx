import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";

import Auth from "../screens/Auth";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="App" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={Auth} />
      )}
    </Stack.Navigator>
  );
}
