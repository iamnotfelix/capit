import { View, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { BottomTabBar, CameraButton } from "../../components/navigation";
import { MainStackScreenProps } from "../../navigation/types";
import { useAttemptsLeft } from "../../hooks/attempts";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { postsKeys, useAllPosts } from "../../hooks/posts";
import { PostList } from "../../components/posts";
import { useQueryClient } from "@tanstack/react-query";

export const HomeScreen = ({ navigation }: MainStackScreenProps<"Home">) => {
  const { auth, isLoading } = useAuth();

  const queryClient = useQueryClient();
  const { data: attemptsLeft, isLoading: isAttemptsLeftLoading } =
    useAttemptsLeft(auth?.tokenResponse.accessToken);
  const { data: allPosts, isLoading: isAllPostsLoading } = useAllPosts(
    auth?.tokenResponse.accessToken
  );

  const onRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: postsKeys.allPosts(auth?.tokenResponse.accessToken),
    });
  };

  const getIsLoading = () => {
    return isLoading || isAttemptsLeftLoading || isAllPostsLoading;
  };

  if (getIsLoading()) {
    return <LoadingIndicator />;
  }

  return (
    <View style={layout.container}>
      {attemptsLeft > 0 && <CameraButton navigation={navigation} />}
      <PostList
        posts={allPosts}
        onRefresh={onRefresh}
        isRefreshing={isAllPostsLoading}
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
