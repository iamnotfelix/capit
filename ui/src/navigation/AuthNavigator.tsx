import { createStackNavigator } from "@react-navigation/stack";
import { AuthStackParamList } from "./types";
import { SignInScreen } from "../screens/auth/SingInScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { SignUpScreen } from "../screens/auth/SingUpScreen";

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false, animationEnabled: false }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};
