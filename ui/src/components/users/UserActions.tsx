import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { AntDesign } from "@expo/vector-icons";

import { useAuth } from "../../contexts/AuthContext";
import {
  useDeleteFollowMutation,
  useFollowMutation,
} from "../../hooks/follows";
import { usersService } from "../../services";
import { TextField } from "../form";
import { Button, GenericModal, ModalButton } from "../shared";

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
  const [showSignOutModal, setShowSignOutModal] = useState<boolean>(false);

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

  const onCancel = () => {
    setShowSignOutModal(false);
  };

  const onSignOut = () => {
    setShowSignOutModal(true);
  };

  return (
    <View style={styles.container}>
      <GenericModal
        title="Warning"
        content={"Do you want to sign out?"}
        isVisible={showSignOutModal}
        onClose={onCancel}
        actions={
          <View style={styles.modalButtonsContainer}>
            <ModalButton text="Cancel" variant="default" onPress={onCancel} />
            <ModalButton text="Sign Out" variant="error" onPress={signOut} />
          </View>
        }
      />
      {isCurrentUser ? (
        <View style={styles.actionContainer}>
          <Button text="Sign Out" onPress={onSignOut} />
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
  modalButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 10,
    width: "100%",
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
