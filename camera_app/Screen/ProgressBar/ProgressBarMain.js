import React from 'react';
import { StyleSheet, View } from 'react-native';
import Loading from './Loading';
import Texts from './Texts';
import InfinitCircle from './InfinitCircle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default Progress = () => {
  return (
    <>
      <View style={styles.container}>
        <Loading />
        <Texts />
        <InfinitCircle />
      </View>
    </>
  );
};
