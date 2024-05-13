import { View, StyleSheet, FlatList } from "react-native";
import { Post } from "../../models";
import { PostItem } from "./PostItem";

type PostListType = {
  posts: Post[];
  isRefreshing: boolean;
  onRefresh: () => void;
};

export const PostList = (props: PostListType) => {
  const { posts, isRefreshing, onRefresh } = props;

  return (
    <View style={layout.container}>
      <FlatList
        data={posts}
        renderItem={({ item: post }) => <PostItem post={post} />}
        keyExtractor={(post) => post.id}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

const styles = StyleSheet.create({});
