import React, { useState, useRef, useEffect } from "react"
import { ActivityIndicator, Text, Image, Dimensions, Alert } from "react-native"
import { Camera } from "expo-camera"
// import * as FaceDetector from "expo-face-detector";
import styled from "styled-components"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import * as MediaLibrary from "expo-media-library"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { imageTransfer } from "./api"
import ProgressBarMain from "./Screen/ProgressBar/progressBarMain"
import FaceLine from "./Screen/FaceLine"
import GetPhotoBtn from "./Buttons/MainScreenBtns/GetPhotoBtn"
import SwitchCameraBtn from "./Buttons/MainScreenBtns/SwitchCameraBtn"
import TakePhotoBtn from "./Buttons/MainScreenBtns/TakePhotoBtn"
import SaveBtn from "./Buttons/SaveShareCancelBtns/SaveBtn"
import ShareBtn from "./Buttons/SaveShareCancelBtns/ShareBtn"
import CancelBtn from "./Buttons/TransferCancelBtns/CancelBtn"
import TransferBtn from "./Buttons/TransferCancelBtns/TransferBtn"
import ChangeFemaleBtn from "./Buttons/ChangeBtns/ChangeFemaleBtn"
import ChangeTwoPeopleBtn from "./Buttons/ChangeBtns/ChangeTwoPeopleBtn"
import NextBtn from "./Buttons/ChangeBtns/Change2ndCameraBtn"
import OnePersonPopup from "./Popup/OnePersonPopup"
import TwoPeoplePopup from "./Popup/TwoPeoplePopup"

// 보내는 이미지
let firstPhoto = "" // 처음 찍은 사진 저장용
let secondPhoto = "" // 두번째 찍은 사진 저장용

// 받는 결과 이미지
let photos = [] // 모델 계산후 얻은 [원본, 결과] 사진 리스트 저장용
let gender = "female"

const { width, height } = Dimensions.get("window")

const CenterView = styled.View`
  flex: 1;
  background-color: white;
`

const IconContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 80%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`

const ChangeFunctionContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

const ChangeButtonContainer = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front)
  const [image, setImage] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [isAfterview, setIsAfterview] = useState(false)
  const [imageSelected, setImageSelected] = useState(false)
  const [imageComeback, setImageComeback] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTwoPeople, setIsTwoPeople] = useState(false)
  const [isTwoPhotoComplete, setIsTwoPhotoComplete] = useState(false)
  // const [leftEyeOpen, setLeftEyeOpen] = useState(false); // 왼쪽 눈 열려있을 확률
  // const [rightEyeOpen, setRightEyeOpen] = useState(false); // 오른쪽 눈 열려있을 확률
  // const [yawAngle, setYawAngle] = useState(false); // 얼굴의 요 각도
  // const [bounds, setBounds] = useState(false); // 얼굴 사각형 위치, 크기
  const cameraRef = useRef()

  useEffect(() => {
    ;(async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA)
      setHasPermission(status == "granted")
      const {
        picStatus
      } = await ImagePicker.requestCameraRollPermissionsAsync()
      setImage(picStatus === "granted")
    })()
  }, [])

  const switchCameraType = () => {
    setCameraType((cameraType) =>
      cameraType === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front
    )
  }

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const options = { quality: 1, base64: true }
        let photo = await cameraRef.current.takePictureAsync(options)
        const source = photo.uri

        if (source) {
          await cameraRef.current.pausePreview()
          setIsPreview(true)
        }

        if (!isTwoPeople) {
          firstPhoto = photo.base64
        } else {
          if (!firstPhoto) {
            firstPhoto = photo.base64 // photo.base64는 촬영한 사진의 이미지 String 값
          } else {
            secondPhoto = photo.base64
            setIsTwoPhotoComplete(true)
          }
        }
      }

      // console.log(
      // 	"firstPhoto:" + firstPhoto.substring(0, 20),
      // 	"secondPhoto: " + secondPhoto.substring(0, 20)
      // );
      // if (photo.uri) {
      //   this.savePhoto(photo.uri);
      // }
    } catch (error) {
      alert(`error: ${error}`)
    }
  }

  const getPhotos = async () => {
    const photo = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      base64: true
    })
    if (!photo.uri) {
      setHasPermission(true)
    } else {
      setImage(photo.uri)
      setImageSelected(true)
      setImageComeback(true)
    }

    if (!isTwoPeople) {
      firstPhoto = photo.base64
      gender = "female" // 성별 default 값인 여성으로 초기화
    } else {
      if (!firstPhoto) {
        firstPhoto = photo.base64 // photo.base64는 촬영한 사진의 이미지 String 값
      } else {
        secondPhoto = photo.base64
        setIsTwoPhotoComplete(true)
      }
    }

    // console.log(
    // 	"firstPhoto:" + firstPhoto.substring(0, 20),
    // 	"secondPhoto:" + secondPhoto.substring(0, 20)
    // );
  }

  const changeToMale = () => {
    if (gender === "female") {
      gender = "male"
    } else {
      gender = "female"
    }
    // console.log(gender);
  }

  const changeToTwoPeople = () => {
    isTwoPeople ? setIsTwoPeople(false) : setIsTwoPeople(true)
    // console.log(isTwoPeople);
  }

  const getTransferImage = async () => {
    try {
      setIsLoading(true)
      photos = await imageTransfer(firstPhoto, secondPhoto, gender)
      setIsLoading(false)

      await cameraRef.current.resumePreview()

      if (!photos) {
        setIsAfterview(false)
        setIsTwoPeople(false)
        setIsTwoPhotoComplete(false)

        firstPhoto = ""
        secondPhoto = ""
      } else {
        setIsAfterview(true)
      }

      setIsPreview(false)
      setImageSelected(false)
      setImageComeback(false)

      gender = "female"
    } catch (error) {
      console.log(`getTransferImage Error: ${error}`)
    }
  }

  const cameraAgain = async () => {
    if (isPreview) {
      await cameraRef.current.resumePreview()
      setIsPreview(false)
      // console.log(isTwoPeople, isTwoPhotoComplete);
    }

    if (imageSelected) {
      setImageSelected(false)
      setImageComeback(false)
    }
  }

  const cancelPreviewBtn = async () => {
    await cameraRef.current.resumePreview()

    setIsPreview(false)
    setImageSelected(false)
    setImageComeback(false)
    setIsAfterview(false)
    setIsTwoPeople(false)
    setIsTwoPhotoComplete(false)
    gender = "female" // 취소 버튼 누르면 성별 '여자'로 초기화
    firstPhoto = ""
    secondPhoto = ""
    // console.log(
    // 	firstPhoto ? firstPhoto.substring(0, 10) : "firstPhoto is Empty!",
    // 	secondPhoto ? secondPhoto.substring(0, 10) : "secondPhoto is Empty!"
    // );
  }

  // const savePhoto = async (uri) => {
  // 	try {
  // 		const { status } = await Permissions.askAsync(
  // 			Permissions.CAMERA_ROLL
  // 		);
  // 		if (status === "granted") {
  // 			const asset = await MediaLibrary.createAssetAsync(uri);
  // 			let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  // 			if (album === null) {
  // 				album = await MediaLibrary.createAlbumAsync(ALBUM_NAME);
  // 			} else {
  // 				await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
  // 			}
  // 		} else {
  // 			setHasPermission(false);
  // 		}
  // 	} catch (error) {
  // 		console.log(`savePhotoError: ${error}`);
  // 	}
  // };

  const saveResultPhoto = async () => {
    try {
      Alert.alert("저장완료❤", "갤러리에서 확인할 수 있습니다.")
      const base64Code = photos[1].split("data:image/png;base64,")[1]

      const filename = FileSystem.documentDirectory + "changed.png"

      await FileSystem.writeAsStringAsync(filename, base64Code, {
        encoding: FileSystem.EncodingType.Base64
      })

      await MediaLibrary.saveToLibraryAsync(filename)

      setIsAfterview(false)
      setIsTwoPeople(false)
      setIsTwoPhotoComplete(false)
      firstPhoto = ""
      secondPhoto = ""
    } catch (error) {
      console.log(error)
    }
  }

  const openShareDialog = async () => {
    try {
      const base64Code = photos[1].split("data:image/png;base64,")[1]

      const filename = FileSystem.documentDirectory + "changed.png"

      await FileSystem.writeAsStringAsync(filename, base64Code, {
        encoding: FileSystem.EncodingType.Base64
      })

      await Sharing.shareAsync(filename)

      setIsAfterview(false)
      setIsTwoPeople(false)
      setIsTwoPhotoComplete(false)
      firstPhoto = ""
      secondPhoto = ""
    } catch (error) {
      console.log(error)
    }
  }

  // const onFacesDetected = ({ faces }) => {
  // 	const face = faces[0];
  // 	if (face) {
  // 		if (face.leftEyeOpenProbability >= 0.9) {
  // 			// setLeftEyeOpen(true);
  // 			// setModalVisible(false);
  // 		} else {
  // 			// displayModal();
  // 			// alert('정면을 바라보고 눈을 바르게 뜨세요.');
  // 			// setModalVisible(true);
  // 			// popup();
  // 		}
  // 		if (face.RightEyeOpenProbability >= 0.8) {
  // 			// setModalVisible(false);
  // 			// setRightEyeOpen(true);
  // 		} else {
  // 			// alert('오른쪽눈을 뜨세요');
  // 			// setModalVisible(true);
  // 		}
  // 	}
  // };

  if (hasPermission === true) {
    return isLoading ? (
      <ProgressBarMain />
    ) : (
      <CenterView>
        <Camera
          style={{
            alignItems: "center",
            width: width,
            height: height / 1.2
          }}
          type={cameraType}
          ref={cameraRef}
          // onFacesDetected={
          // 	(leftEyeOpen ? null : onFacesDetected,
          // 	rightEyeOpen ? null : onFacesDetected,
          // 	yawAngle ? null : onFacesDetected,
          // 	bounds ? null : onFacesDetected)
          // }
          // faceDetectorSettings={{
          // 	// mode: FaceDetector.Constants.Mode.fast,
          // 	detectLandmarks: FaceDetector.Constants.Landmarks.all,
          // 	runClassifications:
          // 		FaceDetector.Constants.Classifications.all,
          // 	minDetectionInterval: 3000,
          // 	// tracking: true,
          // }}
        >
          <FaceLine />
          {!isTwoPeople ? <OnePersonPopup /> : <TwoPeoplePopup />}
          <ChangeFunctionContainer>
            <ChangeButtonContainer>
              {!isTwoPeople && <ChangeFemaleBtn onPress={changeToMale} />}
            </ChangeButtonContainer>
            <ChangeButtonContainer>
              <ChangeTwoPeopleBtn onPress={changeToTwoPeople} />
            </ChangeButtonContainer>
            <ChangeButtonContainer></ChangeButtonContainer>
          </ChangeFunctionContainer>
        </Camera>
        {imageSelected && imageComeback && (
          <>
            <Image
              style={{
                width: width,
                height: height / 1.2,
                position: "absolute"
              }}
              source={{ uri: image }}
            />
            <ChangeFunctionContainer>
              {!isTwoPeople && <ChangeFemaleBtn onPress={changeToMale} />}
            </ChangeFunctionContainer>
          </>
        )}

        {isAfterview && (
          <Image
            style={{
              width: width,
              height: height / 1.2,
              position: "absolute"
            }}
            source={{ uri: photos[1] }}
          />
        )}

        {!isPreview && !imageComeback && !isAfterview && !imageSelected && (
          <IconContainer>
            <GetPhotoBtn onPress={getPhotos} />
            <TakePhotoBtn onPress={takePhoto} />
            <SwitchCameraBtn onPress={switchCameraType} />
          </IconContainer>
        )}
        {isAfterview && !isPreview && (
          <IconContainer>
            <SaveBtn onPress={saveResultPhoto} />
            <ShareBtn onPress={openShareDialog} />
            <CancelBtn onPress={cancelPreviewBtn} />
          </IconContainer>
        )}
        {(imageSelected || isPreview) && (
          <IconContainer>
            {!isTwoPeople ||
            isTwoPhotoComplete ||
            (!isPreview && !(imageSelected && imageComeback)) ? (
              <TransferBtn onPress={getTransferImage} />
            ) : (
              <NextBtn onPress={cameraAgain} />
            )}
            <CancelBtn onPress={cancelPreviewBtn} />
          </IconContainer>
        )}
      </CenterView>
    )
  } else if (hasPermission === false) {
    return (
      <CenterView>
        <Text>Don't have permission for this</Text>
      </CenterView>
    )
  } else {
    return (
      <CenterView>
        <ActivityIndicator />
      </CenterView>
    )
  }
}
