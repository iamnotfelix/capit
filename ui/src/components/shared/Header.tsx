import { StyleSheet, View } from "react-native";

import { Logo } from "./Logo";

export const Header = () => {
  return (
    <View style={styles.container}>
      <Logo variant={"whiteTextShadow"} height={60} width={150} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
