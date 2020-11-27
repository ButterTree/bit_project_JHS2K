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
                        width: 80,
                        height: 80,
                        marginTop: -10,
                        resizeMode: 'contain',
                    }}
                />
            }
            thumbInActiveComponent={
                // <MaterialIcons name="person-outline" color="white" size={35} />
                <Image
                    source={require('./PeopleNumber/one_person.png')}
                    style={{
                        width: 80,
                        height: 80,
                        marginTop: -10,
                        resizeMode: 'contain',
                    }}
                />
            }
            thumbButton={{
                width: 90,
                height: 60,
                radius: 200,
            }}
            trackBar={{
                activeBackgroundColor: 'transparent',
                inActiveBackgroundColor: 'transparent',
                borderActiveColor: 'white',
                borderInActiveColor: 'white',
                width: 90,
                height: 30,
            }}
            trackBarStyle={{
                opacity: 0.9,
            }}
        ></ToggleButton>
    );
};
export default ChangeTwoPeople;
