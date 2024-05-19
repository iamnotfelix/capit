import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "../Button";
import { TextField } from "../form";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { usersService } from "../../services";
import {
  useDeleteFollowMutation,
  useFollowMutation,
} from "../../hooks/follows";

type UserActionsPropsType = {
  isCurrentUser: boolean;
  isFollowing: boolean;
  userId: string;
  onSearchSuccess: (id: string) => void;
};

export const UserActions = (props: UserActionsPropsType) => {
  const { isCurrentUser, isFollowing, userId, onSearchSuccess } = props;

  const {
    signOut,
    auth: {
      tokenResponse: { accessToken: token },
    },
  } = useAuth();

  const followMutation = useFollowMutation();
  const unfollowMutation = useDeleteFollowMutation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValText, setSearchValText] = useState<string>(undefined);
  const [search, setSearch] = useState<string>(undefined);

  const onSearch = async () => {
    try {
      setIsLoading(true);
      const user = await usersService.getUserByUsername(search, token);
      setIsLoading(false);
      onSearchSuccess(user.id);
    } catch (error) {
      setSearchValText("User not found");
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isCurrentUser ? (
        <View style={styles.actionContainer}>
          <Button text="Sign Out" onPress={signOut} />
          <View style={styles.searchContainer}>
            <View style={styles.searchFieldContainer}>
              <TextField
                value={search}
                setValue={setSearch}
                placeholder="Search people"
                validationText={searchValText}
                validationFn={() => {
                  setSearchValText(undefined);
                }}
              />
            </View>
            <View style={styles.searchButtonContainer}>
              <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
                {isLoading ? (
                  <ActivityIndicator size={40} color={"#505050"} />
                ) : (
                  <AntDesign name="search1" size={40} color={"#fff"} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.actionContainer}>
          {isFollowing ? (
            <Button
              text="Unfollow"
              onPress={() =>
                unfollowMutation.mutate({ followingId: userId, token })
              }
            />
          ) : (
            <Button
              text="Follow"
              onPress={() =>
                followMutation.mutate({ followingId: userId, token })
              }
            />
          )}
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
  actionContainer: {
    marginVertical: 15,
    width: "90%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchFieldContainer: {
    flex: 4,
  },
  searchButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 25,
  },
  searchButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#505050",
  },
});
