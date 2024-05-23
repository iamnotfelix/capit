import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ButtonPropsType = {
  text: string;
  onPress: () => void;
};

export const Button = (props: ButtonPropsType) => {
  const { text, onPress } = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttontext}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: 60,
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#505050",
    justifyContent: "center",
    alignItems: "center",
  },
  buttontext: {
    color: "#fff",
    fontSize: 18,
  },
});
