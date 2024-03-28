import { useEffect, useState } from "react";
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

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_MARGIN = 40;
const IMAGE_WIDTH = SCREEN_WIDTH - IMAGE_MARGIN * 2;
const DATA = [
  {
    id: "e27c20de-7996-474c-ba1b-af2bbe002878",
    imagePath: "https://images.unsplash.com/photo-1417325384643-aac51acc9e5d",
    score: 10,
  },
  {
    id: "e0cbf5cd-5d92-44e0-92bc-2c52aab870bd",
    imagePath: "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
    score: 20,
  },
  {
    id: "f38e3fb1-c4f8-443c-b760-c15431288cf9",
    imagePath: "https://images.unsplash.com/photo-1417325384643-aac51acc9e5d",
    score: 30,
  },
  {
    id: "g3cbf5cd-5d32-44e0-92bc-2c52aab870bd",
    imagePath: "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
    score: 40,
  },
];

export const AllAttemptsScreen = ({
  navigation,
}: CameraStackScreenProps<"AllAttempts">) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const onScroll = (data: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = Math.round(data.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    setCurrentIndex(offset);
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {}, []);

  return (
    <View style={layout.container}>
      <CloseButton onPress={goBack} />
      <View style={layout.attepmtpsContainer}>
        <View>
          <Text style={styles.attemptsText}>
            {(currentIndex + 1).toString()} / {DATA.length.toString()}
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
          {DATA.map((item, index) => {
            if (!item || !item.imagePath)
              return <View style={{ width: 0 }}></View>;
            return (
              <View
                key={item.id}
                style={{
                  width: IMAGE_WIDTH,
                  // height: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: index == 0 ? IMAGE_MARGIN : 0,
                  marginRight: index == DATA.length - 1 ? IMAGE_MARGIN : 0,
                }}
              >
                <Image source={{ uri: item.imagePath }} style={styles.image} />
              </View>
            );
          })}
        </ScrollView>
        <View style={layout.scoreContainer}>
          <Text style={styles.scoreText}>Score</Text>
          <Text style={styles.scoreText}>0 / 100</Text>
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
    alignItems: "center",
    paddingVertical: 30,
    // padding: 30,
  },
  attepmtpsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  postButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  },
  scoreText: {
    color: "#fff",
    fontSize: 25,
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
