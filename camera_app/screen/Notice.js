import React, { memo } from 'react';
import { Image, ImageBackground, Dimensions } from 'react-native';
import NoticeCancelBtn from '../components/Buttons/MainScreenBtns/NoticeBtns/NoticeCancelPresenter';

const { width, height } = Dimensions.get('window');

const Notice = memo((props) => (
  <>
    <ImageBackground
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={{
        width: width,
        height: height / 3.5,
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Image
        source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/faceLineNotice.png')}
        style={
          height >= 700
            ? {
                flex: 1,
                resizeMode: 'contain',
                width: width / 1.5,
                top: height / 15,
              }
            : {
                flex: 1,
                resizeMode: 'contain',
                width: width / 1.5,
              }
        }
      />
    </ImageBackground>
    <Image
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={{
        width: width,
        height: height / 14,
      }}
    />
    <ImageBackground
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={{
        width: width,
        height: height / 10,
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/tipNotice.png')}
        style={{
          flex: 1,
          resizeMode: 'contain',
          width: width / 1.2,
        }}
      />
    </ImageBackground>
    <Image
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={
        height >= 700 && height < 800
          ? {
              width: width,
              height: height / 12,
            }
          : {
              width: width,
              height: height / 50,
            }
      }
    />

    <ImageBackground
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={{
        width: width,
        height: height / 4.5,
        alignItems: 'flex-end',
      }}
    >
      <Image
        source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/genderNotice2.png')}
        style={{
          flex: 1,
          resizeMode: 'contain',
          width: width / 1.2,
        }}
      />
    </ImageBackground>
    <Image
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={{
        width: width,
        height: height / 70,
      }}
    />
    <ImageBackground
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={{
        width: width,
        height: height / 6,
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/twoPeopleNotice3.png')}
        style={
          height >= 700
            ? {
                flex: 1,
                resizeMode: 'contain',
                width: width / 1.6,
                bottom: height / 20,
              }
            : {
                flex: 1,
                resizeMode: 'contain',
                width: width / 1.6,
              }
        }
      />
    </ImageBackground>
    <ImageBackground
      source={require('../components/Buttons/MainScreenBtns/NoticeBtns/Image/icon_invisible.png')}
      style={{
        width: width,
        height: height / 3,
        alignItems: 'flex-start',
        flexDirection: 'row-reverse',
      }}
    ></ImageBackground>
    <NoticeCancelBtn onPress={props.onPress} />
  </>
));

export default Notice;
