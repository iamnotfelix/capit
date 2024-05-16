import { MainStackParamList } from "./types";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AllAttemptsScreen,
  AttemptScreen,
  CameraScreen,
  HomeScreen,
  ProfileScreen,
} from "../screens";
import { CameraDataProvider } from "../contexts/CameraDataContext";
import { useAuth } from "../contexts/AuthContext";

const MainStack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  const {
    auth: {
      user: { id },
    },
  } = useAuth();
  return (
    <CameraDataProvider>
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animationEnabled: false }}
      >
        <MainStack.Screen name="Camera" component={CameraScreen} />
        <MainStack.Screen name="Attempt" component={AttemptScreen} />
        <MainStack.Screen name="AllAttempts" component={AllAttemptsScreen} />
        <MainStack.Screen name="Home" component={HomeScreen} />
        <MainStack.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ id }}
        />
      </MainStack.Navigator>
    </CameraDataProvider>
  );
};
