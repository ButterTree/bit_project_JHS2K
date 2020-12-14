import React, { useState } from 'react';
import { Image, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Loading() {
  const [isReady, setIsReady] = useState(true);


  return isReady &&

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Image style={{
        height: height / 2,
        width: width / 1,
      }}
        source={require('../../assets/images/Loading.gif')}
      />
    </View>
}
