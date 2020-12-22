import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';

const NoticeBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={{ alignItems: 'center' }}>
    <Image source={require('./qMark.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  imgStyle: {
    width: 45,
    height: 45,
  },
});

export default NoticeBtn;
