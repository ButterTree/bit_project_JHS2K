import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Text,
    Image,
    Dimensions,
    Alert,
    ImageBackground
} from 'react-native';
import styled from 'styled-components';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getServerState, imageTransfer } from './API/api';

import ProgressBarMain from './Screen/ProgressBar/ProgressBarMain';
import FaceLine from './Screen/FaceLine';

import TwoPeopleBtn from './Buttons/ChangeBtns/TwoPeopleBtn/TwoPeoplePresenter';
import { useTwoPeopleState } from './Buttons/ChangeBtns/TwoPeopleBtn/TwoPeopleContainer';

import GenderBtn from './Buttons/ChangeBtns/GenderBtn/GenderPresenter';
import { useGenderState } from './Buttons/ChangeBtns/GenderBtn/GenderContainer';

import TakePhotoBtn from './Buttons/MainScreenBtns/TakePhotoBtn/TakePhotoPresenter';
import { useTakePhotoState } from './Buttons/MainScreenBtns/TakePhotoBtn/TakePhotoContainer';

import SwitchCameraBtn from './Buttons/MainScreenBtns/SwitchCameraBtn/SwitchCameraPresenter';
import { useCameraTypeState } from './Buttons/MainScreenBtns/SwitchCameraBtn/SwitchCameraContainer';

import GetPhotoBtn from './Buttons/MainScreenBtns/GetPhotoBtn/GetPhotoPresenter';
import { useGetPhotoState } from './Buttons/MainScreenBtns/GetPhotoBtn/GetPhotoContainer';

import TransferBtn from './Buttons/TransferCancelBtns/TransferBtn/TransferPresenter';
import NextBtn from './Buttons/ChangeBtns/NextBtn/NextPresenter';
import CancelBtn from './Buttons/TransferCancelBtns/CancelBtn/CancelPresenter';

import SaveBtn from './Buttons/SaveShareBtns/SaveBtn/SavePresenter';
import ShareBtn from './Buttons/SaveShareBtns/ShareBtn/SharePresenter';

import NoticeCancelBtn from './Buttons/MainScreenBtns/NoticeBtns/NoticeCancelBtn/NoticeCancelPresenter';
import NoticeNeverBtn from './Buttons/MainScreenBtns/NoticeBtns/NoticeNeverBtn/NoticeNeverPresenter';
import { useNoticeState } from './Buttons/MainScreenBtns/NoticeBtns/NoticeContainer';

import OnePersonPopup from './Buttons/PopupBtns/OnePersonPopup';
import TwoPeopleMainPopup from './Buttons/PopupBtns/TwoPeoplePopup';

import OrderLight from './Buttons/PopupBtns/TwoPeopleLights/TwoPeopleLightsPresenter';
import { useLightState } from './Buttons/PopupBtns/TwoPeopleLights/TwoPeopleLightsContainer';

import TwoPeopleLoading from './Screen/ProgressBar/TwoPeopleLoading';

import ModeBtn from './Buttons/ChangeBtns/ModeBtn/ModePresenter';
import { useModeState } from './Buttons/ChangeBtns/ModeBtn/ModeContainer';

const { width, height } = Dimensions.get('window');
const CenterView = styled.View`
    flex: 1;
    background-color: #fadbdb;
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
    flex: 1;
`;
const LightContainer = styled.View`
    width: 100%;
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0 3%;
    margin-top: 10%;
    position: absolute;
`;

// Image Temporary Storage
let firstPhoto = ''; // base64
let secondPhoto = ''; // base64
let resultPhotoList = []; // [origin png, resultpng]

export default function App() {
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
        onToggleTwoPeople
    } = useTwoPeopleState();
    const {
        isGender,
        setIsGender,
        onPressGender,
        genderValue,
        setGenderValue,
        onToggleGender
    } = useGenderState();
    const {
        cameraRef,
        isPreview,
        setIsPreview,
        takePhoto,
        setTakePhoto,
        onPressTakePhoto
    } = useTakePhotoState();
    const {
        imageSelected,
        setImageSelected,
        onPressGetPhoto,
        albumPhoto,
        setAlbumPhoto
    } = useGetPhotoState();
    const { cameraType, switchCameraType } = useCameraTypeState();
    const {
        isNotice,
        setIsNotice,
        clickCancelNotice,
        clickNeverNotice
    } = useNoticeState();
    const {
        firstLightColor,
        firstLightText,
        secondLightColor,
        secondLightText,
        LightDefaultColor
    } = useLightState();
    const { isMode, setIsMode, onPressMode } = useModeState();

    useEffect(() => {
        (async () => {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            setHasPermission(status == 'granted');

            const {
                status: albumStatus
            } = await ImagePicker.requestCameraRollPermissionsAsync();
            setHasAlbumPermission(albumStatus === 'granted');

            const noticeStatus = await AsyncStorage.getItem('Notice');
            noticeStatus !== null
                ? setIsNotice(JSON.parse(noticeStatus))
                : false;
        })();
    }, []);

    console.log(
        `isTwoPeople: ${isTwoPeople}, twoPeopleToggle: ${twoPeopleToggleValue}, genderValue: ${genderValue}, isGender: ${isGender}, isMode: ${isMode}`
    );

    // 2인일 때, 2번째 사진으로 넘어가는 버튼
    const onPressNext = async () => {
        if (isPreview) {
            await cameraRef.current.resumePreview();
            setIsPreview(false);
        }

        if (imageSelected) {
            setImageSelected(false);
        }

        firstPhoto =
            (takePhoto && takePhoto.base64) ||
            (albumPhoto && albumPhoto.base64);

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

        setIsMode('eyes');

        setIsAfterView(false);
        firstPhoto = '';
        secondPhoto = '';
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
            }

            if (imageSelected) {
                setImageSelected(false);
            }

            if (!firstPhoto) {
                firstPhoto =
                    (takePhoto && takePhoto.base64) ||
                    (albumPhoto && albumPhoto.base64);
            } else {
                secondPhoto =
                    (takePhoto && takePhoto.base64) ||
                    (albumPhoto && albumPhoto.base64);
            }

            // Image Transformation Start
            setIsLoading(true);

            // 대기 인원 경고창 추가
            const waiting_num = await getServerState();
            if (waiting_num > 20) {
                Alert.alert(
                    `현재 ${waiting_num} 명 대기중입니다. 🕺💃`,
                    `예상 대기시간은 ${Math.round(
                        (waiting_num * 23) / 4 / 60
                    )} 분 입니다. ⏰`
                );
            }

            console.log(
                `현재 ${waiting_num} 명 대기중입니다. 🕺💃`,
                `예상 대기시간은 ${(waiting_num * 20) / 60} 분 입니다. ⏰}`
            );
            console.log(`getTransfer Check: ${isGender}`);

            resultPhotoList = await imageTransfer(
                firstPhoto,
                secondPhoto,
                isGender,
                isMode
            );

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
            const originalImg = resultPhotoList[0].split(
                'data:image/png;base64,'
            )[1];
            const originalFileName =
                FileSystem.documentDirectory + 'original.png';
            await FileSystem.writeAsStringAsync(originalFileName, originalImg, {
                encoding: FileSystem.EncodingType.Base64
            });

            // changed Image path 설정
            const changedImg = resultPhotoList[1].split(
                'data:image/png;base64,'
            )[1];
            const changedFileName =
                FileSystem.documentDirectory + 'changed.png';
            await FileSystem.writeAsStringAsync(changedFileName, changedImg, {
                encoding: FileSystem.EncodingType.Base64
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
            const changedImg = resultPhotoList[1].split(
                'data:image/png;base64,'
            )[1];
            const changedFileName =
                FileSystem.documentDirectory + 'changed.png';
            await FileSystem.writeAsStringAsync(changedFileName, changedImg, {
                encoding: FileSystem.EncodingType.Base64
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
                                      marginTop: height / 12
                                  }
                                : {
                                      alignItems: 'center',
                                      width: width,
                                      height: width / 0.75,
                                      marginTop: 0
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
                        {!isTwoPeople || isPreview ? (
                            <></>
                        ) : !firstPhoto ? (
                            <LightContainer>
                                <OrderLight
                                    backgroundColor={firstLightColor}
                                    text={firstLightText}
                                />
                                <OrderLight
                                    backgroundColor={LightDefaultColor}
                                    text={secondLightText}
                                />
                            </LightContainer>
                        ) : (
                            <LightContainer>
                                <OrderLight
                                    backgroundColor={LightDefaultColor}
                                    text={firstLightText}
                                />
                                <OrderLight
                                    backgroundColor={secondLightColor}
                                    text={secondLightText}
                                />
                            </LightContainer>
                        )}
                        {imageSelected && (
                            <Image
                                style={
                                    height >= 700
                                        ? {
                                              width: width,
                                              height: width / 0.75,
                                              marginTop: 50
                                          }
                                        : {
                                              width: width,
                                              height: width / 0.75,
                                              marginTop: 25
                                          }
                                }
                                source={{ uri: albumPhoto.uri }}
                            />
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
                                    value={twoPeopleToggleValue}
                                    onToggle={onToggleTwoPeople}
                                />
                            </ChangeButtonContainer>
                            <ChangeButtonContainer>
                                <ModeBtn onPress={onPressMode} Text={isMode} />
                            </ChangeButtonContainer>
                        </ChangeFunctionContainer>
                    </Camera>
                )}

                {imageSelected && (
                    <>
                        <Image
                            style={
                                height >= 700
                                    ? {
                                          width: width,
                                          height: width / 0.75,
                                          marginTop: 50
                                      }
                                    : {
                                          width: width,
                                          height: width / 0.75,
                                          marginTop: 25
                                      }
                            }
                            source={{ uri: albumPhoto.uri }}
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

                {isAfterView && (
                    <Image
                        style={
                            height >= 700
                                ? {
                                      width: width,
                                      height: width,
                                      marginTop: '20%'
                                  }
                                : {
                                      width: width,
                                      height: width,
                                      marginTop: 0
                                  }
                        }
                        source={{ uri: resultPhotoList[1] }}
                    />
                )}

                {!isPreview && !imageSelected && !isAfterView && (
                    <IconContainer>
                        <GetPhotoBtn onPress={onPressGetPhoto} />
                        <TakePhotoBtn onPress={onPressTakePhoto} />
                        <SwitchCameraBtn onPress={switchCameraType} />
                    </IconContainer>
                )}
                {isAfterView && (
                    <IconContainer>
                        <CancelBtn onPress={onPressCancel} />
                        <SaveBtn onPress={onPressSave} />
                        <ShareBtn onPress={onPressShare} />
                    </IconContainer>
                )}
                {(isPreview || imageSelected) && (
                    <IconContainer>
                        <CancelBtn onPress={onPressCancel} />

                        {!isTwoPeople || (isTwoPeople && firstPhoto) ? (
                            <TransferBtn onPress={getTransferImage} />
                        ) : (
                            <NextBtn onPress={onPressNext} />
                        )}
                    </IconContainer>
                )}
                {isNotice && (
                    <HowToPage>
                        <ImageBackground
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={{
                                width: width,
                                height: height / 3.5,
                                alignItems: 'center',
                                position: 'relative'
                            }}
                        >
                            <Image
                                source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/faceLineNotice.png')}
                                style={
                                    height >= 700
                                        ? {
                                              flex: 1,
                                              resizeMode: 'contain',
                                              width: width / 1.5,
                                              top: height / 15
                                          }
                                        : {
                                              flex: 1,
                                              resizeMode: 'contain',
                                              width: width / 1.5
                                          }
                                }
                            />
                            {/* <FaceLine style={{ position: 'absolute' }} /> */}
                        </ImageBackground>
                        <Image
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={{
                                width: width,
                                height: height / 14
                            }}
                        />
                        <ImageBackground
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={{
                                width: width,
                                height: height / 10,
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/tipNotice.png')}
                                style={{
                                    flex: 1,
                                    resizeMode: 'contain',
                                    width: width / 1.2
                                }}
                            />
                        </ImageBackground>
                        <Image
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={
                                height >= 700 && height < 800
                                    ? {
                                          width: width,
                                          height: height / 12
                                      }
                                    : {
                                          width: width,
                                          height: height / 50
                                      }
                            }
                        />

                        <ImageBackground
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={{
                                width: width,
                                height: height / 4.5,
                                alignItems: 'flex-end'
                            }}
                        >
                            <Image
                                source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/genderNotice2.png')}
                                style={{
                                    flex: 1,
                                    resizeMode: 'contain',
                                    width: width / 1.2
                                }}
                            />
                        </ImageBackground>
                        <Image
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={{
                                width: width,
                                height: height / 70
                            }}
                        />
                        <ImageBackground
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={{
                                width: width,
                                height: height / 6,
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/twoPeopleNotice3.png')}
                                style={
                                    height >= 700
                                        ? {
                                              flex: 1,
                                              resizeMode: 'contain',
                                              width: width / 1.6,
                                              bottom: height / 20
                                          }
                                        : {
                                              flex: 1,
                                              resizeMode: 'contain',
                                              width: width / 1.6
                                          }
                                }
                            />
                            {/* <NoticeCancelBtn onPress={clickCancelNotice} />
                            <NoticeNeverBtn onPress={clickNeverNotice} /> */}
                        </ImageBackground>
                        <ImageBackground
                            source={require('./Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
                            style={{
                                width: width,
                                height: height / 3,
                                alignItems: 'flex-start',
                                flexDirection: 'row-reverse'
                            }}
                        >
                            <NoticeCancelBtn onPress={clickCancelNotice} />
                            <NoticeNeverBtn onPress={clickNeverNotice} />
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
