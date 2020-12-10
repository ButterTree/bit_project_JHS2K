/** @format */

import React, { Component } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import InfinitCircle from './InfinitCircle';
import Texts from './Texts';

const { width, height } = Dimensions.get('window');

export default class MyComponent extends Component {
    state = {
        SlideInLeft: new Animated.Value(0),
        slideInRight: new Animated.Value(0),
        animation: new Animated.Value(1),
    };

    componentDidMount() {
        this.runAnimation();
    }

    runAnimation() {
        Animated.loop(
            Animated.parallel([
                Animated.timing(this.state.SlideInLeft, {
                    toValue: 1,
                    duration: 3500,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.slideInRight, {
                    toValue: 1,
                    duration: 3500,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.animation, {
                    toValue: 0.1,
                    duration: 3500,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }

    render() {
        let { slideInRight, SlideInLeft, animation } = this.state;

        return (
            <>
                <View style={styles.container}>
                    <Animated.Image
                        style={{
                            transform: [
                                {
                                    translateX: SlideInLeft.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-95, 0],
                                    }),
                                },
                            ],
                            opacity: animation,
                            flex: 1,
                            height: height / 4,
                            width: width / 2.5,
                            borderRadius: 12,
                            borderWidth: 5,
                            borderColor: '#FADBDB',
                            justifyContent: 'center',
                            position: 'absolute',
                        }}
                        source={{ uri: this.props.firstPhoto }}
                    ></Animated.Image>
                    <Animated.Image
                        style={{
                            transform: [
                                {
                                    translateX: slideInRight.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [95, 0],
                                    }),
                                },
                            ],
                            opacity: animation,
                            flex: 1,
                            height: height / 4,
                            width: width / 2.5,
                            borderRadius: 12,
                            borderWidth: 5,
                            borderColor: '#D69999',
                            justifyContent: 'center',
                            position: 'absolute',
                        }}
                        source={{ uri: this.props.secondPhoto }}
                    ></Animated.Image>
                </View>
                <Texts />
                <InfinitCircle />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    TextsNInfinitCircle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
