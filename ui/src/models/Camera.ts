import { Attempt } from "./Attempt";

export type CameraContextData = {
  photoPath?: string;
  setPhotoPath: React.Dispatch<React.SetStateAction<string>>;
  attempt?: Attempt;
  setAttempt: React.Dispatch<React.SetStateAction<Attempt>>;
};
