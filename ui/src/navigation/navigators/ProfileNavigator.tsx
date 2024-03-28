import { createStackNavigator } from "@react-navigation/stack";
import { ProfileScreen } from "../../screens";
import { ProfileStackParamList } from "../types";

const ProfileStack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};
