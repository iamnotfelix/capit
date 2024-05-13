import { View, Text, StyleSheet } from "react-native";
import { formatDateTimeAgo } from "../../utils";

type PostHeaderType = {
  username: string;
  created: Date;
};

export const PostHeader = (props: PostHeaderType) => {
  const { username, created } = props;
  // TODO: add profile image when ready
  // TODO: give options on posts when used on profile screen
  return (
    <View style={layout.container}>
      <View style={layout.postInfoContainer}>
        <Text style={styles.usernameText}>@{username}</Text>
        <Text style={styles.createdText}>
          {formatDateTimeAgo(new Date(created))}
        </Text>
      </View>
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    padding: 10,
  },
  postInfoContainer: {
    justifyContent: "space-between",
  },
});

const styles = StyleSheet.create({
  usernameText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  createdText: {
    color: "#FFF",
    fontStyle: "italic",
  },
});
