import { View, StyleSheet, FlatList } from "react-native";
import { Post } from "../../models";
import { PostItem } from "./PostItem";
import { Divider } from "react-native-elements";
import { NoPosts } from "./NoPosts";

type PostListType = {
  posts: Post[];
  isRefreshing: boolean;
  onRefresh: () => void;
  header?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  isHeaderSticky?: boolean;
  showActions: boolean;
  onActionsPress?: (id: string) => void;
  onProfilePress: (id: string) => void;
};

export const PostList = (props: PostListType) => {
  const {
    posts,
    isRefreshing,
    onRefresh,
    header,
    isHeaderSticky,
    showActions,
    onActionsPress,
    onProfilePress,
  } = props;

  return (
    <View style={layout.container}>
      <FlatList
        data={posts}
        renderItem={({ item: post }) => (
          <PostItem
            post={post}
            showActions={showActions}
            onActionsPress={onActionsPress}
            onProfilePress={onProfilePress}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(post) => post.id}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={header ? header : <></>}
        stickyHeaderIndices={isHeaderSticky ? [0] : []}
        ListEmptyComponent={NoPosts}
        // ListFooterComponent={} // TODO
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
