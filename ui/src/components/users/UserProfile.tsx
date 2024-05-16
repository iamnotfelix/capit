import { View, StyleSheet, Text } from "react-native";
import { User } from "../../models";
import FastImage from "react-native-fast-image";
import { Button } from "../Button";
import { useAuth } from "../../contexts/AuthContext";

type UserProfilePropsType = {
  user: User;
  postCount: number;
  isCurrentUser: boolean;
};

export const UserProfile = (props: UserProfilePropsType) => {
  const { user, postCount, isCurrentUser } = props;

  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>@{user.username}</Text>
      </View>
      <View style={styles.profilePictureContainer}>
        <FastImage
          source={{
            uri: `${process.env.S3_URL}9775c3f0-296d-4fcc-aa3c-bb8bf59a3ee6/dc5dfbfb-8e8e-4b8f-97f9-3fb5eac125e4.jpeg`,
          }}
          style={styles.profilePicture}
          resizeMode={FastImage.resizeMode.cover}
        />
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
          <Text style={styles.statNameText}>Friends</Text>
          <Text style={styles.statValueText}>{0}</Text>
        </View>
      </View>
      {isCurrentUser ? (
        <View style={styles.actionContainer}>
          <Button text="Sign Out" onPress={signOut} />
        </View>
      ) : (
        <View style={styles.actionContainer}>
          <Button text="Add Friend" onPress={() => {}} />
        </View>
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
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
  statContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  actionContainer: {
    marginVertical: 15,
    width: "90%",
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
    borderColor: "#505050",
  },
});
