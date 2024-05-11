import { createStackNavigator } from "@react-navigation/stack";
import { CameraScreen } from "../../screens";
import { CameraStackParamList } from "../types";
import { AttemptScreen } from "../../screens/camera/AttemptScreen";
import { AllAttemptsScreen } from "../../screens/camera/AllAttemptsScreen";
import { CameraDataProvider } from "../../contexts/CameraDataContext";

const CameraStack = createStackNavigator<CameraStackParamList>();

export const CameraNavigator = () => {
  return (
    <CameraDataProvider>
      <CameraStack.Navigator screenOptions={{ headerShown: false }}>
        <CameraStack.Screen name="Camera" component={CameraScreen} />
        <CameraStack.Screen name="Attempt" component={AttemptScreen} />
        <CameraStack.Screen name="AllAttempts" component={AllAttemptsScreen} />
      </CameraStack.Navigator>
    </CameraDataProvider>
  );
};
