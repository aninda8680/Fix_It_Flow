import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Pressable } from "react-native";
import HomeStack from "./HomeStack";
import Home2Profile from "../screens/Home2Profile";
import { Camera, Menu } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const activeIndex = state.index;

        return (
          <View style={styles.wrapper}>
            <View style={styles.container}>
              {/* LEFT HALF */}
              <Pressable
                style={styles.half}
                onPress={() => navigation.navigate("Home1")}
              >
                <Camera
                  size={26}
                  strokeWidth={2.2}
                  color={activeIndex === 0 ? "#fff" : "#9ca3af"}
                />
              </Pressable>

              {/* CENTER DIVIDER */}
              <View style={styles.divider} />

              {/* RIGHT HALF */}
              <Pressable
                style={styles.half}
                onPress={() => navigation.navigate("Home2")}
              >
                <Menu
                  size={26}
                  strokeWidth={2.2}
                  color={activeIndex === 1 ? "#fff" : "#9ca3af"}
                />
              </Pressable>
            </View>
          </View>
        );
      }}
    >
      <Tab.Screen name="Home1" component={HomeStack} />
      <Tab.Screen name="Home2" component={Home2Profile} />
    </Tab.Navigator>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },

  container: {
    height: 68,
    width: "100%",
    borderRadius: 34,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",

    // shadow (correct)
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  half: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    width: StyleSheet.hairlineWidth,
    height: "60%",
    backgroundColor: "#2a2a2a",
  },
});
