import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const SwitchCamera = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <MaterialCommunityIcons
      name="camera-retake-outline"
      color="black"
      size={40}
    />
  </TouchableOpacity>
);

export default SwitchCamera;
