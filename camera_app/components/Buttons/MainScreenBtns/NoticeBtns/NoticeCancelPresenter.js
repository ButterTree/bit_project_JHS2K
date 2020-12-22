import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';

const NoticeCancelBtn = memo((props) => (
  <TouchableOpacity
    onPress={props.onPress}
    style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}
  >
    <Image source={require('./closeBtnImage.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  imgStyle: {
    width: 40,
    resizeMode: 'contain',
  },
});

export default NoticeCancelBtn;
