import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Transfer = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <FontAwesome name="check-circle" color="black" size={60} />
  </TouchableOpacity>
);

export default Transfer;
