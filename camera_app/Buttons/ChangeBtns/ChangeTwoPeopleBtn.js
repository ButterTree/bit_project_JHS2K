/** @format */

import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import ToggleButton from 'react-native-toggle-element';

const ChangeTwoPeople = ({ onPress }) => {
  const [toggleValue, setToggleValue] = useState(false);

  return (
    <ToggleButton
      onPress={onPress}
      value={toggleValue}
      onToggle={(newState) => setToggleValue(newState)}
      thumbActiveComponent={
        <MaterialIcons name="people-outline" color="white" size={35} />
      }
      thumbInActiveComponent={
        <MaterialIcons name="person-outline" color="white" size={35} />
      }
      thumbButton={{
        width: 40,
        height: 40,
        radius: 20,
      }}
      trackBar={{
        activeBackgroundColor: 'transparent',
        inActiveBackgroundColor: 'transparent',
        borderActiveColor: 'transparent',
        borderInActiveColor: 'transparent',
        width: 50,
        height: 30,
      }}
      trackBarStyle={{
        opacity: 0.9,
      }}
    />
  );
};
export default ChangeTwoPeople;
