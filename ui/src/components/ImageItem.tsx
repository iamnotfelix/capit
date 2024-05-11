import { useState } from "react";
import { ActivityIndicator, View, Image } from "react-native";

type ImageItemPropsType = {
  image: string;
};

export const ImageItem = (props: ImageItemPropsType) => {
  const { image } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      {isLoading && (
        <View
          style={{
            justifyContent: "center",
            alignSelf: "center",
            alignContent: "center",
            zIndex: 0,
            position: "absolute",
            height: 550,
            width: 350,
          }}
        >
          <ActivityIndicator size={80} color={"#505050"} />
        </View>
      )}
      <Image
        source={{
          uri: image,
        }}
        style={{
          resizeMode: "cover",
          height: 550,
          width: 350,
        }}
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
