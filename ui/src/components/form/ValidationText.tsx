import { Text, StyleSheet, StyleProp, TextStyle } from "react-native";

type ValidationTextPropsType = {
  text: string;
  style?: StyleProp<TextStyle> | undefined;
};

export const ValidationText = (props: ValidationTextPropsType) => {
  const { text, style } = props;

  return (
    <Text
      style={[
        styles.validationMessage,
        {
          display: text ? "flex" : "none",
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  validationMessage: {
    color: "red",
    position: "absolute",
    top: 0,
  },
});
