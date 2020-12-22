import React, { memo } from 'react';
import { Image } from 'react-native';
import ToggleButton from 'react-native-toggle-element';

const GenderBtn = memo((props) => (
  <ToggleButton
    onPress={props.onPress}
    value={props.value}
    onToggle={props.onToggle}
    thumbActiveComponent={
      <Image
        source={require('./man.png')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />
    }
    thumbInActiveComponent={
      <Image
        source={require('./woman.png')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />
    }
    thumbButton={{
      width: 40,
      height: 40,
      radius: 0,
    }}
    trackBar={{
      activeBackgroundColor: 'transparent',
      inActiveBackgroundColor: 'transparent',
      borderActiveColor: 'white',
      borderInActiveColor: 'white',
      width: 40,
      height: 40,
    }}
    trackBarStyle={{
      opacity: 0.9,
    }}
  />
));

export default GenderBtn;
