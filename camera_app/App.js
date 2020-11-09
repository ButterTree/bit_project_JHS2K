import React from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as FaceDetector from "expo-face-detector";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";

const { width, height } = Dimensions.get("window");

const ALBUM_NAME = "Camera APP";

console.log(width, height);

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

const IconBar = styled.View`
  margin-top: 50px;
`;

const IconContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.front,
      smileDetected: false
    };
    this.cameraRef = React.createRef();
  }

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status == "granted") {
      this.setState({ hasPermission: true });
    } else {
      this.setState({ hasPermission: false });
    }
  };

  render() {
    const { hasPermission, cameraType, smileDetected } = this.state;
    if (hasPermission === true) {
      return (
        <CenterView>
          <Camera
            style={{
              width: width - 50,
              height: height / 1.5
            }}
            type={cameraType}
            onFacesDetected={smileDetected ? null : this.onFaceDetected}
            faceDetectorSettings={{
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.all
            }}
            ref={this.cameraRef}
          />
          <IconContainer>
            <IconBar>
              <TouchableOpacity onPress={this.switchCameraType}>
                <MaterialIcons
                  name={
                    cameraType === Camera.Constants.Type.front
                      ? "camera-rear"
                      : "camera-front"
                  }
                  color="white"
                  size={50}
                />
              </TouchableOpacity>
            </IconBar>
            <IconBar>
              <TouchableOpacity onPress={this.takePhoto}>
                <SimpleLineIcons name="camera" color="white" size={50} />
              </TouchableOpacity>
            </IconBar>
          </IconContainer>
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
        cameraType: Camera.Constants.Type.back
      });
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front
      });
    }
  };

  onFaceDetected = ({ faces }) => {
    const face = faces[0];
    if (face) {
      console.log(`Smiling_Probability: ${face.smilingProbability}`);
      console.log(face.leftEyeOpenProbability);
      console.log(face.rightEyeOpenProbability);
      if (face.smilingProbability >= 0.9) {
        this.setState({
          smileDetected: true
        });
        this.takePhoto();
        console.log("You Smiling");
      } else {
      }
    }
  };

  takePhoto = async () => {
    try {
      if (this.cameraRef.current) {
        let photo = await this.cameraRef.current.takePictureAsync({
          quality: 1
        });
        console.log(photo);
        if (photo.uri) {
          this.savePhoto(photo.uri);
        }
      }
    } catch (error) {
      alert(`error: ${error}`);
      this.setState({
        smileDetected: false
      });
    }
  };

  savePhoto = async (uri) => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
        if (album === null) {
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
        }
        setTimeout(
          () =>
            this.setState({
              smileDetected: false
            }),
          2000
        );
        console.log(asset);
        console.log(album);
      } else {
        this.setState({ hasPermission: false });
      }
    } catch (error) {}
  };
}
