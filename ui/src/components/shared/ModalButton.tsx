import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { ComponentVariant } from "../../models";

type ModalButtonPropsType = {
  text: string;
  variant: ComponentVariant;
  onPress: () => void;
};

export const ModalButton = (props: ModalButtonPropsType) => {
  const { text, variant, onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonContainer,
        {
          backgroundColor:
            variant === "error"
              ? "red"
              : variant === "warning"
              ? "#D5A021"
              : variant === "active"
              ? "#00d0ff"
              : "#000",
        },
      ]}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },
});
