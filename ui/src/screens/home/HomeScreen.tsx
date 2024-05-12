import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { BottomTabBar, CameraButton } from "../../components/navigation";
import { MainStackScreenProps } from "../../navigation/types";
import { useAttemptsLeft } from "../../hooks/attempts";
import { LoadingIndicator } from "../../components/LoadingIndicator";

export const HomeScreen = ({ navigation }: MainStackScreenProps<"Home">) => {
  const { auth, signOut, isLoading } = useAuth();

  const { data: attemptsLeft, isLoading: isAttemptsLeftLoading } =
    useAttemptsLeft(auth?.tokenResponse.accessToken);

  const getIsLoading = () => {
    return isLoading || isAttemptsLeftLoading;
  };

  if (getIsLoading()) {
    return <LoadingIndicator />;
  }

  return (
    <View style={layout.container}>
      {attemptsLeft > 0 && <CameraButton navigation={navigation} />}
      <TouchableOpacity style={styles.singoutButton} onPress={signOut}>
        <Text style={styles.signoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      <BottomTabBar currentScreen="Home" navigation={navigation} />
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
