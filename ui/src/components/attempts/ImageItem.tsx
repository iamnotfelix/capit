import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";

type ImageItemPropsType = {
  image: string;
  height: number;
  width: number;
};

export const ImageItem = (props: ImageItemPropsType) => {
  const { image, height, width } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      {isLoading && (
        <View
          style={[
            styles.loadingContainer,
            {
              height: height ?? 500,
              width: width ?? 350,
            },
          ]}
        >
          <ActivityIndicator size={80} color={"#505050"} />
        </View>
      )}
      <FastImage
        source={{
          uri: image,
        }}
        style={[
          styles.image,
          {
            height: height ?? 500,
            width: width ?? 350,
          },
        ]}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoadEnd={() => {
          setIsLoading(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    zIndex: 0,
    position: "absolute",
    borderColor: "#00d0ff",
    borderWidth: 1,
    borderRadius: 20,
  },
  image: {
    borderRadius: 20,
    borderColor: "#00d0ff",
    borderWidth: 3,
  },
});
