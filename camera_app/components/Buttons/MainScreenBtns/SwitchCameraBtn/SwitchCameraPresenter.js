import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const SwitchCameraBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.SwitchBtn}>
    <Image source={require('./SwitchBtn2.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  SwitchBtn: {
    width: width / 10,
    height: height / 14,
    top: '3%',
    right: '10%',
  },

  imgStyle: {
    width: width / 10,
    height: height / 14,
    resizeMode: 'contain',
  },
});

export default SwitchCameraBtn;
