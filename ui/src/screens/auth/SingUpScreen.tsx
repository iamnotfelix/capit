import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { TextField } from "../../components/form";
import { Button, LoadingIndicator, Logo } from "../../components/shared";
import { useAuth } from "../../contexts/AuthContext";
import { useValidation } from "../../hooks/form";
import { AuthStackScreenProps } from "../../navigation/types";
import { validation } from "../../utils/validation";

export const SignUpScreen = ({
  navigation,
}: AuthStackScreenProps<"SignUp">) => {
  const { signUp, isLoading } = useAuth();

  const { validationText: usernameValText, validate: validateUsername } =
    useValidation(validation.validateUsername);
  const { validationText: emailValText, validate: validateEmail } =
    useValidation(validation.validateEmail);
  const { validationText: passwordValText, validate: validatePassword } =
    useValidation(validation.validatePasswordSignUp);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [apiValidation, setApiValidation] = useState<string>(undefined);

  const createAccount = async () => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isValid = isUsernameValid && isEmailValid && isPasswordValid;
    if (!isValid) {
      return;
    }

    try {
      await signUp(username, email, password);
      goToSignIn();
    } catch (error) {
      if (error.response.status == 400) {
        setApiValidation(error.response.data.detail);
      }
    }
  };
  const goToSignIn = () => {
    navigation.navigate("SignIn");
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
          value={email}
          setValue={setEmail}
          placeholder="Email"
          validationText={emailValText}
          validationFn={validateEmail}
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
          <Text
            style={[
              styles.apiValidationText,
              {
                display: apiValidation ? "flex" : "none",
              },
            ]}
          >
            {apiValidation}
          </Text>
          <View style={styles.signUpButtonContainer}>
            <Button text="Sign Up" onPress={createAccount} />
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
    marginVertical: 30,
  },
  apiValidationText: {
    color: "red",
    position: "absolute",
    top: 0,
  },
});
