import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ForeverSkipHowToPage = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.ForevercloseHowToPageBtn}>
        <Image source={require('./ForeverSkip.png')} style={styles.imgStyle} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    ForevercloseHowToPageBtn: {
        width: width / 2.1,
        height: height / 17,
        top: '88%',
        left: '19%',
        borderColor: '#6e6e6e',
        borderWidth: 5,
        position: 'absolute',
        resizeMode: 'contain',
        backgroundColor: '#292826',
    },
    imgStyle: {
        width: width / 2.7,
        height: height / 10,
        resizeMode: 'contain',
        bottom: '61%',
        left: '8%',
    },
});

export default ForeverSkipHowToPage;
