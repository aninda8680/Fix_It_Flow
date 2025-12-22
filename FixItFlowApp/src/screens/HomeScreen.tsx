import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log("📦 Loading user from AsyncStorage...");

      const storedUser = await AsyncStorage.getItem("user");
      console.log("📦 Raw stored user:", storedUser);

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        console.log("✅ Parsed user:", parsed);
        setUser(parsed);
      } else {
        console.log("❌ No user found in AsyncStorage");
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <Text style={{ color: "#fff" }}>No user found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 50 }}>
      <Text style={{ color: "#FFFFFF", fontSize: 22 }}>Welcome 👋</Text>
      <Text style={{ color: "#aaa", fontSize: 18 }}>
        {user.firstName} {user.lastName}
      </Text>
    </View>
  );
}
