import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const NoticeNeverBtn = memo((props) => (
    <TouchableOpacity
        onPress={props.onPress}
        style={styles.ForeverCloseHowToPageBtn}
    >
        <Image source={require('./ForeverSkip.png')} style={styles.imgStyle} />
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    ForeverCloseHowToPageBtn: {
        width: width / 3,
        height: height / 20,
        top: '92%',
        left: '40%',
        position: 'absolute',
    },
    imgStyle: {
        width: width / 3.2,
        height: height / 10,
        resizeMode: 'contain',
        bottom: '46%',
        left: '4%',
    },
});

export default NoticeNeverBtn;
