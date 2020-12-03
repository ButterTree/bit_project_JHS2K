import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// const TipContainer = styled.View`
//     flex-direction: row;
//     justify-content: space-around;
//     align-items: center;
//     margin-top: -10%;
//     margin-bottom: 3%;
// `;

const { width, height } = Dimensions.get('window');

const OnceSkipHowToPage = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.OncecloseHowToPageBtn}>
        <Image source={require('./OnceSkip.png')} style={styles.imgStyle} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    OncecloseHowToPageBtn: {
        width: width / 7,
        height: height / 17,
        top: '88%',
        left: '73%',
        borderColor: '#6e6e6e',
        borderWidth: 5,
        position: 'absolute',
        backgroundColor: '#292826',
    },

    imgStyle: {
        width: width / 12,
        height: height / 10,
        resizeMode: 'contain',
        bottom: '61%',
        left: '14%',
    },
});

export default OnceSkipHowToPage;
