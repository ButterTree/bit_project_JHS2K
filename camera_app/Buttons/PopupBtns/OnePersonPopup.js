import React, { useState } from 'react';
import {
    Text,
    View,
    Modal,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    Alert,
    Image
} from 'react-native';
import styled from 'styled-components';

const TipContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: -10%;
    margin-bottom: 3%;
`;

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const onePopup = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View
            style={
                deviceHeight >= 700
                    ? {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: deviceHeight / 1.3,
                        left: deviceWidth / 25,
                        position: 'absolute'
                    }
                    : {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: deviceHeight / 1.05,
                        left: deviceWidth / 25,
                        position: 'absolute'
                    }
            }
        >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            {`1. <1인모드>에서는 여성, 남성 각각\n    6개의 다른 스타일 쌍꺼풀이 랜덤하게\n    선택되어 나옵니다.\n\n2. <2인모드>에서는 '첫번째 사진' 눈에\n    '두번째 사진' 눈의 쌍꺼풀이 적용되어\n    나옵니다.\n\n3. 고화질 사진이 더 좋은 결과를\n    보여줍니다.\n\n4. 아래 버튼으로 성별을 바꿀 수 있어요.`}
                        </Text>
                        <TipContainer>
                            <Image
                                source={require('../../images/genderImages/woman.png')}
                                style={{
                                    width: 40,
                                    height: 40
                                }}
                            />
                            <Image
                                source={require('../../images/genderImages/man.png')}
                                style={{
                                    width: 40,
                                    height: 40
                                }}
                            />

                        </TipContainer>
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: '#fff9a3'
                            }}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>닫기</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <Text style={styles.textStyle}>Tip!</Text>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    LeftView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: deviceHeight / 1.1,
        left: deviceWidth / 25,
        position: 'absolute'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: 'transparent',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: '#fff9a3',
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    closeButton: {},
    textStyle: {
        color: '#4d4d4d',
        fontWeight: 'bold',
        textAlign: 'justify'
    },
    modalText: {
        marginBottom: 35,
        textAlign: 'left',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 25,
        padding: 10

    }
});

export default onePopup;
