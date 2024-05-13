import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomTabBar } from "../../components/navigation";
import { MainStackScreenProps } from "../../navigation/types";
import { useAuth } from "../../contexts/AuthContext";

export const ProfileScreen = ({
  navigation,
}: MainStackScreenProps<"Profile">) => {
  const { signOut } = useAuth();

  return (
    <View style={layout.container}>
      <View style={layout.signoutContainer}>
        <TouchableOpacity style={styles.singoutButton} onPress={signOut}>
          <Text style={styles.signoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <BottomTabBar currentScreen="Profile" navigation={navigation} />
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
  },
  signoutContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const styles = StyleSheet.create({
  singoutButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#505050",
    width: 200,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  signoutButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
