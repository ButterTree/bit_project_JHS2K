import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';

const onFirstLight = () => {
  return (
    <View>
      <TouchableHighlight
        style={
          styles.openButton //, setTimeout(() => 'display:none', 2000))
        }
      >
        <Text style={styles.textStyle}>첫번째사진</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#ffb8b8',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'justify',
  },
});

export default onFirstLight;
