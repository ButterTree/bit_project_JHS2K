import { useState } from "react";
import { imageTransfer } from "../../../api";
import { useGenderState } from "../../ChangeBtns/genderBtn/genderContainer";
import { useTakePhotoState } from "../../MainScreenBtns/takePhotoBtn/takePhotoContainer";

export const useTransferState = (initialValue = []) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isAfterView, setIsAfterView] = useState(false);
	const [resultPhotoList, setResultPhotoList] = useState(initialValue);

	const { isGender, setIsGender } = useGenderState();
	const { isPreview, setIsPreview } = useTakePhotoState();

	return {
		isLoading,
		isAfterView,
		setIsAfterView,
		resultPhotoList,
		getTransferImage: async () => {
			try {
				if (isPreview) await cameraRef.current.resumePreview();

				setIsLoading(true);
				console.log(`getTransfer Check: ${isGender}`);
				const photos = await imageTransfer(
					selectedPhotos[0],
					selectedPhotos[1],
					isGender
				);
				setResultPhotoList(photos);
				clearPhotos();
				setIsLoading(false);
			} catch (e) {
				alert(`getTransferImage Error: ${e}`);
			}
		},
	};

	// cancel 함수 돌려서 초기화하기
};
