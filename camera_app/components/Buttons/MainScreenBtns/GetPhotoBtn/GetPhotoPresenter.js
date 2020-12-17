import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const getPhotoBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.GalleryBtn}>
    <Image source={require('./GalleryBtn2.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  GalleryBtn: {
    width: width / 10,
    height: height / 14,
    top: '3%',
    left: '10%',
  },

  imgStyle: {
    width: width / 10,
    height: height / 14,
    resizeMode: 'contain',
  },
});

export default getPhotoBtn;
