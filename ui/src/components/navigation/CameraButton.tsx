import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MainStackParamList } from "../../navigation/types";

type CameraButtonType = {
  navigation: StackNavigationProp<
    MainStackParamList,
    keyof MainStackParamList,
    undefined
  >;
};

export const CameraButton = ({ navigation }: CameraButtonType) => {
  const navigateToCamera = () => {
    navigation.navigate("Camera");
  };

  return (
    <TouchableOpacity onPress={navigateToCamera} style={styles.container}>
      <View style={styles.button}>
        <AntDesign name="camerao" size={40} color={"#00d0ff"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 30,
    zIndex: 999,
    padding: 20,
    backgroundColor: "#000",

    borderColor: "#00d0ff",
    borderWidth: 1,
    borderRadius: 50,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
