import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const CancelBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.CancelBtn}>
    <Image source={require('./CancelBtn.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  CancelBtn: {
    width: width / 10,
    height: height / 14,
    top: '2%',
    left: '5%',
  },

  imgStyle: {
    width: width / 10,
    height: height / 14,
    resizeMode: 'contain',
  },
});

export default CancelBtn;
