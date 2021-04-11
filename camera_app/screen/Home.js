import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, Image, Dimensions, Alert } from 'react-native';
import styled from 'styled-components';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { getServerState, imageTransfer } from '../API/api';

import FaceLine from './FaceLine';
import ProgressBarMain from '../components/ProgressBar/ProgressBarMain';

import TwoPeopleBtn from '../components/Buttons/ChangeBtns/TwoPeopleBtn/TwoPeoplePresenter';
import { useTwoPeopleState } from '../components/Buttons/ChangeBtns/TwoPeopleBtn/TwoPeopleContainer';

import GenderBtn from '../components/Buttons/ChangeBtns/GenderBtn/GenderPresenter';
import { useGenderState } from '../components/Buttons/ChangeBtns/GenderBtn/GenderContainer';

import TakePhotoBtn from '../components/Buttons/MainScreenBtns/TakePhotoBtn/TakePhotoPresenter';
import { useTakePhotoState } from '../components/Buttons/MainScreenBtns/TakePhotoBtn/TakePhotoContainer';

import SwitchCameraBtn from '../components/Buttons/MainScreenBtns/SwitchCameraBtn/SwitchCameraPresenter';
import { useCameraTypeState } from '../components/Buttons/MainScreenBtns/SwitchCameraBtn/SwitchCameraContainer';

import GetPhotoBtn from '../components/Buttons/MainScreenBtns/GetPhotoBtn/GetPhotoPresenter';
import { useGetPhotoState } from '../components/Buttons/MainScreenBtns/GetPhotoBtn/GetPhotoContainer';

import TransferBtn from '../components/Buttons/TransferCancelBtns/TransferBtn/TransferPresenter';
import NextBtn from '../components/Buttons/ChangeBtns/NextBtn/NextPresenter';
import CancelBtn from '../components/Buttons/TransferCancelBtns/CancelBtn/CancelPresenter';

import SaveBtn from '../components/Buttons/SaveShareBtns/SaveBtn/SavePresenter';
import ShareBtn from '../components/Buttons/SaveShareBtns/ShareBtn/SharePresenter';

import Notice from './Notice';
import NoticeBtn from '../components/Buttons/MainScreenBtns/NoticeBtns/NoticePresenter';
import { useNoticeState } from '../components/Buttons/MainScreenBtns/NoticeBtns/NoticeContainer';

import OnePersonPopup from '../components/Buttons/PopupBtns/OnePersonPopup';
import TwoPeopleMainPopup from '../components/Buttons/PopupBtns/TwoPeoplePopup';

import OrderLight from '../components/Buttons/PopupBtns/TwoPeopleLights/TwoPeopleLightsPresenter';
import { useLightState } from '../components/Buttons/PopupBtns/TwoPeopleLights/TwoPeopleLightsContainer';

import TwoPeopleLoading from '../components/ProgressBar/TwoPeopleLoading';

import { useModeState } from '../components/Buttons/ChangeBtns/ModeBtn/ModeContainer';

import AdBtn from '../components/Buttons/AdBtn/AdPresenter';
import { useOpenUrlState } from '../components/Buttons/AdBtn/AdContainer';

import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';

const { width, height } = Dimensions.get('window');

const CenterView = styled.View`
  flex: 1;
  background-color: #fadbdb;
`;
const MainBtnContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const ChangeBtnContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
`;
const ChangeBtnBox = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const NoticeContainer = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  flex: 1;
`;
const LightContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

// Image Temporary Storage
let firstPhoto = ''; // base64
let secondPhoto = ''; // base64
let resultPhotoList = []; // [origin png, result png]

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAfterView, setIsAfterView] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [hasAlbumPermission, setHasAlbumPermission] = useState(false);

  const {
    isTwoPeople,
    setIsTwoPeople,
    onPressTwoPeople,
    twoPeopleToggleValue,
    setTwoPeopleToggleValue,
    onToggleTwoPeople,
  } = useTwoPeopleState();

  const {
    isGender,
    setIsGender,
    onPressGender,
    genderValue,
    setGenderValue,
    onToggleGender,
  } = useGenderState();

  const {
    cameraRef,
    isPreview,
    setIsPreview,
    takePhoto,
    setTakePhoto,
    onPressTakePhoto,
  } = useTakePhotoState();

  const {
    imageSelected,
    setImageSelected,
    onPressGetPhoto,
    albumPhoto,
    setAlbumPhoto,
  } = useGetPhotoState();

  const { cameraType, switchCameraType } = useCameraTypeState();

  const { isNotice, onPressNotice } = useNoticeState();

  const {
    firstLightColor,
    firstLightText,
    secondLightColor,
    secondLightText,
    LightDefaultColor,
  } = useLightState();

  const { isMode } = useModeState();

  const { openUrl } = useOpenUrlState();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      mounted && setHasPermission(status === 'granted');

      const { status: albumStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      mounted && setHasAlbumPermission(albumStatus === 'granted');
    })();

    (async () => {
      // Display an interstitial
      await AdMobInterstitial.setAdUnitID('ca-app-pub-7808799631738977/7802279225'); // Test ID, Replace with your-admob-unit-id
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      await AdMobInterstitial.showAdAsync();
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 2인일 때, 2번째 사진으로 넘어가는 버튼
  const onPressNext = async () => {
    if (isPreview) {
      await cameraRef.current.resumePreview();
      setIsPreview(false);
    }

    if (imageSelected) {
      setImageSelected(false);
    }

    firstPhoto = (takePhoto && takePhoto.base64) || (albumPhoto && albumPhoto.base64);

    setIsTwoPeople(true);
    setTwoPeopleToggleValue(true);
    setTakePhoto({});
    setAlbumPhoto({});
  };

  // 취소 버튼, 모든 상태 초기화
  const onPressCancel = async () => {
    if (isPreview) {
      await cameraRef.current.resumePreview();
      setIsPreview(false);
      setTakePhoto({});
    }

    if (imageSelected) {
      setImageSelected(false);
      setAlbumPhoto({});
    }

    setIsGender('female'); // 취소 버튼 누르면 성별 '여자'로 초기화
    setGenderValue(false);

    setIsTwoPeople(false);
    setTwoPeopleToggleValue(false);

    setIsAfterView(false);
    firstPhoto = '';
    secondPhoto = '';
    setTakePhoto({});
    setAlbumPhoto({});
  };

  // AI Server로 전송하는 버튼
  const getTransferImage = async () => {
    try {
      if (isPreview) {
        await cameraRef.current.resumePreview();
        setIsPreview(false);
      }

      if (imageSelected) {
        setImageSelected(false);
      }

      if (!firstPhoto) {
        firstPhoto = (takePhoto && takePhoto.base64) || (albumPhoto && albumPhoto.base64);
      } else {
        secondPhoto = (takePhoto && takePhoto.base64) || (albumPhoto && albumPhoto.base64);
      }

      // Image Transformation Start
      setIsLoading(true);

      // 대기 인원 알림창 추가
      const waiting_num = await getServerState();
      if (waiting_num >= 20) {
        Alert.alert(
          `현재 ${waiting_num} 명 대기중입니다. 🕺💃`,
          `예상 대기시간은 ${Math.round((waiting_num * 25) / 4 / 60)} 분 입니다. ⏰`
        );
      }

      resultPhotoList = await imageTransfer(firstPhoto, secondPhoto, isGender, isMode);

      setIsLoading(false);
      // Image Transformation End

      firstPhoto = '';
      secondPhoto = '';
      setIsAfterView(true);
    } catch (e) {
      alert(`getTransferImage Error: ${e}`);
    }
  };

  // 결과 이미지 저장 버튼
  const onPressSave = async () => {
    try {
      // original Image path 설정
      const originalImg = resultPhotoList[0].split('data:image/png;base64,')[1];
      const originalFileName = FileSystem.documentDirectory + 'original.png';
      await FileSystem.writeAsStringAsync(originalFileName, originalImg, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // changed Image path 설정
      const changedImg = resultPhotoList[1].split('data:image/png;base64,')[1];
      const changedFileName = FileSystem.documentDirectory + 'changed.png';
      await FileSystem.writeAsStringAsync(changedFileName, changedImg, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Original, Changed 모두 갤러리 저장
      await MediaLibrary.saveToLibraryAsync(originalFileName);
      await MediaLibrary.saveToLibraryAsync(changedFileName);

      Alert.alert('저장완료❤', '갤러리에서 확인할 수 있습니다.');
    } catch (error) {
      alert(`Save Result Photo Error: ${error}`);
    }
  };

  // 공유 버튼
  const onPressShare = async () => {
    try {
      // changed Image path 설정
      const changedImg = resultPhotoList[1].split('data:image/png;base64,')[1];
      const changedFileName = FileSystem.documentDirectory + 'changed.png';
      await FileSystem.writeAsStringAsync(changedFileName, changedImg, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // changed Image 공유
      await Sharing.shareAsync(changedFileName);
    } catch (error) {
      alert(`Open Sharing Error: ${error}`);
    }
  };

  // View
  if (hasPermission === true) {
    return isLoading && !isTwoPeople && !secondPhoto ? (
      <ProgressBarMain />
    ) : isTwoPeople && secondPhoto ? (
      <TwoPeopleLoading
        firstPhoto={`data:image/png;base64,${firstPhoto}`}
        secondPhoto={`data:image/png;base64,${secondPhoto}`}
      />
    ) : (
      <CenterView>
        {!imageSelected && !isAfterView && (
          <Camera
            style={
              height >= 700
                ? {
                    alignItems: 'center',
                    width: width,
                    height: width / 0.75,
                    marginTop: height / 12,
                  }
                : {
                    alignItems: 'center',
                    width: width,
                    height: width / 0.75,
                    marginTop: 0,
                  }
            }
            type={cameraType}
            autoFocus={Camera.Constants.AutoFocus.on}
            ref={cameraRef}
          >
            <Text
              style={{
                textAlign: 'justify',
                marginTop: '15%',
                color: '#FFFFFF',
                fontSize: 14,
                opacity: 0.6,
              }}
            >
              {`밝은 곳에서 눈을 크게 뜨고 촬영해주세요`}
            </Text>
            <FaceLine />
            {!isTwoPeople ? <OnePersonPopup /> : <TwoPeopleMainPopup />}
            <ChangeBtnContainer>
              <ChangeBtnBox>
                {!isTwoPeople ? (
                  <GenderBtn
                    onPress={onPressGender}
                    value={genderValue}
                    onToggle={onToggleGender}
                  />
                ) : !firstPhoto ? (
                  <LightContainer>
                    <OrderLight backgroundColor={firstLightColor} text={firstLightText} />
                    <OrderLight backgroundColor={LightDefaultColor} text={secondLightText} />
                  </LightContainer>
                ) : (
                  <LightContainer>
                    <OrderLight backgroundColor={LightDefaultColor} text={firstLightText} />
                    <OrderLight backgroundColor={secondLightColor} text={secondLightText} />
                  </LightContainer>
                )}
              </ChangeBtnBox>
              <ChangeBtnBox>
                <TwoPeopleBtn
                  onPress={onPressTwoPeople}
                  value={twoPeopleToggleValue}
                  onToggle={onToggleTwoPeople}
                />
              </ChangeBtnBox>
              <ChangeBtnBox>
                <NoticeBtn onPress={onPressNotice} />
              </ChangeBtnBox>
            </ChangeBtnContainer>
          </Camera>
        )}

        {imageSelected && (
          <Image
            style={
              height >= 700
                ? {
                    width: width,
                    height: width / 0.75,
                    marginTop: 50,
                    resizeMode: 'contain',
                  }
                : {
                    width: width,
                    height: width / 0.75,
                    marginTop: 25,
                    resizeMode: 'contain',
                  }
            }
            source={{ uri: albumPhoto.uri }}
          />
        )}

        {isAfterView && (
          <>
            <AdBtn onPress={openUrl} />
            <Image
              style={
                height >= 700
                  ? {
                      width: width * 0.9,
                      height: width * 0.9,
                      marginTop: '45%',
                      marginBottom: '0%',
                      marginLeft: width * 0.05,
                    }
                  : {
                      width: width * 0.9,
                      height: width * 0.9,
                      marginTop: '45%',
                      marginBottom: '0%',
                      marginLeft: width * 0.05,
                    }
              }
              source={{ uri: resultPhotoList[1] }}
            />
          </>
        )}

        {!isPreview && !imageSelected && !isAfterView && (
          <MainBtnContainer>
            <GetPhotoBtn onPress={onPressGetPhoto} />
            <TakePhotoBtn onPress={onPressTakePhoto} />
            <SwitchCameraBtn onPress={switchCameraType} />
          </MainBtnContainer>
        )}
        {isAfterView && (
          <MainBtnContainer>
            <CancelBtn onPress={onPressCancel} />
            <SaveBtn onPress={onPressSave} />
            <ShareBtn onPress={onPressShare} />
          </MainBtnContainer>
        )}
        {(isPreview || imageSelected) && (
          <MainBtnContainer>
            <CancelBtn onPress={onPressCancel} />

            {!isTwoPeople || (isTwoPeople && firstPhoto) ? (
              <TransferBtn onPress={getTransferImage} />
            ) : (
              <NextBtn onPress={onPressNext} />
            )}
          </MainBtnContainer>
        )}
        {isNotice && (
          <NoticeContainer>
            <Notice onPress={onPressNotice} />
          </NoticeContainer>
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
