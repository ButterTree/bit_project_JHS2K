import React, { useState, useRef, useEffect } from "react";
import {
	ActivityIndicator,
	Text,
	Image,
	Dimensions,
	Alert,
	ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import styled from "styled-components";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { imageTransfer } from "./api";
import ProgressBarMain from "./Screen/ProgressBar/progressBarMain";
import FaceLine from "./Screen/FaceLine";
import OnceSkipHowToPageBtn from "./Buttons/MainScreenBtns/SkipHowToPage/OnceSkipHowToPageBtn";
import ForeverSkipHowToPageBtn from "./Buttons/MainScreenBtns/SkipHowToPage/ForeverSkipHowToPageBtn";
import GetPhotoBtn from "./Buttons/MainScreenBtns/GetPhotoBtn";
// import SwitchCameraBtn from "./Buttons/MainScreenBtns/SwitchCameraBtn";
// import TakePhotoBtn from "./Buttons/MainScreenBtns/TakePhotoBtn";
import SaveBtn from "./Buttons/SaveShareCancelBtns/SaveBtn";
import ShareBtn from "./Buttons/SaveShareCancelBtns/ShareBtn";
import CancelBtn from "./Buttons/TransferCancelBtns/CancelBtn";
import TransferBtn from "./Buttons/TransferCancelBtns/TransferBtn";
// import ChangeFemaleBtn from "./Buttons/ChangeBtns/ChangeFemaleBtn";
// import ChangeTwoPeopleBtn from "./Buttons/ChangeBtns/ChangeTwoPeopleBtn"
import NextBtn from "./Buttons/ChangeBtns/nextBtn/nextPresenter";
import OnePersonPopup from "./Popup/OnePersonPopup";
import TwoPeopleMainPopup from "./Popup/TwoPeople/TwoPeopleMainPopup";
import FirstPicLightOff from "./Popup/TwoPeople/FirstPicLightOff";
import FirstPicLightOn from "./Popup/TwoPeople/FirstPicLightOn";
import SecondPicLightOff from "./Popup/TwoPeople/SecondPicLightOff";
import SecondPicLightOn from "./Popup/TwoPeople/SecondPicLightOn";

import TwoPeopleBtn from "./Buttons/ChangeBtns/twoPeopleBtn/twoPeoplePresenter";
import {
	useTwoPeopleToggleState,
	useTwoPeopleState,
} from "./Buttons/ChangeBtns/twoPeopleBtn/twoPeopleContainer";

import GenderBtn from "./Buttons/ChangeBtns/genderBtn/genderPresenter";
import {
	useGenderState,
	useGenderToggleState,
} from "./Buttons/ChangeBtns/genderBtn/genderContainer";

import TakePhotoBtn from "./Buttons/MainScreenBtns/takePhotoBtn/takePhotoPresenter";
import { useTakePhotoState } from "./Buttons/MainScreenBtns/takePhotoBtn/takePhotoContainer";

import SwitchCameraBtn from "./Buttons/MainScreenBtns/switchCameraBtn/switchCameraPresenter";
import { useCameraTypeState } from "./Buttons/MainScreenBtns/switchCameraBtn/switchCameraContainer";

// 받는 결과 이미지
let photos = []; // 모델 계산후 얻은 [원본, 결과] 사진 리스트 저장용

const { width, height } = Dimensions.get("window");

const CenterView = styled.View`
	flex: 1;
	background-color: white;
`;

const IconContainer = styled.View`
	flex: 1;
	width: 100%;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
`;

const ChangeFunctionContainer = styled.View`
	flex: 1;
	width: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	position: absolute;
	bottom: 0;
`;

const ChangeButtonContainer = styled.View`
	width: 100%;
	flex: 1;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
`;

const HowToPage = styled.View`
	width: 100%;
	height: 100%;
	position: absolute;
`;

const PicLightContainer = styled.View`
	width: 100%;
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 3%;
	margin-top: 10%;
	position: absolute;
	top: 3%;
`;

export default function App() {
	const [hasPermission, setHasPermission] = useState(null);
	// const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
	const [image, setImage] = useState(null);
	// const [isPreview, setIsPreview] = useState(false);
	const [isAfterview, setIsAfterview] = useState(false);
	const [imageSelected, setImageSelected] = useState(false);
	const [imageComeback, setImageComeback] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	//   const [isTwoPeople, setIsTwoPeople] = useState(false)
	const [isTwoPhotoComplete, setIsTwoPhotoComplete] = useState(false);
	const [isOnceSkipHowToPage, setIsOnceSkipHowToPage] = useState(false);
	const [isForeverSkipHowToPage, setIsForeverSkipHowToPage] = useState(false);
	// const cameraRef = useRef();

	const {
		twoPeopleValue,
		setTwoPeopleToggleValue,
		onToggleTwoPeople,
	} = useTwoPeopleToggleState();

	const {
		isTwoPeople,
		setIsTwoPeople,
		onPressTwoPeople,
	} = useTwoPeopleState();

	const { genderValue, onToggleGender } = useGenderToggleState();
	const { isGender, setIsGender } = useGenderState();

	const {
		cameraRef,
		isPreview,
		setIsPreview,
		takePhoto,
		firstPhotoBase64,
		setFirstPhotoBase64,
		secondPhotoBase64,
		setSecondPhotoBase64,
	} = useTakePhotoState();

	const { cameraType, switchCameraType } = useCameraTypeState();
	// 보내는 이미지
	// let firstPhoto = photoBase64 ? photoBase64 : ""; // 처음 찍은 사진 저장용
	// let secondPhoto = firstPhoto ? photoBase64 : ""; // 두번째 찍은 사진 저장용

	console.log(
		`firstPhoto: ${
			firstPhotoBase64 ? firstPhotoBase64.substring(0, 50) : null
		}`,
		`secondPhoto: ${
			secondPhotoBase64 ? secondPhotoBase64.substring(0, 50) : null
		}`
	);

	useEffect(() => {
		(async () => {
			const { status } = await Permissions.askAsync(Permissions.CAMERA);
			setHasPermission(status == "granted");

			const {
				picStatus,
			} = await ImagePicker.requestCameraRollPermissionsAsync();
			setImage(picStatus === "granted");

			const howToStatus = await AsyncStorage.getItem("show_howTo");
			if (howToStatus !== null ? !JSON.parse(howToStatus) : false) {
				setIsForeverSkipHowToPage(true);
			}
		})();
	}, []);

	const OnceSkipHowToPage = () => {
		setIsOnceSkipHowToPage(true);
	};

	const ForeverSkipHowToPage = async () => {
		try {
			await AsyncStorage.setItem("show_howTo", JSON.stringify(false));
		} catch (e) {
			console.log(`setItemError: ${e}`);
		}
		setIsForeverSkipHowToPage(true);
	};

	const getPhotos = async () => {
		const photo = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: false,
			quality: 1,
			base64: true,
		});
		if (!photo.uri) {
			setHasPermission(true);
		} else {
			setImage(photo.uri);
			setImageSelected(true);
			setImageComeback(true);
		}

		if (!isTwoPeople) {
			setIsGender("female"); // 성별 default 값인 여성으로 초기화
		} else {
			setIsTwoPhotoComplete(true);
		}
	};

	const getTransferImage = async () => {
		try {
			setIsLoading(true);
			photos = await imageTransfer(
				firstPhotoBase64,
				secondPhotoBase64,
				isGender
			);
			setIsLoading(false);

			if (isPreview) {
				await cameraRef.current.resumePreview();
			}

			if (!photos) {
				setIsAfterview(false);
				setIsTwoPeople(false);
				setIsTwoPhotoComplete(false);

				setFirstPhotoBase64("");
				setSecondPhotoBase64("");
			} else {
				setIsAfterview(true);
			}

			setIsPreview(false);
			setImageSelected(false);
			setImageComeback(false);

			setIsGender("female");
		} catch (error) {
			alert(`getTransferImage Error: ${error}`);
		}
	};

	const cancelPreviewBtn = async () => {
		if (isPreview) {
			await cameraRef.current.resumePreview();
		}

		setIsPreview(false);
		setImageSelected(false);
		setImageComeback(false);
		setIsAfterview(false);
		setIsTwoPeople(false);
		setTwoPeopleToggleValue(false);
		setIsTwoPhotoComplete(false);
		setIsGender("female"); // 취소 버튼 누르면 성별 '여자'로 초기화
		setFirstPhotoBase64("");
		setSecondPhotoBase64("");
	};

	const cameraAgain = async () => {
		if (isPreview) {
			await cameraRef.current.resumePreview();
			setIsPreview(false);
		}

		if (imageSelected) {
			setImageSelected(false);
			setImageComeback(false);
		}

		if (firstPhotoBase64 !== "") {
			setIsTwoPeople(true);
		}
	};

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
			Alert.alert("저장완료❤", "갤러리에서 확인할 수 있습니다.");
			const base64Code = photos[1].split("data:image/png;base64,")[1];

			const filename = FileSystem.documentDirectory + "changed.png";

			await FileSystem.writeAsStringAsync(filename, base64Code, {
				encoding: FileSystem.EncodingType.Base64,
			});

			await MediaLibrary.saveToLibraryAsync(filename);

			setIsAfterview(false);
			setIsTwoPeople(false);
			setIsTwoPhotoComplete(false);
			setFirstPhotoBase64("");
			setSecondPhotoBase64("");
		} catch (error) {
			alert(`Save Result Photo Error: ${error}`);
		}
	};

	const openShareDialog = async () => {
		try {
			const base64Code = photos[1].split("data:image/png;base64,")[1];

			const filename = FileSystem.documentDirectory + "changed.png";

			await FileSystem.writeAsStringAsync(filename, base64Code, {
				encoding: FileSystem.EncodingType.Base64,
			});

			await Sharing.shareAsync(filename);

			setIsAfterview(false);
			setIsTwoPeople(false);
			setIsTwoPhotoComplete(false);
			setFirstPhotoBase64("");
			setSecondPhotoBase64("");
		} catch (error) {
			alert(`Open Sharing Error: ${error}`);
		}
	};

	if (hasPermission === true) {
		return isLoading ? (
			<ProgressBarMain />
		) : (
			<CenterView>
				{!imageSelected && !imageComeback && !isAfterview && (
					<Camera
						style={
							height >= 790
								? {
										alignItems: "center",
										width: width,
										height: width / 0.75,
										marginTop: 50,
								  }
								: {
										alignItems: "center",
										width: width,
										height: width / 0.65,
										marginTop: 0,
								  }
						}
						type={cameraType}
						ref={cameraRef}
					>
						<FaceLine />
						{!isTwoPeople ? (
							<OnePersonPopup />
						) : (
							<TwoPeopleMainPopup />
						)}
						{!isTwoPeople ? (
							<></>
						) : !firstPhotoBase64 ? (
							<PicLightContainer>
								<FirstPicLightOn />
								<SecondPicLightOff />
							</PicLightContainer>
						) : (
							<PicLightContainer>
								<FirstPicLightOff />
								<SecondPicLightOn />
							</PicLightContainer>
						)}

						<ChangeFunctionContainer>
							<ChangeButtonContainer>
								{!isTwoPeople && (
									<GenderBtn
										onPress={setIsGender}
										value={genderValue}
										onToggle={onToggleGender}
									/>
								)}
							</ChangeButtonContainer>
							<ChangeButtonContainer>
								<TwoPeopleBtn
									onPress={onPressTwoPeople}
									value={twoPeopleValue}
									onToggle={onToggleTwoPeople}
								/>
							</ChangeButtonContainer>
							<ChangeButtonContainer></ChangeButtonContainer>
						</ChangeFunctionContainer>
					</Camera>
				)}

				{imageSelected && imageComeback && (
					<>
						<Image
							style={
								height >= 790
									? {
											width: width,
											height: width / 0.75,
											marginTop: 50,
									  }
									: {
											width: width,
											height: width / 0.75,
											marginTop: 0,
									  }
							}
							source={{ uri: image }}
						/>
						<ChangeFunctionContainer>
							{!isTwoPeople && (
								<GenderBtn
									onPress={setIsGender}
									value={genderValue}
									onToggle={onToggleGender}
								/>
							)}
						</ChangeFunctionContainer>
					</>
				)}

				{isAfterview && (
					<Image
						style={
							height >= 790
								? {
										width: width,
										height: width,
										marginTop: 100,
								  }
								: {
										width: width,
										height: width,
										marginTop: 0,
								  }
						}
						source={{ uri: photos[1] }}
					/>
				)}

				{!isPreview &&
					!imageComeback &&
					!isAfterview &&
					!imageSelected && (
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
						(firstPhotoBase64 && secondPhotoBase64) ||
						(!isPreview && !(imageSelected && imageComeback)) ? (
							<TransferBtn onPress={getTransferImage} />
						) : (
							<NextBtn onPress={cameraAgain} />
						)}
						<CancelBtn onPress={cancelPreviewBtn} />
					</IconContainer>
				)}
				{!isOnceSkipHowToPage && !isForeverSkipHowToPage && (
					<HowToPage>
						<ImageBackground
							source={require("./assets/app_intro.png")}
							style={{
								width: "100%",
								height: "100%",
							}}
						>
							<ForeverSkipHowToPageBtn
								onPress={ForeverSkipHowToPage}
							/>
							<OnceSkipHowToPageBtn onPress={OnceSkipHowToPage} />
						</ImageBackground>
					</HowToPage>
				)}
			</CenterView>
		);
	} else if (hasPermission === false) {
		return (
			<CenterView>
				<Text>Don't have permission for this</Text>
			</CenterView>
		);
	} else {
		return (
			<CenterView>
				<ActivityIndicator />
			</CenterView>
		);
	}
}
