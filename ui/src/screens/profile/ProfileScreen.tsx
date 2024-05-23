import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useQueryClient } from "@tanstack/react-query";

import { BottomTabBar } from "../../components/navigation";
import { PostList } from "../../components/posts";
import {
  GenericModal,
  LoadingIndicator,
  ModalButton,
} from "../../components/shared";
import { UserProfile } from "../../components/users";
import { useAuth } from "../../contexts/AuthContext";
import { useIsFollowing } from "../../hooks/follows";
import { postsKeys, usePostByUserId } from "../../hooks/posts";
import { useDeletePostMutation } from "../../hooks/posts/useDeletePostMutation";
import {
  usersKeys,
  useUpdateProfileImageMutation,
  useUserById,
} from "../../hooks/users";
import { MainStackScreenProps } from "../../navigation/types";
import { uploadToS3 } from "../../utils";

export const ProfileScreen = ({
  navigation,
  route,
}: MainStackScreenProps<"Profile">) => {
  const {
    auth: {
      tokenResponse: { accessToken: token },
      user: { id: currentUserId },
    },
  } = useAuth();

  const queryClient = useQueryClient();
  const deletePostMutation = useDeletePostMutation();
  const updateProfileImageMutation = useUpdateProfileImageMutation();
  const { data: user, isLoading: isUserLoading } = useUserById(
    route.params.id,
    token
  );
  const { data: posts, isLoading: isPostsLoading } = usePostByUserId(
    route.params.id,
    token
  );
  const { data: isFollowing, isLoading: isFollowingLoading } = useIsFollowing(
    route.params.id,
    token
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showBurnModal, setShowBurnModal] = useState<boolean>(false);
  const [showProfileImageModal, setShowProfileImageModal] =
    useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<string>(undefined);

  const onRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: postsKeys.postsByUserId(route.params.id, token),
    });
    queryClient.invalidateQueries({
      queryKey: usersKeys.userById(route.params.id, token),
    });
  };

  const onActionPress = async (postId: string) => {
    setSelectedPost(postId);
    setShowBurnModal(true);
  };

  const onBurn = async () => {
    setShowBurnModal(false);
    setIsLoading(true);
    await deletePostMutation.mutateAsync({ postId: selectedPost, token });
    setIsLoading(false);
    setSelectedPost(undefined);
  };

  const onCancelBurn = () => {
    setShowBurnModal(false);
    setSelectedPost(undefined);
  };

  const onProfilePress = (userId: string) => {
    navigation.navigate("Profile", { id: userId });
  };

  const onSearchSuccess = (userId: string) => {
    navigation.navigate("Profile", { id: userId });
  };

  const onRemoveProfileImage = async () => {
    try {
      setIsLoading(true);
      await updateProfileImageMutation.mutateAsync({
        profileImage: "",
        token,
        currentUserId,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onUpdateProfileImage = async () => {
    setShowProfileImageModal(false);

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      setIsLoading(true);

      const image = await fetch(result.assets[0].uri);
      const blob = await image.blob();
      const { key, error } = await uploadToS3(blob, currentUserId);

      if (error) {
        setIsLoading(false);
        return;
      }

      await updateProfileImageMutation.mutateAsync({
        profileImage: key,
        token,
        currentUserId,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getIsLoading = () => {
    return isUserLoading || isPostsLoading || isLoading || isFollowingLoading;
  };

  if (getIsLoading()) {
    return <LoadingIndicator />;
  }

  return (
    <View style={layout.container}>
      <GenericModal
        title="Change profile image"
        content={"Do you want to change your profile image?"}
        isVisible={showProfileImageModal}
        onClose={() => setShowProfileImageModal(false)}
        actions={
          <View style={layout.actionsContainer}>
            <ModalButton
              text="Cancel"
              variant="default"
              onPress={() => setShowProfileImageModal(false)}
            />
            <ModalButton
              text="Remove"
              variant="error"
              onPress={onRemoveProfileImage}
            />
            <ModalButton
              text="Upload"
              variant="active"
              onPress={onUpdateProfileImage}
            />
          </View>
        }
      />
      <GenericModal
        title="Warning"
        content={"Do you want to burn the post?"}
        isVisible={showBurnModal}
        onClose={onCancelBurn}
        actions={
          <View style={layout.actionsContainer}>
            <ModalButton
              text="Cancel"
              variant="default"
              onPress={onCancelBurn}
            />
            <ModalButton text="Burn" variant="error" onPress={onBurn} />
          </View>
        }
      />
      <PostList
        posts={posts}
        isRefreshing={isPostsLoading}
        onRefresh={onRefresh}
        header={() => (
          <UserProfile
            user={user}
            postCount={posts.length}
            isCurrentUser={currentUserId === route.params.id}
            isFollowing={isFollowing}
            onSearchSuccess={onSearchSuccess}
            onProfilePress={() => setShowProfileImageModal(true)}
          />
        )}
        isHeaderSticky={false}
        showActions={currentUserId == route.params.id}
        onActionsPress={onActionPress}
        onProfilePress={onProfilePress}
      />
      <BottomTabBar currentScreen="Profile" navigation={navigation} />
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  signoutContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 10,
    width: "100%",
  },
});
