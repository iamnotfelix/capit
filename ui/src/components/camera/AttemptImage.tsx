import { Image } from "react-native";

type AttemptImageProps = {
  source: string;
};

export const AttemptImage = (props: AttemptImageProps) => {
  const { source } = props;
  return (
    <Image
      source={{ uri: `file://${source}` }}
      style={{
        resizeMode: "cover",
        height: 550,
        width: 350,
      }}
    />
  );
};
