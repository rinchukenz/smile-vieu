import { StyleSheet, View } from "react-native";


interface HorizontalLineProps {
    color?: string;
    thickness?: number;
    margin?: number;
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({ color = '#ccc', thickness = StyleSheet.hairlineWidth, margin = 10 }) => (
  <View
    style={{
      borderBottomColor: color,
      borderBottomWidth: thickness,
      marginVertical: margin,
      width: "100%",
    }}
  />
);

export default HorizontalLine;
