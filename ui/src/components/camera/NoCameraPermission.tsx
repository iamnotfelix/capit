import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type NoCameraPermissionType = {
  text: string;
  buttonText: string;
  onPress: () => void;
};

export const NoCameraPermission = (props: NoCameraPermissionType) => {
  const { text, buttonText, onPress } = props;

  return (
    <View style={layout.permissionContainer}>
      <Text style={styles.permissionText}>{text}</Text>
      <View style={layout.permissionBackButtonContainer}>
        <TouchableOpacity style={styles.permissionBackButton} onPress={onPress}>
          <Text style={styles.permissionBackButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const layout = StyleSheet.create({
  permissionContainer: {
    backgroundColor: "#000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionBackButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
});

const styles = StyleSheet.create({
  permissionText: {
    color: "#FFF",
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
  },
  permissionBackButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#505050",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionBackButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
