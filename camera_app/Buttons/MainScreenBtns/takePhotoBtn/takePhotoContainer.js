import { useState, useRef } from "react";

export const useTakePhotoState = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [firstPhotoUri, setFirstPhotoUri] = useState(null);
  const [secondPhotoUri, setSecondPhotoUri] = useState(null);
  const [firstPhotoBase64, setFirstPhotoBase64] = useState("");
  const [secondPhotoBase64, setSecondPhotoBase64] = useState("");
  const cameraRef = useRef();

  return {
    cameraRef,
    isPreview,
    setIsPreview,
    takePhoto: async () => {
      if (cameraRef.current) {
        const options = { quality: 1, base64: true };
        const photo = await cameraRef.current.takePictureAsync(options);
        if (photo.uri) {
          await cameraRef.current.pausePreview();
          setIsPreview(true);
          if (firstPhotoBase64 === "") {
            setFirstPhotoUri(photo.uri);
            setFirstPhotoBase64(photo.base64);
          } else {
            setSecondPhotoUri(photo.uri);
            setSecondPhotoBase64(photo.base64);
          }
        }
      }
    },
    firstPhotoBase64,
    setFirstPhotoBase64,
    secondPhotoBase64,
    setSecondPhotoBase64
  };

  //   if (!isTwoPeople) {
  //     firstPhoto = photo.base64;
  //   } else {
  //     if (!firstPhoto) {
  //       firstPhoto = photo.base64; // photo.base64는 촬영한 사진의 이미지 String 값
  //     } else {
  //       secondPhoto = photo.base64;
  //       setIsTwoPhotoComplete(true);
  //     }
  //   }
};
