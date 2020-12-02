import { useState } from "react";

export const useTwoPeopleToggleState = (initialValue = false) => {
  const [twoPeopleValue, setTwoPeopleToggleValue] = useState(initialValue);

  return {
    twoPeopleValue,
    setTwoPeopleToggleValue,
    onToggleTwoPeople: (event) => (newState) =>
      setTwoPeopleToggleValue(newState)
  };
};

export const useTwoPeopleState = (initialValue = false) => {
  const [isTwoPeople, setIsTwoPeople, onPressTwoPeople] = useState(
    initialValue
  );

  return {
    isTwoPeople,
    setIsTwoPeople,
    onPressTwoPeople: (event) =>
      isTwoPeople ? setIsTwoPeople(false) : setIsTwoPeople(true)
  };
};
