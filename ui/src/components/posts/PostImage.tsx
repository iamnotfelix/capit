import { useState } from "react";
import { ActivityIndicator, View, Image, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";

type PostImageType = {
  imageUrl: string;
  score: number;
  theme: string;
};

export const PostImage = (props: PostImageType) => {
  const { imageUrl, score, theme } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImagePressed, setIsImagePressed] = useState<Boolean>(false);

  const onImagePressIn = () => {
    setIsImagePressed(true);
  };

  const onImagePressOut = () => {
    setIsImagePressed(false);
  };

  return (
    <View>
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size={80} color={"#505050"} />
        </View>
      )}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.themeText}>{theme}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={onImagePressIn}
        onPressOut={onImagePressOut}
      >
        <FastImage
          source={{
            uri: imageUrl,
          }}
          style={{
            borderRadius: 10,
            height: 350,
            opacity: isImagePressed ? 0.3 : 1,
          }}
          resizeMode={FastImage.resizeMode.cover}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    zIndex: 0,
    position: "absolute",
    height: 350,
    width: "100%",
  },
  scoreContainer: {
    height: 350,
    width: "100%",
    position: "absolute",
  },
  scoreText: {
    color: "#fff",
    fontSize: 120,
    fontWeight: "700",
    fontStyle: "italic",
    marginLeft: "auto",
    marginRight: "auto",
    // top: 30,
  },
  themeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "italic",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 20,
    // top: 50,
  },
});
