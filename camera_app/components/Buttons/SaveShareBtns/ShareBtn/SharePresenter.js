import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const ShareBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.ShareBtn}>
    <Image source={require('./ShareBtn.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  ShareBtn: {
    width: width / 10,
    height: height / 14,
    top: '2%',
    right: '5%',
  },

  imgStyle: {
    width: width / 10,
    height: height / 14,
    resizeMode: 'contain',
  },
});

export default ShareBtn;
