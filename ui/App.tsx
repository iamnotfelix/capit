import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/contexts/AuthContext";
import { Router } from "./src/navigation/Router";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Router />
    </AuthProvider>
  );
}
