import { AntDesign } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MainStackParamList } from "../../navigation/types";

type BottomTabBarType = {
  currentScreen: keyof MainStackParamList;
  navigation: StackNavigationProp<
    MainStackParamList,
    keyof MainStackParamList,
    undefined
  >;
};

export const BottomTabBar = (props: BottomTabBarType) => {
  const { currentScreen, navigation } = props;

  const navigateToHome = () => {
    navigation.navigate("Home");
  };
  const navigateToAllAttempts = () => {
    navigation.navigate("AllAttempts");
  };
  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={layout.wrapper}>
      <Divider color="#505050" width={0.1} orientation="vertical" />
      <View style={layout.container}>
        <TouchableOpacity onPress={navigateToHome}>
          <AntDesign
            name="home"
            size={24}
            color={currentScreen == "Home" ? "#00d0ff" : "#f1f1f1"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToAllAttempts}>
          <AntDesign
            name="plussquareo"
            size={24}
            color={currentScreen == "AllAttempts" ? "#00d0ff" : "#f1f1f1"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToProfile}>
          <AntDesign
            name="user"
            size={24}
            color={currentScreen == "Profile" ? "#00d0ff" : "#f1f1f1"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const layout = StyleSheet.create({
  wrapper: {
    // position: "absolute",
    // bottom: "3%",
    // zIndex: 999,
    width: "100%",
    backgroundColor: "#000",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    paddingTop: 12,
  },
});

const styles = StyleSheet.create({});
