import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeStack from "./HomeStack";
import Home2Profile from "../screens/Home2Profile";
import { Camera, Menu } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const activeIndex = state.index;

        return (
          <View style={styles.wrapper}>
            <View
              style={[
                styles.container,
                { paddingBottom: insets.bottom }, // ✅ avoids gesture bar
              ]}
            >
              {/* LEFT */}
              <Pressable
                style={styles.half}
                onPress={() => navigation.navigate("Home1")}
              >
                <Camera
                  size={26}
                  strokeWidth={2.2}
                  color={activeIndex === 0 ? "#4c85ffff" : "#edededff"}
                />
              </Pressable>

              <View style={styles.divider} />

              {/* RIGHT */}
              <Pressable
                style={styles.half}
                onPress={() => navigation.navigate("Home2")}
              >
                <Menu
                  size={26}
                  strokeWidth={2.2}
                  color={activeIndex === 1 ? "#4c85ffff" : "#ffffffff"}
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



const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // ✅ touches screen bottom
  },

  container: {
    minHeight: 68,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",

    // only top rounded
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    overflow: "hidden",

    // shadow
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },

  half: {
    flex: 1,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    width: StyleSheet.hairlineWidth,
    height: "60%",
    backgroundColor: "#2a2a2a",
  },
});
