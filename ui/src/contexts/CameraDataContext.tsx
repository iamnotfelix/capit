import { createContext, useContext, useState } from "react";
import { CameraContextData } from "../models";
import { Attempt } from "../models/Attempt";

const CameraDataContext = createContext<CameraContextData>(
  {} as CameraContextData
);

export const CameraDataProvider = ({ children }) => {
  const [photoPath, setPhotoPath] = useState<string>(undefined);
  const [attempt, setAttempt] = useState<Attempt>(undefined);

  return (
    <CameraDataContext.Provider
      value={{ photoPath, setPhotoPath, attempt, setAttempt }}
    >
      {children}
    </CameraDataContext.Provider>
  );
};

export function useCameraData() {
  const context = useContext(CameraDataContext);

  if (!context) {
    throw new Error("useCameraData must be used within CameraDataProvider");
  }

  return context;
}
