import React, { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';

const View = styled.View`
    justifyContent: center
    alignItems: center
    background-color: black;
    width: 55px;
    height: 55px;
    borderRadius: 50;
`;

const ModeBtn = memo((props) => (
    <TouchableOpacity onPress={props.onPress}>
        <View>
            <Text
                style={{
                    color: 'white',
                    fontSize: 14
                }}
            >
                {props.Text}
            </Text>
        </View>
    </TouchableOpacity>
));

export default ModeBtn;
