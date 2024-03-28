import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraStackScreenProps } from "../../navigation/types";
import { CameraButton, CloseButton } from "../../components/camera";

const DATA = {
  imagePath: "https://images.unsplash.com/photo-1417325384643-aac51acc9e5d",
};

export const AttemptScreen = ({
  navigation,
}: CameraStackScreenProps<"Attempt">) => {
  const goBack = () => {
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
          <Image
            // source={{ uri: `file://${imagePath}` }}
            source={{ uri: DATA.imagePath }}
            style={{
              resizeMode: "cover",
              height: 550,
              width: 350,
            }}
          />
        </View>
        <View style={layout.scoreContainer}>
          <Text style={styles.scoreText}>Score</Text>
          <Text style={styles.scoreText}>0 / 100</Text>
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
