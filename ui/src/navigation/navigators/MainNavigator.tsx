import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { CameraNavigator } from "./CameraNavigator";
import { HomeNavigator } from "./HomeNavigator";
import { ProfileNavigator } from "./ProfileNavigator";
import { MainTabParamList } from "../types";
import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const MainTab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  const screenOptions: BottomTabNavigationOptions = {
    // header
    headerTintColor: "#f1f1f1",
    headerStyle: {
      backgroundColor: "#000",
    },
    // bottom tab bar
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: "#000",
    },
  };

  const cameraTabOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarStyle: {
      display: "none",
    },
    tabBarIcon: ({ focused }) => {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Entypo
            name="camera"
            size={24}
            color={focused ? "#00d0ff" : "#f1f1f1"}
          />
        </View>
      );
    },
  };

  const profileTabOptions: BottomTabNavigationOptions = {
    tabBarIcon: ({ focused }) => {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <AntDesign
            name="user"
            size={24}
            color={focused ? "#00d0ff" : "#f1f1f1"}
          />
        </View>
      );
    },
  };

  const homeTabOptions: BottomTabNavigationOptions = {
    tabBarIcon: ({ focused }) => {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Entypo
            name="home"
            size={24}
            color={focused ? "#00d0ff" : "#f1f1f1"}
          />
        </View>
      );
    },
  };

  return (
    <MainTab.Navigator initialRouteName="HomeTab" screenOptions={screenOptions}>
      <MainTab.Screen
        name="CameraTab"
        options={cameraTabOptions}
        component={CameraNavigator}
      />
      <MainTab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={homeTabOptions}
      />
      <MainTab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={profileTabOptions}
      />
    </MainTab.Navigator>
  );
};
