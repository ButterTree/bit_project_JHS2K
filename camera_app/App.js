import React from 'react';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  AntDesign,
  Entypo,
  FontAwesome,
} from '@expo/vector-icons';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import styled from 'styled-components';
import Loading from './Loading';

const API_KEY = '';

const { width, height } = Dimensions.get('window');

const ALBUM_NAME = 'Camera APP';

const CenterView = styled.View`
  background-color: black;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.front,
      image: null,
      isPreview: false,
      isLoading: true,
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
    console.log(picStatus);
    if (picStatus == 'granted') {
      this.setState({ image: true });
    } else {
      this.setState({ imgae: false });
    }
  };

  getPhotos = async () => {
    try {
      const { edges } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        base64: true,
        saveToPhoto: false,
      });
      console.log('pic', edges);
    } catch (error) {
      console.log('getPhoto', error);
    }
  };

  render() {
    const { hasPermission, cameraType, isPreview, isLoading } = this.state;
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
          {!isPreview && (
            <IconContainer>
              <IconBar>
                <TouchableOpacity onPress={this.getPhotos}>
                  <AntDesign name="picture" color="white" size={30} />
                </TouchableOpacity>
              </IconBar>
              <IconBar>
                <TouchableOpacity onPress={this.takePhoto}>
                  <MaterialCommunityIcons
                    name="circle-slice-8"
                    color="white"
                    size={100}
                  />
                </TouchableOpacity>
              </IconBar>
              <IconBar>
                <TouchableOpacity onPress={this.switchCameraType}>
                  <Ionicons
                    name={
                      cameraType === Camera.Constants.Type.front
                        ? 'ios-reverse-camera'
                        : 'ios-reverse-camera'
                    }
                    color="white"
                    size={40}
                  />
                </TouchableOpacity>
              </IconBar>
            </IconContainer>
          )}
          <IconContainer_after>
            <IconBar_after>
              <TouchableOpacity onPress={this.submitBtn}>
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
          <Text>Don't have Permission for this</Text>
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
        const options = { quality: 0.5, base64: true };
        let photo = await this.cameraRef.current.takePictureAsync(options);
        const source = photo.uri;
        if (source) {
          await this.cameraRef.current.pausePreview();
          this.setState({ isPreview: true });
        }
        console.log(photo);
        if (photo.uri) {
          this.savePhoto(photo.uri);
        }
      }
    } catch (error) {
      alert(`error: ${error}`);
    }
  };

  cancelPreviewBtn = async () => {
    await this.cameraRef.current.resumePreview();
    this.setState({ isPreview: false });
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
        setTimeout(() => null, 2000);
        console.log(asset);
        console.log(album);
      } else {
        this.setState({ hasPermission: false });
      }
    } catch (error) {}
  };
}

submitBtn = async (uri) => {
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
    }
  } catch (error) {}
};
