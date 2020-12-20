import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const TransferBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.SendBtn}>
    <Image source={require('./SendBtn.png')} style={styles.imgStyle} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  SendBtn: {
    width: width / 8,
    height: height / 13,
    top: '2%',
    right: '5%',
  },

  imgStyle: {
    width: width / 8,
    height: height / 13,
    resizeMode: 'contain',
  },
});

export default TransferBtn;
