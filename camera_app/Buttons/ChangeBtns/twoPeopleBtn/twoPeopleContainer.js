import { useState } from "react";

export const useTwoPeopleToggleState = (initialValue = false) => {
  const [twoPeopleToggleValue, setTwoPeopleToggleValue] = useState(
    initialValue
  );

  return {
    twoPeopleToggleValue,
    setTwoPeopleToggleValue,
    onToggleTwoPeople: () => (newState) => setTwoPeopleToggleValue(newState)
  };
};

export const useTwoPeopleState = (initialValue = false) => {
  const [isTwoPeople, setIsTwoPeople] = useState(initialValue);

  return {
    isTwoPeople,
    setIsTwoPeople,
    onPressTwoPeople: () => setIsTwoPeople(!isTwoPeople)
  };
};
