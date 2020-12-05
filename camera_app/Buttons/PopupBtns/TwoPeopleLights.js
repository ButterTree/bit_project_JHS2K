import React, { memo } from "react";
import { Text, View, TouchableHighlight, StyleSheet } from "react-native";

export const OnFirstLight = memo(() => (
  <View>
    <TouchableHighlight
      style={{ ...styles.openButton, backgroundColor: "#ffb8b8" }}>
      <Text style={styles.textStyle}>첫번째사진</Text>
    </TouchableHighlight>
  </View>
));

export const OnSecondLight = memo(() => (
  <View>
    <TouchableHighlight
      style={{ ...styles.openButton, backgroundColor: "#d0f5f7" }}>
      <Text style={styles.textStyle}>두번째사진</Text>
    </TouchableHighlight>
  </View>
));

export const OffFirstLight = memo(() => (
  <View>
    <TouchableHighlight
      style={{ ...styles.openButton, backgroundColor: "tranparent" }}>
      <Text style={styles.textStyle}>첫번째사진</Text>
    </TouchableHighlight>
  </View>
));

export const OffSecondLight = memo(() => (
  <View>
    <TouchableHighlight
      style={{ ...styles.openButton, backgroundColor: "tranparent" }}>
      <Text style={styles.textStyle}>두번째사진</Text>
    </TouchableHighlight>
  </View>
));

const styles = StyleSheet.create({
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "justify"
  }
});
