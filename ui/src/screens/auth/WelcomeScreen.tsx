import { View, StyleSheet, Text, Image } from "react-native";
import { Button } from "../../components/Button";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthStackScreenProps } from "../../navigation/types";
import { Logo } from "../../components/Logo";

export const WelcomeScreen = ({
  navigation,
}: AuthStackScreenProps<"Welcome">) => {
  const goToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const goToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Logo variant="whiteText" />
      <View style={styles.actionsContainer}>
        <View style={styles.signUpButtonContainer}>
          <Button text="Sign Up" onPress={goToSignUp} />
        </View>
        <View style={styles.signInContainer}>
          <Text style={styles.alreadyHaveAccountText}>
            {"Already have an account? "}
          </Text>
          <TouchableOpacity onPress={goToSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  signInContainer: {
    flexDirection: "row",
  },
  alreadyHaveAccountText: {
    color: "#FFF",
    fontSize: 15,
  },
  signInText: {
    color: "#00d0ff",
    fontSize: 15,
    fontWeight: "700",
  },
  signUpButtonContainer: {
    margin: 30,
  },
});
