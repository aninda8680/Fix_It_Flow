// navigation/HomeStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home1Camera from "../screens/Home1Camera";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={Home1Camera} />
    </Stack.Navigator>
  );
}
