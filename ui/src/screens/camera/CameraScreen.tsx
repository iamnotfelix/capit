import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  Camera,
  CameraPosition,
  TakePhotoOptions,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { CameraButton, CloseButton } from "../../components/camera";
import { uploadToS3 } from "../../utils";
import { useIsFocused } from "@react-navigation/native";
import { useAppState } from "@react-native-community/hooks";
import { CameraStackScreenProps } from "../../navigation/types";
import { useAuth } from "../../contexts/AuthContext";
import { useCameraData } from "../../contexts/CameraDataContext";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { useAttemptMutation } from "../../hooks/attempts";
import { ThemeModal } from "../../components/themes/ThemeModal";
import { useTodaysTheme } from "../../hooks/themes";

export const CameraScreen = ({
  navigation,
}: CameraStackScreenProps<"Camera">) => {
  // const route = useRoute<CameraStackScreenProps<"Camera">["route"]>();
  // const navigation = useNavigation<CameraStackScreenProps<"Camera">["navigation"]>();

  const { auth } = useAuth();
  const { setPhotoPath, setAttempt } = useCameraData();
  const cameraRef = useRef<Camera>(null);
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === "active";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<CameraPosition>("back");
  const [flashMode, setFlashMode] = useState<TakePhotoOptions["flash"]>("off");
  const [isThemeModalVisble, setIsThemeModalVisible] = useState<boolean>(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(cameraType, {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });

  const attemptsMutation = useAttemptMutation();
  const { data: theme, isLoading: themeIsLoading } = useTodaysTheme(
    auth?.tokenResponse.accessToken
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    const photoFile = await cameraRef.current?.takePhoto({
      enableShutterSound: false,
      flash: flashMode,
    });
    setPhotoPath(photoFile.path);
    const image = await fetch(`file://${photoFile.path}`);

    setIsLoading(true);
    const blob = await image.blob();

    const { key, error } = await uploadToS3(blob, auth.user.id);
    if (error) {
      setIsLoading(false);
      setPhotoPath(undefined);
      setAttempt(undefined);
      return;
    }

    const attempt = await attemptsMutation.mutateAsync({
      imageName: key,
      token: auth?.tokenResponse.accessToken,
    });

    setAttempt(attempt);

    setIsLoading(false);
    navigation.navigate("Attempt");
  };

  const closeCamera = () => {
    navigation.navigate("HomeTab");
  };

  const toggleFlashMode = () => {
    setFlashMode((current) => {
      return current === "off" ? "on" : "off";
    });
  };

  const toggleCameraType = () => {
    setCameraType((current) => {
      return current === "back" ? "front" : "back";
    });
  };

  const seeAttempts = () => {
    navigation.navigate("AllAttempts");
  };

  const getIsLoading = () => {
    return isLoading || themeIsLoading;
  };

  if (!hasPermission) {
    return (
      <View>
        <Text>Need to give permission to use the camera!</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View>
        <Text>You need a camera!</Text>
      </View>
    );
  }

  if (getIsLoading()) {
    return <LoadingIndicator />;
  }

  return (
    <View style={layout.container}>
      <ThemeModal
        text={theme.main}
        isVisible={isThemeModalVisble}
        onRequestClose={() => setIsThemeModalVisible(false)}
        onPress={() => setIsThemeModalVisible(false)}
      />
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          ref={cameraRef}
          photo={true}
        />
        <>
          <CloseButton onPress={closeCamera} />
          <View style={layout.takePhotoButtonContainer}>
            <CameraButton onPress={takePhoto} icon="circle" size={80} />
          </View>
          <View style={layout.cameraSettingsContainer}>
            {cameraType !== "front" && (
              <CameraButton
                onPress={toggleFlashMode}
                icon="flash"
                size={50}
                color={flashMode === "off" ? "#9c9c9c" : undefined}
              />
            )}
            <CameraButton onPress={toggleCameraType} icon="loop" size={50} />
          </View>
          <View style={layout.attemptsButtonContainer}>
            <CameraButton
              onPress={() => setIsThemeModalVisible(true)}
              icon="air"
              size={50}
            />
            <CameraButton onPress={seeAttempts} icon="image" size={50} />
          </View>
        </>
      </>
    </View>
  );
};

const layout = StyleSheet.create({
  container: {
    flex: 1,
  },
  takePhotoButtonContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 30,
  },
  cameraSettingsContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    rowGap: 30,
  },
  attemptsButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    rowGap: 30,
  },
});

const styles = StyleSheet.create({});
