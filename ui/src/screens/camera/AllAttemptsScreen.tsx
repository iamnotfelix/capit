import { useEffect, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useQueryClient } from "@tanstack/react-query";

import { ImageItem } from "../../components/attempts";
import { CloseButton } from "../../components/camera";
import { Button, LoadingIndicator } from "../../components/shared";
import { useAuth } from "../../contexts/AuthContext";
import {
  attemptsKeys,
  useAttempts,
  useAttemptsLeft,
} from "../../hooks/attempts";
import { usePostMutation } from "../../hooks/posts";
import { useCanPostToday } from "../../hooks/posts/useCanPostToday";
import { MainStackScreenProps } from "../../navigation/types";
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

  const queryClient = useQueryClient();
  const postMutation = usePostMutation();
  const { data: attempts, isLoading: isAttemptsLoading } = useAttempts(token);
  const { data: attemptsLeft, isLoading: isAtttemptsLeftLoading } =
    useAttemptsLeft(token);
  const { data: canPostToday, isLoading: isCanPostTodayLoading } =
    useCanPostToday(token);

  // TODO: this is a quick fix for the attempts problem
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: attemptsKeys.attempts(token),
    });
  }, []);

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
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: index == 0 ? IMAGE_MARGIN : 0,
                      marginRight:
                        index == attempts.length - 1 ? IMAGE_MARGIN : 0,
                    }}
                  >
                    <ImageItem
                      image={`${process.env.S3_URL}${attempt.imageName}`}
                      height={470}
                      width={310}
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
            <Button text="Post" onPress={createPost} />
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
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#00d0ff",
    justifyContent: "center",
    alignItems: "center",
  },
  captionContainer: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  postButtonContainer: {
    marginHorizontal: 30,
  },
});

const styles = StyleSheet.create({
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
    color: "#00d0ff",
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
});
