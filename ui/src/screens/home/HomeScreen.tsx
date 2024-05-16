import { View, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { BottomTabBar, CameraButton } from "../../components/navigation";
import { MainStackScreenProps } from "../../navigation/types";
import { useAttemptsLeft } from "../../hooks/attempts";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { postsKeys, useAllPosts, useCanPostToday } from "../../hooks/posts";
import { PostList } from "../../components/posts";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "../../components/Header";

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
  const { data: allPosts, isLoading: isAllPostsLoading } = useAllPosts(token);
  const { data: canPostToday, isLoading: isCanPostTodayLoading } =
    useCanPostToday(token);

  const onRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: postsKeys.allPosts(token),
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
