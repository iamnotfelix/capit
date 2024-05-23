import { View, Text, StyleSheet, Touchable } from "react-native";
import { formatDateTimeAgo } from "../../utils";
import { Fontisto } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";

type PostHeaderType = {
  username: string;
  created: Date;
  showActions: boolean;
  postId: string;
  userId: string;
  profileImage: string;
  onActionsPress: (id: string) => void;
  onProfilePress: (id: string) => void;
};

export const PostHeader = (props: PostHeaderType) => {
  const {
    username,
    created,
    showActions,
    postId,
    userId,
    profileImage,
    onActionsPress,
    onProfilePress,
  } = props;
  return (
    <View style={layout.container}>
      <TouchableOpacity onPress={() => onProfilePress(userId)}>
        <View style={layout.profileContainer}>
          <View style={layout.profilePictureContainer}>
            <FastImage
              source={
                profileImage
                  ? {
                      uri: `${process.env.S3_URL}${profileImage}`,
                    }
                  : require("../../../assets/defaultProfileDark.png")
              }
              style={styles.profilePicture}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={layout.postInfoContainer}>
            <Text style={styles.usernameText}>@{username}</Text>
            <Text style={styles.createdText}>
              {formatDateTimeAgo(new Date(created))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {showActions && (
        <View style={layout.actionsContainer}>
          <TouchableOpacity onPress={() => onActionsPress(postId)}>
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
  profileContainer: {
    flexDirection: "row",
  },
  profilePictureContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
  postInfoContainer: {
    justifyContent: "space-around",
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
  profilePicture: {
    borderRadius: 50,
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: "#00d0ff",
  },
});
