import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MultiToggleSwitch from 'react-native-multi-toggle-switch';

const ChangeMale = ({ onPress }) => (
  <MultiToggleSwitch>
    <MultiToggleSwitch.Item primaryColor={'gray'}>
      <MaterialIcons name="person-outline" size={25} />
    </MultiToggleSwitch.Item>
    <MultiToggleSwitch.Item onPress={onPress}>
      <MaterialIcons name="people-outline" color="lightgray" size={25} />
    </MultiToggleSwitch.Item>
  </MultiToggleSwitch>
);

export default ChangeMale;
