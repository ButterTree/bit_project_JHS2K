import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const Next = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Entypo name="arrow-bold-right" color="black" size={60} />
  </TouchableOpacity>
);

export default Next;
