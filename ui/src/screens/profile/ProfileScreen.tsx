import { View, StyleSheet } from "react-native";
import { BottomTabBar } from "../../components/navigation";
import { MainStackScreenProps } from "../../navigation/types";

export const ProfileScreen = ({
  navigation,
}: MainStackScreenProps<"Profile">) => {
  return (
    <View style={layout.container}>
      <BottomTabBar currentScreen="Profile" navigation={navigation} />
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
