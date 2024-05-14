import { Image } from "react-native";

type LogoVariant =
  | "whiteText"
  | "blueText"
  | "blackAndWhite"
  | "blackAndBlue"
  | "whiteAndBlack"
  | "whiteAndBlue";

type LogoPropsType = {
  variant: LogoVariant;
  height?: number;
  width?: number;
};

export const Logo = (props: LogoPropsType) => {
  const { variant, height, width } = props;
  switch (variant) {
    case "whiteText":
      return (
        <Image
          source={require("../../assets/whiteText.png")}
          style={{
            height: height ? height : 300,
            width: width ? width : 300,
          }}
        />
      );
    case "blueText":
      return (
        <Image
          source={require("../../assets/blueText.png")}
          style={{
            height: height ? height : 300,
            width: width ? width : 300,
          }}
        />
      );
    case "blackAndWhite":
      return (
        <Image
          source={require("../../assets/blackAndWhite.png")}
          style={{
            height: height ? height : 300,
            width: width ? width : 300,
          }}
        />
      );
    case "blackAndBlue":
      return (
        <Image
          source={require("../../assets/blackAndBlue.png")}
          style={{
            height: height ? height : 300,
            width: width ? width : 300,
          }}
        />
      );
    case "whiteAndBlack":
      return (
        <Image
          source={require("../../assets/whiteAndBlack.png")}
          style={{
            height: height ? height : 300,
            width: width ? width : 300,
          }}
        />
      );
    case "whiteAndBlue":
      return (
        <Image
          source={require("../../assets/whiteAndBlue.png")}
          style={{
            height: height ? height : 300,
            width: width ? width : 300,
          }}
        />
      );
    default:
      return (
        <Image
          source={require("../../assets/whiteText.png")}
          style={{
            height: height ? height : 300,
            width: width ? width : 300,
          }}
        />
      );
  }
};
