import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraStackScreenProps } from "../../navigation/types";
import { CloseButton } from "../../components/camera";
import { useCameraData } from "../../contexts/CameraDataContext";
import { ImageItem } from "../../components/ImageItem";

export const AttemptScreen = ({
  navigation,
}: CameraStackScreenProps<"Attempt">) => {
  const { photoPath, setPhotoPath, attempt } = useCameraData();

  const goBack = () => {
    setPhotoPath(undefined);
    navigation.goBack();
  };
  return (
    <View style={layout.container}>
      <CloseButton onPress={goBack} />
      <View style={layout.predictionContainer}>
        <View style={layout.attemptsContainer}>
          <Text style={styles.attemptsText}>1 / 3</Text>
        </View>
        <View style={layout.imageCard}>
          <ImageItem image={`${process.env.S3_URL}${attempt.imageName}`} />
          {/* <ImageItem image={`file://${photoPath}`} /> */}
        </View>
        <View style={layout.scoreContainer}>
          <Text style={styles.scoreText}>Score</Text>
          <Text style={styles.scoreText}>{attempt?.score} / 100</Text>
        </View>
      </View>
      <View style={layout.continueButtonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={goBack}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  closeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  predictionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  attemptsContainer: {},
  imageCard: {
    borderRadius: 10,
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  attemptsText: {
    color: "#fff",
    fontSize: 25,
  },
  scoreText: {
    color: "#fff",
    fontSize: 25,
  },
  continueButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#505050",
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
