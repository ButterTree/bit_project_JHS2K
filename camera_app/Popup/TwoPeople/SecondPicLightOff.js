import React, { useState } from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';

const offSecondLight = () => {
  return (
    <View>
      <TouchableHighlight
        style={
          styles.openButton //, setTimeout(() => 'display:none', 2000))
        }
      >
        <Text style={styles.textStyle}>두번째사진</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#fafafa',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    opacity: 0.5,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'justify',
    opacity: 0.5,
  },
});

export default offSecondLight;
