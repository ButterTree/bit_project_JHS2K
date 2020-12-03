import React, { useState, useEffect } from "react";
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
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ProgressBarMain from "./Screen/ProgressBar/progressBarMain";
import FaceLine from "./Screen/FaceLine";
import OnceSkipHowToPageBtn from "./Buttons/MainScreenBtns/SkipHowToPage/OnceSkipHowToPageBtn";
import ForeverSkipHowToPageBtn from "./Buttons/MainScreenBtns/SkipHowToPage/ForeverSkipHowToPageBtn";
import SaveBtn from "./Buttons/SaveShareCancelBtns/SaveBtn";
import ShareBtn from "./Buttons/SaveShareCancelBtns/ShareBtn";
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

import GetPhotoBtn from "./Buttons/MainScreenBtns/getPhotoBtn/getPhotoPresenter";
import { useGetPhotoState } from "./Buttons/MainScreenBtns/getPhotoBtn/getPhotoContainer";

import TransferBtn from "./Buttons/TransferCancelBtns/transferBtn/transferPresenter";
import { useTransferState } from "./Buttons/TransferCancelBtns/transferBtn/transferContainer";

import { useReadyPhotoState } from "./Buttons/MainScreenBtns/photoStorage";

import NextBtn from "./Buttons/ChangeBtns/nextBtn/nextPresenter";
import { useNextState } from "./Buttons/ChangeBtns/nextBtn/nextContainer";

import CancelBtn from "./Buttons/TransferCancelBtns/cancelBtn/cancelPresenter";
// import { useCancelState } from "./Buttons/TransferCancelBtns/cancelBtn/cancelContainer";

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
	const [isAfterview, setIsAfterview] = useState(false);
	const [isTwoPhotoComplete, setIsTwoPhotoComplete] = useState(false);
	const [isOnceSkipHowToPage, setIsOnceSkipHowToPage] = useState(false);
	const [isForeverSkipHowToPage, setIsForeverSkipHowToPage] = useState(false);

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

	const {
		genderValue,
		setGenderValue,
		onToggleGender,
	} = useGenderToggleState();
	const { isGender, setIsGender, onPressGender } = useGenderState();

	const {
		hasPermission,
		setHasPermission,
		cameraRef,
		isPreview,
		setIsPreview,
		takePhoto,
		setTakePhoto,
		onPresstakePhoto,
	} = useTakePhotoState();

	const {
		imageSelected,
		setImageSelected,
		getPhoto,
		albumPhoto,
		setAlbumPhoto,
	} = useGetPhotoState();

	const { cameraType, switchCameraType } = useCameraTypeState();

	const { selectedPhotos, setSelectedPhotos } = useReadyPhotoState();

	const { isLoading, resultPhotoList, getTransferImage } = useTransferState();

	const { isNext, setIsNext, onPressNext } = useNextState();

	// const { setCancelClear } = useCancelState();

	console.log(
		`===================\ntakePhoto: ${
			takePhoto.base64 ? takePhoto.base64.substring(0, 50) : null
		}`
	);

	console.log(
		`albumPhoto: ${
			albumPhoto.base64 ? albumPhoto.base64.substring(0, 50) : null
		}`
	);

	console.log(
		`selectedPhotos: ${selectedPhotos.length !== 0 ? selectedPhotos : null}`
	);

	console.log(`Gender is now ${isGender}`);
	console.log(`People Number is now ${isTwoPeople}\n===================`);

	useEffect(() => {
		(async () => {
			const howToStatus = await AsyncStorage.getItem("show_howTo");
			if (howToStatus !== null ? !JSON.parse(howToStatus) : false) {
				setIsForeverSkipHowToPage(true);
			}

			setSelectedPhotos([
				...selectedPhotos,
				takePhoto.base64
					? takePhoto.base64.substring(0, 50)
					: null || albumPhoto.base64
					? albumPhoto.base64.substring(0, 50)
					: null,
			]);
		})();
	}, [takePhoto.base64, albumPhoto.base64]);

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

	const setCancelClear = async () => {
		if (isPreview) {
			await cameraRef.current.resumePreview();
		}

		if (imageSelected) {
			setImageSelected(false);
		}
		setIsPreview(false);
		setIsAfterview(false);
		setIsTwoPeople(false);
		setTwoPeopleToggleValue(false);
		setIsTwoPhotoComplete(false);
		setIsGender("female"); // 취소 버튼 누르면 성별 '여자'로 초기화

		setTakePhoto({});
		setAlbumPhoto({});
		setSelectedPhotos([]);
	};

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
		} catch (error) {
			alert(`Open Sharing Error: ${error}`);
		}
	};

	if (hasPermission === true) {
		return isLoading ? (
			<ProgressBarMain />
		) : (
			<CenterView>
				{!imageSelected && !isAfterview && (
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
						) : !takePhoto.base64 ? (
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
										onPress={onPressGender}
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

				{imageSelected && (
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
											marginTop: 25,
									  }
							}
							source={{ uri: takePhoto.uri || albumPhoto.uri }}
						/>
						<ChangeFunctionContainer>
							{!isTwoPeople && (
								<GenderBtn
									onPress={onPressGender}
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

				{!isPreview && !isAfterview && !imageSelected && (
					<IconContainer>
						<GetPhotoBtn onPress={getPhoto} />
						<TakePhotoBtn onPress={onPresstakePhoto} />
						<SwitchCameraBtn onPress={switchCameraType} />
					</IconContainer>
				)}
				{isAfterview && !isPreview && (
					<IconContainer>
						<SaveBtn onPress={saveResultPhoto} />
						<ShareBtn onPress={openShareDialog} />
						<CancelBtn onPress={setCancelClear} />
					</IconContainer>
				)}
				{(isPreview || imageSelected) && (
					<IconContainer>
						{selectedPhotos.length === 2 ? (
							<TransferBtn onPress={getTransferImage} />
						) : (
							<NextBtn onPress={onPressNext} />
						)}
						<CancelBtn onPress={setCancelClear} />
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
