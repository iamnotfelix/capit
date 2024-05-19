import { View, StyleSheet, Text } from "react-native";

export const NoPosts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No posts to show!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
});
