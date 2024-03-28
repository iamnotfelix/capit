import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, View } from "react-native";

interface CameraButtonProps {
  onPress: () => void;
  icon: any;
  color?: string;
  size?: number;
}

export const CameraButton = (props: CameraButtonProps) => {
  const { onPress, icon, size, color } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Entypo
        name={icon}
        size={size ? size : 28}
        color={color ? color : "#f1f1f1"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
