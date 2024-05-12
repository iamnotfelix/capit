import { MainStackParamList } from "./types";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AllAttemptsScreen,
  AttemptScreen,
  CameraScreen,
  HomeScreen,
  ProfileScreen,
} from "../screens";

const MainStack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animationEnabled: false }}
    >
      <MainStack.Screen name="Camera" component={CameraScreen} />
      <MainStack.Screen name="Attempt" component={AttemptScreen} />
      <MainStack.Screen name="AllAttempts" component={AllAttemptsScreen} />
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
    </MainStack.Navigator>
  );
};
