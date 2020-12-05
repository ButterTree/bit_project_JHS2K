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
  const { isPreview, setIsPreview, takePhoto } = useTakePhotoState();
  const { isSelected, setIsSelected, albumPhoto } = useGetPhotoState();

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

        if (isSelected) {
          setIsSelected(false);
        }

        // Image Transformation Start
        setIsLoading(true);

        console.log(`getTransfer Check: ${isGender}`);

        let firstPhoto = takePhoto.base64 || albumPhoto.base64;

        setResultPhotoList(
          await imageTransfer(firstPhoto, (secondPhoto = ""), isGender)
        );

        setIsLoading(false);
        // Image Transformation End
      } catch (e) {
        alert(`getTransferImage Error: ${e}`);
      }
    },
    resultPhotoList
  };

  // cancel 함수 돌려서 초기화하기
};
