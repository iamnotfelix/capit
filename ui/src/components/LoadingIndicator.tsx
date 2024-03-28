import { View, ActivityIndicator } from "react-native";

export const LoadingIndicator = () => {
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.3,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={50} color={"#505050"} />
    </View>
  );
};
