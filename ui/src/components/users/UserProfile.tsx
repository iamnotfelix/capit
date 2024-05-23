import { View, StyleSheet, Text } from "react-native";
import { User } from "../../models";
import FastImage from "react-native-fast-image";
import { UserActions } from "./UserActions";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";

type UserProfilePropsType = {
  user: User;
  postCount: number;
  isCurrentUser: boolean;
  isFollowing: boolean;
  onSearchSuccess: (id: string) => void;
  onProfilePress: () => void;
};

export const UserProfile = (props: UserProfilePropsType) => {
  const {
    user,
    postCount,
    isCurrentUser,
    isFollowing,
    onSearchSuccess,
    onProfilePress,
  } = props;

  const [showActions, setShowActions] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>@{user.username}</Text>
      </View>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={onProfilePress}>
          <FastImage
            source={
              user.profileImage
                ? {
                    uri: `${process.env.S3_URL}${user.profileImage}`,
                  }
                : require("../../../assets/defaultProfileDark.png")
            }
            style={styles.profilePicture}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statContainer}>
          <Text style={styles.statNameText}>Posts</Text>
          <Text style={styles.statValueText}>{postCount.toString()}</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statNameText}>Score</Text>
          <Text style={[styles.statValueText, { color: "#00d0ff" }]}>
            {user.score.toString()}
          </Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statNameText}>Followers</Text>
          <Text style={styles.statValueText}>{user.followers.length}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setShowActions((old) => !old)}>
        <Entypo
          name={showActions ? "chevron-thin-up" : "chevron-thin-down"}
          size={25}
          color={"#fff"}
        />
      </TouchableOpacity>
      {showActions && (
        <UserActions
          isCurrentUser={isCurrentUser}
          isFollowing={isFollowing}
          userId={user.id}
          onSearchSuccess={onSearchSuccess}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  profilePictureContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  statContainer: {
    flex: 1,
    marginVertical: 10,
    alignItems: "center",
  },

  usernameText: {
    color: "#FFF",
    fontSize: 25,
    fontWeight: "700",
  },
  statNameText: {
    color: "#505050",
    fontSize: 18,
    fontWeight: "900",
  },
  statValueText: {
    color: "#FFF",
    fontSize: 25,
    fontWeight: "900",
  },
  profilePicture: {
    borderRadius: 200,
    height: 200,
    width: 200,
    borderWidth: 2,
    borderColor: "#00d0ff",
  },
});
