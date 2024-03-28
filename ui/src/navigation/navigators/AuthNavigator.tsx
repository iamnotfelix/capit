import { createStackNavigator } from "@react-navigation/stack";
import { AuthStackParamList } from "../types";
import { SignInScreen } from "../../screens/auth/SingInScreen";

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
    </AuthStack.Navigator>
  );
};
