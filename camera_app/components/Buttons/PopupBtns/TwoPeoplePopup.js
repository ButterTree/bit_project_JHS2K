import React, { useState } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, Dimensions, Alert } from 'react-native';

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
              position: 'absolute',
            }
          : {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: deviceHeight / 1.05,
              left: deviceWidth / 25,
              position: 'absolute',
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
            <Text style={styles.modalText}>{`※ 2인 모드 ※`}</Text>
            <Text
              style={styles.modalText}
            >{`'첫번째 사진' 눈에 '두번째 사진' 눈의\n쌍꺼풀이 적용되어 나옵니다.\n\n고화질 사진이 더 좋은 결과를\n보여줍니다.`}</Text>

            <TouchableHighlight
              style={{
                ...styles.openButton,
                backgroundColor: '#4d4d4d',
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
    marginTop: 22,
  },
  LeftView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // top: deviceHeight / 2.39,
    height: deviceHeight,
    left: deviceWidth / 25,
    position: 'absolute',
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#4d4d4d',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: '#FADBDB',
    fontWeight: 'bold',
    textAlign: 'justify',
  },
  modalText: {
    marginBottom: 35,
    textAlign: 'left',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 25,
  },
});

export default twoPopup;
