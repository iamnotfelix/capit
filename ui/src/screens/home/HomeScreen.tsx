import { TouchableOpacity, View, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export const HomeScreen = () => {
  const { signOut } = useAuth();

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
        onPress={signOut}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};
