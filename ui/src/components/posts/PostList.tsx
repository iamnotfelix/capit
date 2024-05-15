import { View, StyleSheet, FlatList } from "react-native";
import { Post } from "../../models";
import { PostItem } from "./PostItem";
import { Header } from "../Header";
import { Divider } from "react-native-elements";

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
        renderItem={({ item: post, index }) => <PostItem post={post} />}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(post) => post.id}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}
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
