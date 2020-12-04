import { useState, useEffect } from "react";
import { imageTransfer } from "../../../api";
import { useGenderState } from "../../ChangeBtns/genderBtn/genderContainer";
import { useGetPhotoState } from "../../MainScreenBtns/getPhotoBtn/getPhotoContainer";
import { useTakePhotoState } from "../../MainScreenBtns/takePhotoBtn/takePhotoContainer";

export const useTransferState = (initialValue = []) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isAfterView, setIsAfterView] = useState(false);
	const [resultPhotoList, setResultPhotoList] = useState([]);

	const { isGender, setIsGender } = useGenderState();
	const { isPreview, setIsPreview } = useTakePhotoState();
	const { takePhoto } = useTakePhotoState();
	const { albumPhoto } = useGetPhotoState();

	return {
		isLoading,
		isAfterView,
		setIsAfterView,
		getTransferImage: async () => {
			try {
				if (isPreview) {
					await cameraRef.current.resumePreview();
					setIsPreview(false);
				}
				setIsLoading(true);
				console.log(`getTransfer Check: ${isGender}`);
				setResultPhotoList(
					await imageTransfer(isFirstPhoto, isSecondPhoto, isGender)
				);
				setIsLoading(false);
			} catch (e) {
				alert(`getTransferImage Error: ${e}`);
			}
		},
	};

	// cancel 함수 돌려서 초기화하기
};
