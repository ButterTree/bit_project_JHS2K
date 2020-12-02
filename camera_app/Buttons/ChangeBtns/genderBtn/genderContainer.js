import { useState } from "react";

export const useGenderToggleState = (initialValue = false) => {
  const [genderValue, setGenderValue] = useState(initialValue);

  return {
    genderValue,
    onToggleGender: (event) => (newState) => setGenderValue(newState)
  };
};

export const useGenderState = (initialValue = "female") => {
  const [isGender, setIsGender] = useState(initialValue);

  return {
    isGender,
    setIsGender: (event) =>
      isGender === "male" ? setIsGender("female") : setIsGender("male")
  };
};
