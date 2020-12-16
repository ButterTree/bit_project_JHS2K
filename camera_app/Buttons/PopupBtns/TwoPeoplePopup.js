import React, { useState } from 'react';
import {
    Text,
    View,
    Modal,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    Alert
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const twoPopup = () => {
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
                            {`1. 첫번째는 변화를 원하는 사진을 선택하세요.\n2. 두번째는 합성할 사진을 선택하세요.\n`}
                        </Text>

                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: '#4d4d4d'
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
        // top: deviceHeight / 2.39,
        height: deviceHeight,
        left: deviceWidth / 25,
        position: 'absolute'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
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
        backgroundColor: '#4d4d4d',
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: '#FADBDB',
        fontWeight: 'bold',
        textAlign: 'justify'
    },
    modalText: {
        marginBottom: 35,
        textAlign: 'left',
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 25,
        padding: 5
    }
});

export default twoPopup;
