import { View, StyleSheet } from "react-native";
import { Post } from "../../models";
import { PostHeader } from "./PostHeader";
import { PostFooter } from "./PostFooter";
import { PostImage } from "./PostImage";
import { capitalizeAndDot } from "../../utils";

type PostItem = {
  post: Post;
};

export const PostItem = (props: PostItem) => {
  const { post } = props;

  return (
    <View style={layout.container}>
      <PostHeader username={post.user.username} created={post.created} />
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
