import { StyleSheet, Text, View } from "react-native";

import { ImageItem } from "../../components/attempts";
import { CloseButton } from "../../components/camera";
import { Button, LoadingIndicator } from "../../components/shared";
import { useAuth } from "../../contexts/AuthContext";
import { useCameraData } from "../../contexts/CameraDataContext";
import { useAttemptsLeft } from "../../hooks/attempts";
import { MainStackScreenProps } from "../../navigation/types";
import { capitalizeAndDot } from "../../utils";

export const AttemptScreen = ({
  navigation,
}: MainStackScreenProps<"Attempt">) => {
  const { auth } = useAuth();
  const { photoPath, setPhotoPath, attempt } = useCameraData();

  const { data: attemptsLeft, isLoading: isAtttemptsLeftLoading } =
    useAttemptsLeft(auth?.tokenResponse.accessToken);

  const goBack = () => {
    setPhotoPath(undefined);

    if (attemptsLeft > 0) {
      navigation.goBack();
    } else {
      navigation.replace("AllAttempts");
    }
  };

  if (isAtttemptsLeftLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={layout.container}>
      <CloseButton onPress={goBack} />
      <View style={layout.attemptContainer}>
        <View style={layout.scoreContainer}>
          <Text style={styles.scoreText}>{attempt.score}</Text>
        </View>
        {/* <ImageItem image={`${process.env.S3_URL}${attempt.imageName}`} height={500} width={350} /> */}
        <ImageItem image={`file://${photoPath}`} height={500} width={350} />
        <View style={layout.captionContainer}>
          <Text style={styles.captionText}>
            {capitalizeAndDot(attempt?.caption)}
          </Text>
        </View>
      </View>
      <Button text="Continue" onPress={goBack} />
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    padding: 30,
  },
  attemptContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  scoreContainer: {
    width: "30%",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#00d0ff",
    justifyContent: "center",
    alignItems: "center",
  },
  captionContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  captionText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  scoreText: {
    color: "#00d0ff",
    fontSize: 25,
    textAlign: "center",
    fontWeight: "700",
  },
});
