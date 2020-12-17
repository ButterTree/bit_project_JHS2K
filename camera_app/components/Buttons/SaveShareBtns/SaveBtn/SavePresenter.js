import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const SaveBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.SaveBtn}>
    <Image source={require('./SaveBtn.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  SaveBtn: {
    width: width / 4,
    height: height / 7,
  },

  imgStyle: {
    width: width / 4,
    height: height / 7,
    resizeMode: 'contain',
  },
});

export default SaveBtn;
