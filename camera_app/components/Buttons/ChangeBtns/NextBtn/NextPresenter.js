import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const NextBtn = memo((props) => (
    <TouchableOpacity onPress={props.onPress} style={styles.NextBtn}>
        <Image source={require('./NextBtn.png')} style={styles.imgStyle} />
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    NextBtn: {
        width: width / 8,
        height: height / 13,
        top: '2%',
        right: '5%'
    },

    imgStyle: {
        width: width / 8,
        height: height / 13,
        resizeMode: 'contain'
    }
});
export default NextBtn;
