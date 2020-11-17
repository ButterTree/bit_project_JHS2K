import React from 'react';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
} from '@expo/vector-icons';
import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import styled from 'styled-components';
import Loading from './Loading';
import { imageTransfer } from './api';

let currentPhoto = ''; // 찍은 사진 저장용
let photos = []; // 모델 계산후 얻은 [원본, 결과] 사진 리스트 저장용

const { width, height } = Dimensions.get('window');

const ALBUM_NAME = 'Camera APP';

const CenterView = styled.View`
  background-color: white;
`;

const IconBar = styled.View`
  margin-top: 30px;
`;

const IconContainer = styled.View`
  width: 100%;
  flex-direction: row;
  padding-bottom: 120px;
  justify-content: space-around;
  align-items: center;
`;

const IconBar_after = styled.View`
  margin-top: 30px;
`;

const IconContainer_after = styled.View`
  width: 100%;
  height: 22%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: white;
`;

const LoadingBar = styled.View`
  width: 100%;
  height: 100%;
  background-colr: white;
  justyfy-content: 'conter';
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.front,
      image: null,
      isPreview: false,
      isLoading: true,
      isAfterview: false,
      imageSelected: false,
      imageComeback: false,
    };
    this.cameraRef = React.createRef();
  }

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status == 'granted') {
      this.setState({ hasPermission: true });
    } else {
      this.setState({ hasPermission: false });
    }

    const {
      status: picStatus,
    } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (picStatus == 'granted') {
      this.setState({ image: true });
    } else {
      this.setState({ imgae: false });
    }
  };

  getPhotos = async () => {
    const { uri } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (!uri) {
      this.setState({ hasPermission: true });
    } else {
      this.setState({
        image: uri,
        imageSelected: true,
        imageComeback: true,
      });
    }
  };

  render() {
    const {
      hasPermission,
      cameraType,
      isPreview,
      image,
      imageSelected,
      imageComeback,
      isAfterview,
      isLoading,
    } = this.state;
    if (hasPermission === true) {
      return (
        <CenterView>
          <Camera
            style={{
              width: width - 1,
              height: height / 1.4,
              marginTop: 50,
            }}
            type={cameraType}
            ref={this.cameraRef}
          />

          {imageSelected && imageComeback && (
            <Image
              style={{
                width: width - 1,
                height: height / 1.4,
                marginTop: 50,
                position: 'absolute',
              }}
              source={{ uri: image }}
            />
          )}
          {isAfterview && (
            <Image
              style={{
                width: width - 1,
                height: height / 1.4,
                marginTop: 50,
                position: 'absolute',
              }}
              source={{ uri: photos[1] }}
            />
          )}
          {!isPreview && !imageComeback && !isAfterview && !imageSelected && (
            <IconContainer>
              <IconBar>
                <TouchableOpacity onPress={this.getPhotos}>
                  <FontAwesome name="picture-o" color="black" size={30} />
                </TouchableOpacity>
              </IconBar>
              <IconBar>
                <TouchableOpacity onPress={this.takePhoto}>
                  <MaterialCommunityIcons
                    name="circle-slice-8"
                    color="black"
                    size={100}
                  />
                </TouchableOpacity>
              </IconBar>
              <IconBar>
                <TouchableOpacity onPress={this.switchCameraType}>
                  <MaterialCommunityIcons
                    name={'camera-retake-outline'}
                    color="black"
                    size={40}
                  />
                </TouchableOpacity>
              </IconBar>
            </IconContainer>
          )}
          {isAfterview && !isPreview && (
            <IconContainer_after>
              <IconBar_after>
                <TouchableOpacity onPress={this.saveResultPhoto}>
                  <FontAwesome name="save" color="black" size={40} />
                </TouchableOpacity>
              </IconBar_after>

              <IconBar_after>
                <TouchableOpacity onPress={this.cancelPreviewBtn}>
                  <Entypo name="circle-with-cross" color="black" size={40} />
                </TouchableOpacity>
              </IconBar_after>
            </IconContainer_after>
          )}
          <IconContainer_after>
            <IconBar_after>
              <TouchableOpacity onPress={this.getTransferImage}>
                <FontAwesome name="check-circle" color="black" size={40} />
              </TouchableOpacity>
            </IconBar_after>
            <IconBar_after>
              <TouchableOpacity onPress={this.cancelPreviewBtn}>
                <Entypo name="circle-with-cross" color="black" size={40} />
              </TouchableOpacity>
            </IconBar_after>
          </IconContainer_after>
        </CenterView>
      );
    } else if (hasPermission === false) {
      return (
        <CenterView>
          <Text>You have to allow Camera Permission</Text>
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

  switchCameraType = () => {
    const { cameraType } = this.state;
    if (cameraType === Camera.Constants.Type.front) {
      this.setState({
        cameraType: Camera.Constants.Type.back,
      });
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front,
      });
    }
  };

  takePhoto = async () => {
    try {
      if (this.cameraRef.current) {
        const options = { quality: 1, base64: true };
        let photo = await this.cameraRef.current.takePictureAsync(options);
        const source = photo.uri;
        console.log(source);
        if (source) {
          await this.cameraRef.current.pausePreview();
          this.setState({ isPreview: true });
        }
        const base64Photo = photo.base64;
        currentPhoto = base64Photo; // 여기서 나오는 return 값은 [원본사진, 합성후 사진]
      }
      // if (photo.uri) {
      //   this.savePhoto(photo.uri);
      // }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  cancelPreviewBtn = async () => {
    await this.cameraRef.current.resumePreview();
    this.setState({
      isPreview: false,
      imageSelected: false,
      imageComeback: false,
      isAfterview: false,
    });
  };

  savePhoto = async (uri) => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
        if (album === null) {
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
        }
      } else {
        this.setState({ hasPermission: false });
      }
    } catch (error) {
      console.log(`savePhotoError: ${error}`);
    }
  };

  getTransferImage = async () => {
    try {
      photos = await imageTransfer(currentPhoto);

      await this.cameraRef.current.resumePreview();
      this.setState({
        isPreview: false,
        isAfterview: true,
        imageSelected: false,
        imageComeback: false,
        isSaved: true,
      });
    } catch (error) {
      console.log(`getTransferImage Error: ${error}`);
    }
  };

  saveResultPhoto = async () => {
    try {
      const base64Code = photos[1].split('data:image/png;base64,')[1];

      const filename = FileSystem.documentDirectory + 'changed.png';
      await FileSystem.writeAsStringAsync(filename, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(filename);
      this.setState({
        isSaved: true,
        isAfterview: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
