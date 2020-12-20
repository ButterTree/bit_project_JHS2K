import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const TakePhotoBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.ShotBtn}>
    <Image source={require('./ShotBtn.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  ShotBtn: {
    width: width / 4,
    height: height / 7,
  },

  imgStyle: {
    width: width / 4,
    height: height / 7,
    resizeMode: 'contain',
  },
});

export default TakePhotoBtn;
