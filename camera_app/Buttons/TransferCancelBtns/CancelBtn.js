import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const Cancel = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Entypo name="circle-with-cross" color="black" size={60} />
  </TouchableOpacity>
);

export default Cancel;
