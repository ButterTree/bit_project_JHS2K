import { useState } from "react";

export const useReadyPhotoState = () => {
	const [selectedPhotos, setSelectedPhotos] = useState([]);

	return {
		selectedPhotos,
		setSelectedPhotos,
	};
};
