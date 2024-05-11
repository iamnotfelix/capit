import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingIndicator } from "../../components/LoadingIndicator";

export const SignInScreen = () => {
  const { signIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#000",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#505050",
          width: 200,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={signIn}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};
