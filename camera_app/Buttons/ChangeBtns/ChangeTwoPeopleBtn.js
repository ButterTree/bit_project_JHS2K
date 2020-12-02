/** @format */

import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import ToggleButton from 'react-native-toggle-element';
import { Image } from 'react-native';
import { View } from 'native-base';

const ChangeTwoPeople = ({ onPress }) => {
    const [toggleValue, setToggleValue] = useState(false);

    return (
        <ToggleButton
            onPress={onPress}
            value={toggleValue}
            onToggle={(newState) => setToggleValue(newState)}
            thumbActiveComponent={
                // <MaterialIcons name="people-outline" color="white" size={35} />
                <Image
                    source={require('./PeopleNumber/two_people.png')}
                    style={{
                        width: '100%',
                        height: '100%',
                        // marginTop: -10,
                        resizeMode: 'contain',
                    }}
                />
            }
            thumbInActiveComponent={
                // <MaterialIcons name="person-outline" color="white" size={35} />
                <Image
                    source={require('./PeopleNumber/one_person.png')}
                    style={{
                        width: '100%',
                        height: '100%',
                        // marginTop: -10,
                        resizeMode: 'contain',
                    }}
                />
            }
            thumbButton={{
                width: 100,
                height: 100,
                radius: 0,
            }}
            trackBar={{
                activeBackgroundColor: 'transparent',
                inActiveBackgroundColor: 'transparent',
                borderActiveColor: 'white',
                borderInActiveColor: 'white',
                width: 100,
                height: 100,
            }}
            trackBarStyle={{
                opacity: 0.9,
            }}
        ></ToggleButton>
    );
};
export default ChangeTwoPeople;
