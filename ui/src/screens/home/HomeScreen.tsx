import { StyleSheet, View } from "react-native";

import { useQueryClient } from "@tanstack/react-query";

import { BottomTabBar, CameraButton } from "../../components/navigation";
import { PostList } from "../../components/posts";
import { Header, LoadingIndicator } from "../../components/shared";
import { useAuth } from "../../contexts/AuthContext";
import { useAttemptsLeft } from "../../hooks/attempts";
import {
  postsKeys,
  useCanPostToday,
  useFollowingsPosts,
} from "../../hooks/posts";
import { MainStackScreenProps } from "../../navigation/types";

export const HomeScreen = ({ navigation }: MainStackScreenProps<"Home">) => {
  const {
    auth: {
      tokenResponse: { accessToken: token },
    },
    isLoading,
  } = useAuth();

  const queryClient = useQueryClient();
  const { data: attemptsLeft, isLoading: isAttemptsLeftLoading } =
    useAttemptsLeft(token);
  const { data: allPosts, isLoading: isAllPostsLoading } =
    useFollowingsPosts(token);
  const { data: canPostToday, isLoading: isCanPostTodayLoading } =
    useCanPostToday(token);

  const onRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: postsKeys.followingsPosts(token),
    });
  };

  const onProfilePress = (userId: string) => {
    navigation.navigate("Profile", { id: userId });
  };

  const getIsLoading = () => {
    return (
      isLoading ||
      isAttemptsLeftLoading ||
      isAllPostsLoading ||
      isCanPostTodayLoading
    );
  };

  if (getIsLoading()) {
    return <LoadingIndicator />;
  }

  return (
    <View style={layout.container}>
      {attemptsLeft > 0 && canPostToday && (
        <CameraButton navigation={navigation} />
      )}
      <PostList
        posts={allPosts}
        onRefresh={onRefresh}
        isRefreshing={isAllPostsLoading}
        header={Header}
        isHeaderSticky={true}
        showActions={false}
        onProfilePress={onProfilePress}
      />
      <BottomTabBar currentScreen="Home" navigation={navigation} />
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

const styles = StyleSheet.create({});
