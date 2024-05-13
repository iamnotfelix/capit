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
import { MainStackScreenProps } from "../../navigation/types";
import { CloseButton } from "../../components/camera";
import { useAttempts, useAttemptsLeft } from "../../hooks/attempts";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { usePostMutation } from "../../hooks/posts/usePostMutation";
import { useCanPostToday } from "../../hooks/posts/useCanPostToday";
import { capitalizeAndDot } from "../../utils";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_MARGIN = 40;
const IMAGE_WIDTH = SCREEN_WIDTH - IMAGE_MARGIN * 2;

export const AllAttemptsScreen = ({
  navigation,
}: MainStackScreenProps<"AllAttempts">) => {
  const {
    auth: {
      tokenResponse: { accessToken: token },
    },
  } = useAuth();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAddingPost, setIsAddingPost] = useState<boolean>(false);

  const postMutation = usePostMutation();
  const { data: attempts, isLoading: isAttemptsLoading } = useAttempts(token);
  const { data: attemptsLeft, isLoading: isAtttemptsLeftLoading } =
    useAttemptsLeft(token);
  const { data: canPostToday, isLoading: isCanPostTodayLoading } =
    useCanPostToday(token);

  const onScroll = (data: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = Math.round(data.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    setCurrentIndex(offset);
  };

  const goBack = () => {
    if (attemptsLeft > 0) {
      navigation.goBack();
    } else {
      const { routes, index } = navigation.getState();
      if (routes[index - 1].name == "Camera") navigation.pop(2);
      else navigation.goBack();
    }
  };

  const createPost = async () => {
    setIsAddingPost(true);
    await postMutation.mutateAsync({
      attemptId: attempts[currentIndex].id,
      token: token,
    });
    setIsAddingPost(false);
    navigation.popToTop();
  };

  const getIsLoading = () => {
    return (
      isAttemptsLoading ||
      isAtttemptsLeftLoading ||
      isAddingPost ||
      isCanPostTodayLoading
    );
  };

  if (getIsLoading()) {
    return <LoadingIndicator />;
  }

  if (!canPostToday) {
    return (
      <View style={layout.container}>
        <CloseButton onPress={goBack} />
        <View style={layout.noAttemptsContainer}>
          <Text style={styles.noAttemptsText}>
            You have already posted today!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={layout.container}>
      <CloseButton onPress={goBack} />
      {attempts.length == 0 ? (
        <View style={layout.noAttemptsContainer}>
          <Text style={styles.noAttemptsText}>
            You have no attempts for today!
          </Text>
        </View>
      ) : (
        <>
          <View style={layout.attepmtpsContainer}>
            <View>
              <Text style={styles.attemptsText}>
                {(currentIndex + 1).toString()} / {attempts.length.toString()}
              </Text>
            </View>
            <View style={layout.scoreContainer}>
              <Text style={styles.scoreText}>
                {attempts[currentIndex].score}
              </Text>
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
                      marginRight:
                        index == attempts.length - 1 ? IMAGE_MARGIN : 0,
                    }}
                  >
                    <Image
                      source={{
                        uri: `${process.env.S3_URL}${attempt.imageName}`,
                      }}
                      style={styles.image}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <View style={layout.captionContainer}>
              <Text style={styles.captionText}>
                {capitalizeAndDot(attempts[currentIndex].caption)}
              </Text>
            </View>
          </View>
          <View style={layout.postButtonContainer}>
            <TouchableOpacity style={styles.postButton} onPress={createPost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  noAttemptsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginHorizontal: 20,
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
  noAttemptsText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
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
