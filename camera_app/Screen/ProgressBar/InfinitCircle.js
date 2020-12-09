import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';

const { height } = Dimensions.get('window');

const InfinitCircle = () => {
  return (
    <View style={styles.circles}>
      <Progress.CircleSnail color={['#ac75ff', '#2196F3', '#009688']} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height / 10,
  },
});

export default InfinitCircle;
