declare module "react-native-vector-icons/Feather" {
    import { Component } from "react";
    import { TextStyle } from "react-native";
  
    export interface IconProps {
      name: string;
      size?: number;
      color?: string;
      style?: TextStyle;
    }
  
    export default class Feather extends Component<IconProps> {}
  }
  