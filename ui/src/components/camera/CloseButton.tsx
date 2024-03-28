import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface CloseButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

export const CloseButton = ({ onPress, color, size }: CloseButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Entypo
          name="cross"
          size={size ? size : 50}
          color={color ? color : "#f1f1f1"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    left: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
