import { useState } from "react";
import { useGetPhotoState } from "../../MainScreenBtns/getPhotoBtn/getPhotoContainer";
import { useReadyPhotoState } from "../../MainScreenBtns/photoStorage";
import { useTakePhotoState } from "../../MainScreenBtns/takePhotoBtn/takePhotoContainer";
import {
	useGenderToggleState,
	useGenderState,
} from "../../ChangeBtns/genderBtn/genderContainer";

import {
	useTwoPeopleState,
	useTwoPeopleToggleState,
} from "../../ChangeBtns/twoPeopleBtn/twoPeopleContainer";
import { useTransferState } from "../transferBtn/transferContainer";

export const useCancelState = async () => {
	const [isCancel, setIsCancel] = useState(false);
	const { isPreview, setIsPreview, setTakePhoto } = useTakePhotoState(); // false, {}
	const { setImageSelected, setAlbumPhoto } = useGetPhotoState(); // false, {}
	const { setTwoPeopleToggleValue } = useTwoPeopleToggleState(); // false
	const { setIsTwoPeople } = useTwoPeopleState(); // false
	const { setGenderValue } = useGenderToggleState(); // false
	const { setIsGender } = useGenderState(); // "female"
	const { setIsAfterView } = useTransferState(); // false
	const { setSelectedPhotos } = useReadyPhotoState(); // []

	return {
		isCancel,
		setIsCancel,
		onPressCancel: async () => {
			if (isPreview) {
				await cameraRef.current.resumePreview();
				setIsPreview(false);
				setTakePhoto({});
				setAlbumPhoto({});
				setImageSelected(false);
				setTwoPeopleToggleValue(false);
				setIsTwoPeople(false);
				setGenderValue(false);
				setIsGender("female");
				setIsAfterView(false);
				setSelectedPhotos([]);
				setIsCancel(true);
			}
		},
	};
};
