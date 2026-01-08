import React from "react";
import { Text, TextProps } from "react-native";

type FontWeight =
  | "regular"
  | "medium"
  | "semibold"
  | "bold";

interface AppTextProps extends TextProps {
  weight?: FontWeight;
  color?: string;
  size?: number;
}

const FONT_MAP: Record<FontWeight, string> = {
  regular: "Raleway-Regular",
  medium: "Raleway-Medium",
  semibold: "Raleway-SemiBold",
  bold: "Raleway-Bold",
};

export default function AppText({
  children,
  weight = "regular",
  color = "#fff",
  size = 14,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: FONT_MAP[weight],
          color,
          fontSize: size,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
