import { View, Text, StyleSheet, Touchable } from "react-native";
import { formatDateTimeAgo } from "../../utils";
import { Fontisto } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

type PostHeaderType = {
  username: string;
  created: Date;
  showActions: boolean;
  postId: string;
  onActionsPress: (id: string) => void;
  userId: string;
  onProfilePress: (id: string) => void;
};

export const PostHeader = (props: PostHeaderType) => {
  const {
    username,
    created,
    showActions,
    postId,
    onActionsPress,
    userId,
    onProfilePress,
  } = props;
  // TODO: add profile image when ready
  return (
    <View style={layout.container}>
      <TouchableOpacity onPress={() => onProfilePress(userId)}>
        <View style={layout.postInfoContainer}>
          <Text style={styles.usernameText}>@{username}</Text>
          <Text style={styles.createdText}>
            {formatDateTimeAgo(new Date(created))}
          </Text>
        </View>
      </TouchableOpacity>
      {showActions && (
        <View style={layout.actionsContainer}>
          <TouchableOpacity onPress={() => onActionsPress(postId)}>
            {/* <Entypo name="dots-three-vertical" size={25} color={"#fff"} /> */}
            <Fontisto name="fire" size={25} color={"#fff"} />
          </TouchableOpacity>
        </View>
      )}
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
  actionsContainer: {
    justifyContent: "center",
    marginRight: 10,
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
