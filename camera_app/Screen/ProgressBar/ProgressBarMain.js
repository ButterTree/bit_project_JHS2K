/** @format */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Loading from './Loading';
import Texts from './Texts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fadbdb',
        justifyContent: 'center',
        alignContent: 'center'
    }
});

export default ProgressBarMain = () => {
    return (
        <>
            <View style={styles.container}>
                <Loading />
                <View style={{ marginBottom: "30%" }}>
                    <Texts />
                </View>
            </View>
        </>
    );
};
