import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../../screens";
import { HomeStackParamList } from "../types";

const HomeStack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};
