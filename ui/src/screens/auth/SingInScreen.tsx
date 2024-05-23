import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { TextField, ValidationText } from "../../components/form";
import { Button, LoadingIndicator, Logo } from "../../components/shared";
import { useAuth } from "../../contexts/AuthContext";
import { useValidation } from "../../hooks/form";
import { AuthStackScreenProps } from "../../navigation/types";
import { validation } from "../../utils/validation";

export const SignInScreen = ({
  navigation,
}: AuthStackScreenProps<"SignIn">) => {
  const { signIn, isLoading } = useAuth();

  const { validationText: usernameValText, validate: validateUsername } =
    useValidation(validation.validateUsername);
  const { validationText: passwordValText, validate: validatePassword } =
    useValidation(validation.validatePasswordSignIn);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [apiValidation, setApiValidation] = useState<string>(undefined);

  const logIn = async () => {
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    const isValid = isUsernameValid && isPasswordValid;
    if (!isValid) {
      return;
    }

    try {
      await signIn(username, password);
    } catch (error) {
      if (error.response.status == 400 || error.response.status == 401) {
        setApiValidation(error.response.data.detail);
      }
    }
  };
  const goToSignUp = () => {
    navigation.navigate("SignUp");
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Logo variant="whiteText" />
      <View style={styles.formContainer}>
        <TextField
          value={username}
          setValue={setUsername}
          placeholder="Username"
          validationText={usernameValText}
          validationFn={validateUsername}
        />
        <TextField
          value={password}
          setValue={setPassword}
          placeholder="Password"
          validationText={passwordValText}
          validationFn={validatePassword}
          secureTextEntry={true}
        />
        <View style={styles.actionsContainer}>
          <ValidationText text={apiValidation} />
          <View style={styles.signInButtonContainer}>
            <Button text="Sign In" onPress={logIn} />
          </View>
          <View style={styles.signInContainer}>
            <Text style={styles.haveAccountText}>
              {"Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={goToSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  actionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  signInContainer: {
    flexDirection: "row",
  },
  haveAccountText: {
    color: "#FFF",
    fontSize: 15,
  },
  signUpText: {
    color: "#00d0ff",
    fontSize: 15,
    fontWeight: "700",
  },
  signInButtonContainer: {
    marginVertical: 30,
  },
});
