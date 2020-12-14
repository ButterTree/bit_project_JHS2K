import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const NoticeCancelBtn = memo((props) => (
    <TouchableOpacity
        onPress={props.onPress}
        style={
            height >= 700
                ? {
                      width: width / 7.8,
                      height: height / 20,
                      bottom: '9%',
                      left: '13%'
                  }
                : {
                      width: width / 7.8,
                      height: height / 20,
                      left: '13%'
                  }
        }
    >
        <Image source={require('./OnceSkip.png')} style={styles.imgStyle} />
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    OnceCloseHowToPageBtn: {
        width: width / 7.8,
        height: height / 20,
        top: '92%',
        left: '13%'
        // position: 'absolute',
    },

    imgStyle: {
        width: width / 9,
        height: height / 10,
        resizeMode: 'contain'
        // bottom: '46%',
        // left: '7%',
    }
});

export default NoticeCancelBtn;
