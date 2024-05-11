import { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from "react-native";
import { CameraStackScreenProps } from "../../navigation/types";
import { CloseButton } from "../../components/camera";
import { useAttempts } from "../../hooks/attempts";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { Attempt } from "../../models/Attempt";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_MARGIN = 40;
const IMAGE_WIDTH = SCREEN_WIDTH - IMAGE_MARGIN * 2;

export const AllAttemptsScreen = ({
  navigation,
}: CameraStackScreenProps<"AllAttempts">) => {
  const { auth } = useAuth();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const onScroll = (data: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = Math.round(data.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    setCurrentIndex(offset);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const { data: attempts, isLoading: attemptsLoading } = useAttempts(
    auth?.tokenResponse.accessToken
  );

  if (attemptsLoading) {
    return <LoadingIndicator />;
  }

  // return <></>;

  return (
    <View style={layout.container}>
      <CloseButton onPress={goBack} />
      <View style={layout.attepmtpsContainer}>
        <View>
          <Text style={styles.attemptsText}>
            {(currentIndex + 1).toString()} / {attempts.length.toString()}
          </Text>
        </View>
        <View style={layout.scoreContainer}>
          <Text style={styles.scoreText}>{attempts[currentIndex].score}</Text>
        </View>
        <ScrollView
          style={{
            backgroundColor: "#000",
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment={"center"}
          decelerationRate={"fast"}
          pagingEnabled={true}
          onScroll={onScroll}
          scrollEventThrottle={100}
        >
          {attempts.map((attempt, index) => {
            if (!attempt || !attempt.imageName)
              return <View style={{ width: 0 }}></View>;
            return (
              <View
                key={attempt.id}
                style={{
                  width: IMAGE_WIDTH,
                  // height: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: index == 0 ? IMAGE_MARGIN : 0,
                  marginRight: index == attempts.length - 1 ? IMAGE_MARGIN : 0,
                }}
              >
                <Image
                  source={{ uri: `${process.env.S3_URL}${attempt.imageName}` }}
                  style={styles.image}
                />
              </View>
            );
          })}
        </ScrollView>
        <View style={layout.captionContainer}>
          <Text style={styles.captionText}>
            {attempts[currentIndex].caption}
          </Text>
        </View>
      </View>
      <View style={layout.postButtonContainer}>
        <TouchableOpacity style={styles.postButton} onPress={goBack}>
          <Text style={styles.postButtonText}>Post</Text>
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
    paddingVertical: 30,
  },
  attepmtpsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  scoreContainer: {
    width: "30%",
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#505050",
    justifyContent: "center",
    alignItems: "center",
  },
  captionContainer: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  postButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
});

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    width: "90%",
    height: "70%",
    borderRadius: 10,
  },
  attemptsText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
  },
  scoreText: {
    color: "#fff",
    fontSize: 25,
    textAlign: "center",
    fontWeight: "700",
  },
  captionText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  postButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#505050",
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
