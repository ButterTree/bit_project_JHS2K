import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const NoticeCancelBtn = memo((props) => (
    <TouchableOpacity
        onPress={props.onPress}
        style={styles.OnceCloseHowToPageBtn}
    >
        <Image source={require('./OnceSkip.png')} style={styles.imgStyle} />
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    OnceCloseHowToPageBtn: {
        width: width / 7.8,
        height: height / 20,
        top: '92%',
        left: '78%',
        position: 'absolute',
    },

    imgStyle: {
        width: width / 9,
        height: height / 10,
        resizeMode: 'contain',
        bottom: '46%',
        left: '7%',
    },
});

export default NoticeCancelBtn;
