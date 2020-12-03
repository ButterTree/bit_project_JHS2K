import { useState } from "react";
import { useGetPhotoState } from "../../MainScreenBtns/getPhotoBtn/getPhotoContainer";
import { useTakePhotoState } from "../../MainScreenBtns/takePhotoBtn/takePhotoContainer";

export const useNextState = () => {
	const { isNext, setIsNext } = useState(false);
	const { isPreview, setIsPreview, setTakePhoto } = useTakePhotoState();
	const {
		imageSelected,
		setImageSelected,
		setAlbumPhoto,
	} = useGetPhotoState();

	return {
		isNext,
		setIsNext,
		onPressNext: async () => {
			if (isPreview) {
				await cameraRef.current.resumePreview();
				setIsPreview(false);
			}

			if (imageSelected) {
				setImageSelected(false);
			}

			setIsNext(true);
			setTakePhoto({});
			setAlbumPhoto({});
		},
	};
};
