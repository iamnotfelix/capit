import { useState } from "react";
import { Validation } from "../../models";

type ValidationData = {
  validationText: string;
  validate: (value: string) => boolean;
};

export const useValidation = (validationFn: (value: string) => Validation) => {
  const [validationText, setValidationText] = useState<string>(undefined);

  const validate = (value: string) => {
    const { message } = validationFn(value);
    setValidationText(message);
    return !!!message;
  };

  return { validationText, validate } as ValidationData;
};
