import { View, Text, StyleSheet, TextInput } from "react-native";
import { ValidationText } from "./ValidationText";

type TextFieldPropsType = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  validationText: string;
  validationFn: (value: string) => void;
  secureTextEntry?: boolean;
};

export const TextField = (props: TextFieldPropsType) => {
  const {
    value,
    setValue,
    placeholder,
    validationText,
    validationFn,
    secureTextEntry,
  } = props;

  return (
    <View style={styles.inputContainer}>
      <ValidationText text={validationText} style={{ left: 0 }} />
      <TextInput
        value={value}
        onChangeText={setValue}
        onEndEditing={() => validationFn(value)}
        style={[
          styles.textInput,
          {
            borderColor: validationText ? "red" : "#505050",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={"#505050"}
        secureTextEntry={!!secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 25,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#000",
    borderColor: "#505050",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,

    color: "#fff",
    fontSize: 18,
  },
  validationMessage: {
    color: "red",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
