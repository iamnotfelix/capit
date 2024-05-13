import { Text, StyleSheet, View } from "react-native";

type PostFooterType = {
  caption: string;
};

export const PostFooter = (props: PostFooterType) => {
  const { caption } = props;
  return (
    <View style={layout.container}>
      <Text style={styles.text}>{caption}</Text>
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontStyle: "italic",
  },
});
