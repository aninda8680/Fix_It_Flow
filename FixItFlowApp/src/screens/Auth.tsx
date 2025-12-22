//Auth.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Auth({ navigation }: any) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await api.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });

                // SAVE TOKEN (🔥 key line)
        await AsyncStorage.setItem("token", res.data.token);

        // optional: save user
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

        navigation.replace("Home");

      } else {
        await api.post("/api/auth/register", form);
        Alert.alert("Success", "Account created. Please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.log("AUTH ERROR 👉", err?.response || err?.message || err);
      console.log("Error details:", {
        message: err?.message,
        code: err?.code,
        response: err?.response?.data,
        status: err?.response?.status,
        baseURL: api.defaults.baseURL,
      });
      
      let errorMessage = "Unknown error";
      
      if (err?.message === "Network Error" || err?.code === "NETWORK_ERROR" || err?.code === "ECONNREFUSED") {
        errorMessage = `Network Error: Cannot connect to server.\n\nPlease check:\n1. Backend server is running\n2. Correct IP address in .env\n3. Device and server are on same network\n\nBase URL: ${api.defaults.baseURL}`;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin ? "Welcome Back" : "Create Account"}
      </Text>

      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#888"
            onChangeText={(v) => handleChange("firstName", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#888"
            onChangeText={(v) => handleChange("lastName", v)}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        onChangeText={(v) => handleChange("email", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={(v) => handleChange("password", v)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isLogin ? "Login" : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
    color: "#fff",
  },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  switchText: {
    marginTop: 20,
    textAlign: "center",
    color: "#aaa",
  },
});
