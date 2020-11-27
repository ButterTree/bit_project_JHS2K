import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Save = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <FontAwesome name="save" color="black" size={40} />
  </TouchableOpacity>
);

export default Save;
