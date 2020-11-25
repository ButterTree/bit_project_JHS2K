import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import MultiToggleSwitch from 'react-native-multi-toggle-switch';
import ToggleButton from 'react-native-toggle-element';
import ChangeMale from './ChangeMale';

const ChangeFemale = ({ onPress }) => {
  const [toggleValue, setToggleValue] = useState(false);
  return (
    <ToggleButton
      onPress={onPress}
      value={toggleValue}
      onToggle={(newState) => setToggleValue(newState)}
      thumbActiveComponent={
        <SimpleLineIcons name="symbol-male" color="cyan" size={25} />
      }
      thumbInActiveComponent={
        <SimpleLineIcons name="symbol-female" color="red" size={25} />
      }
      trackBar={{
        activeBackgroundColor: '#9ee3fb',
        inActiveBackgroundColor: '#3c4145',
        borderActiveColor: '#86c3d7',
        borderInActiveColor: '#1c1c1c',
        borderWidth: 5,
        width: 100,
      }}
    />
  );
};
export default ChangeFemale;
