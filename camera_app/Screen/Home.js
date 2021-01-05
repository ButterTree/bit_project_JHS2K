import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, Image, Dimensions, Alert } from 'react-native';
import styled from 'styled-components';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { getServerState, imageTransfer } from '../API/api';

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

const { width, height } = Dimensions.get('window');

const CenterView = styled.View`
  flex: 1;
  background-color: #fff9a3;
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
let FIRST_PHOTO = ''; // base64
let SECOND_PHOTO = ''; // base64
let RESULT_PHOTO_LIST = []; // [origin png, result png]

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
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === 'granted');

      const { status: albumStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasAlbumPermission(albumStatus === 'granted');

      if (albumStatus === 'granted') {
        const photo = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          quality: 1,
          base64: true,
        });
        if (photo.uri) {
          setImageSelected(true);
          setAlbumPhoto({
            uri: photo.uri,
            base64: photo.base64,
          });
        }
      }
    })();
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

    FIRST_PHOTO = (takePhoto && takePhoto.base64) || (albumPhoto && albumPhoto.base64);

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
    FIRST_PHOTO = '';
    SECOND_PHOTO = '';
    setTakePhoto({});
    setAlbumPhoto({});
  };

  // AI Server로 전송하는 버튼
  const getTransferImage = async () => {
    try {
      console.log(`getTransferImage start!`);

      if (isPreview) {
        await cameraRef.current.resumePreview();
        setIsPreview(false);
        setTakePhoto({});
      }

      if (imageSelected) {
        setImageSelected(false);
        setAlbumPhoto({});
      }

      if (!FIRST_PHOTO) {
        FIRST_PHOTO = (takePhoto && takePhoto.base64) || (albumPhoto && albumPhoto.base64);
      } else {
        SECOND_PHOTO = (takePhoto && takePhoto.base64) || (albumPhoto && albumPhoto.base64);
      }

      // Image Transformation Start
      setIsLoading(true);

      // 대기 인원 알림창 추가
      const waiting_num = await getServerState();
      if (waiting_num >= 20) {
        Alert.alert(
          `현재 ${waiting_num} 명 대기중입니다. 🕺💃`,
          `예상 대기시간은 ${Math.round((waiting_num * 25) / 4 / 60)} '분' 입니다. ⏰`
        );
      }

      RESULT_PHOTO_LIST = await imageTransfer(FIRST_PHOTO, SECOND_PHOTO, isGender, isMode);

      setIsLoading(false);
      // Image Transformation End

      FIRST_PHOTO = '';
      SECOND_PHOTO = '';
      setIsAfterView(true);
    } catch (e) {
      alert(`getTransferImage Error: ${e}`);
    }
  };

  // 결과 이미지 저장 버튼
  const onPressSave = async () => {
    try {
      // original Image path 설정
      const originalImg = RESULT_PHOTO_LIST[0].split('data:image/png;base64,')[1];
      const originalFileName = FileSystem.documentDirectory + 'original.png';
      await FileSystem.writeAsStringAsync(originalFileName, originalImg, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // changed Image path 설정
      const changedImg = RESULT_PHOTO_LIST[1].split('data:image/png;base64,')[1];
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
      const changedImg = RESULT_PHOTO_LIST[1].split('data:image/png;base64,')[1];
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
    return isLoading && !isTwoPeople && !SECOND_PHOTO ? (
      <ProgressBarMain />
    ) : isTwoPeople && SECOND_PHOTO ? (
      <TwoPeopleLoading
        FIRST_PHOTO={`data:image/png;base64,${FIRST_PHOTO}`}
        SECOND_PHOTO={`data:image/png;base64,${SECOND_PHOTO}`}
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
                marginTop: '20%',
                color: '#ffffff',
                fontSize: 20,
                opacity: 0.8,
              }}
            >
              {`갤러리에서 증명사진을 선택해주세요`}
            </Text>
            {!isTwoPeople ? <OnePersonPopup /> : <TwoPeopleMainPopup />}

            <ChangeBtnContainer>
              <ChangeBtnBox>
                {!isTwoPeople ? (
                  <GenderBtn
                    onPress={onPressGender}
                    value={genderValue}
                    onToggle={onToggleGender}
                  />
                ) : !FIRST_PHOTO ? (
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
                      marginTop: '50%',
                      marginBottom: '0%',
                      marginLeft: width * 0.05,
                    }
                  : {
                      width: width * 0.9,
                      height: width * 0.9,
                      marginTop: '50%',
                      marginBottom: '0%',
                      marginLeft: width * 0.05,
                    }
              }
              source={{ uri: RESULT_PHOTO_LIST[1] }}
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

            {!isTwoPeople || (isTwoPeople && FIRST_PHOTO) ? (
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
