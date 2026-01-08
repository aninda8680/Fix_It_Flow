import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";

type BlurHeaderProps = {
  scrollY: SharedValue<number>;
  height?: number;
};

export default function BlurHeader({
  scrollY,
  height = 100,
}: BlurHeaderProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 60],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height,
          zIndex: 10,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.9)",
          "rgba(0,0,0,0.5)",
          "rgba(0,0,0,0)",
        ]}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}
