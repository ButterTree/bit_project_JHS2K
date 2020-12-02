import { useState } from "react";

export const useTwoPeoPleToggle = (initialValue = false) => {
	const [toggleValue, setToggleValue] = useState(initialValue);

	return {
		toggleValue,
		onToggleTwoPeople: (event) => {
			(newState) => setToggleValue(newState);
		},
	};
};

export const useTwoPeople = (initialValue = false) => {
	const [isTwoPeople, setIsTwoPeople] = useState(initialValue);

	return {
		isTwoPeople,
		onPressTwoPeople: (event) =>
			isTwoPeople ? setIsTwoPeople(false) : setIsTwoPeople(true),
	};
};
