// screens/Home2Profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

const API_URL = "http://192.168.0.133:5000";

export default function Home2Profile() {
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (!token) return;

      const res = await fetch(`${API_URL}/api/complaints/my-complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setComplaints(data.complaints);
    } catch (err) {
      console.error("PROFILE ERROR 👉", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Ambient Gradient */}
      <View style={styles.gradient}>
        <Svg height="100%" width="100%" style={{ opacity: 0.3 }}>
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="0%"
              rx="80%"
              ry="80%"
              fx="50%"
              fy="0%"
            >
              <Stop offset="0" stopColor="#3b82f6" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* PAGE HEADER */}
        <View style={styles.pageHeader}>
          <View style={styles.accentBar} />
          <View>
            <Text style={styles.pageTitle}>Profile</Text>
            <Text style={styles.pageSubtitle}>
              Your account & submitted issues
            </Text>
          </View>
        </View>

        {/* PROFILE CARD */}
        {user && (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName?.[0]}
              </Text>
            </View>

            <View>
              <Text style={styles.name}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
        )}

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Previous Complaints</Text>
        </View>

        {/* COMPLAINT LIST */}
        {complaints.length === 0 ? (
          <Text style={styles.empty}>
            No complaints submitted yet
          </Text>
        ) : (
          complaints.map((item) => (
            <View key={item._id} style={styles.card}>
              <Text style={styles.desc}>{item.description}</Text>

              <View style={styles.row}>
                <Text style={styles.date}>
                  {new Date(item.createdAt).toDateString()}
                </Text>

                <View
                  style={[
                    styles.status,
                    item.status === "pending"
                      ? styles.pending
                      : item.status === "resolved"
                      ? styles.resolved
                      : styles.inProgress,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },

  /* PAGE HEADER */
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
  },
  accentBar: {
    width: 4,
    height: 32,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
    marginRight: 14,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  pageSubtitle: {
    color: "#a1a1aa",
    fontSize: 15,
    marginTop: 4,
  },

  /* PROFILE CARD */
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  email: {
    color: "#a1a1aa",
    fontSize: 14,
    marginTop: 2,
  },

  /* SECTION */
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  empty: {
    color: "#71717a",
    textAlign: "center",
    marginTop: 40,
  },

  /* COMPLAINT CARD */
  card: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  desc: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#71717a",
    fontSize: 12,
  },

  /* STATUS */
  status: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  pending: { backgroundColor: "#facc15" },
  inProgress: { backgroundColor: "#38bdf8" },
  resolved: { backgroundColor: "#4ade80" },
});
