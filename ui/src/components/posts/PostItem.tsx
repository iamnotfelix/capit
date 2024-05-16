import { View, StyleSheet } from "react-native";
import { Post } from "../../models";
import { PostHeader } from "./PostHeader";
import { PostFooter } from "./PostFooter";
import { PostImage } from "./PostImage";
import { capitalizeAndDot } from "../../utils";

type PostItem = {
  post: Post;
  showActions: boolean;
  onActionsPress: (id: string) => void;
  onProfilePress: (id: string) => void;
};

export const PostItem = (props: PostItem) => {
  const { post, showActions, onActionsPress, onProfilePress } = props;

  return (
    <View style={layout.container}>
      <PostHeader
        username={post.user.username}
        created={post.created}
        showActions={showActions}
        postId={post.id}
        onActionsPress={onActionsPress}
        userId={post.user.id}
        onProfilePress={onProfilePress}
      />
      <PostImage
        imageUrl={`${process.env.S3_URL}${post.imageName}`}
        score={post.score}
        theme={capitalizeAndDot(post.theme.main)}
      />
      <PostFooter caption={capitalizeAndDot(post.caption)} />
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
});

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
});
