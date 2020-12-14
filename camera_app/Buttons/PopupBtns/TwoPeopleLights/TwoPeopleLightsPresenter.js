import React, { memo } from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';

const OrderLight = memo((props) => (
    <View>
        <TouchableHighlight
            style={{
                ...styles.openButton,
                backgroundColor: props.backgroundColor
            }}
        >
            <Text style={styles.textStyle}>{props.text}</Text>
        </TouchableHighlight>
    </View>
));

const styles = StyleSheet.create({
    openButton: {
        borderRadius: 10,
        padding: 10
    },
    textStyle: {
        color: '#4d4d4d',
        fontWeight: 'bold',
        textAlign: 'justify'
    }
});

export default OrderLight;
