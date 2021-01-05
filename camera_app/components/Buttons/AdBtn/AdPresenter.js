import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const AdBtn = memo((props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.container}>
    <Image source={require('./goodocAd9.png')} style={styles.cover} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: width / 3.9,
    position: 'absolute',
    marginTop: width * 0.11,
  },
  cover: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default AdBtn;
