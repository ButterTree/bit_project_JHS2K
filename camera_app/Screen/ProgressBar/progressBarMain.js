import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import ProgressLoading from './progressLoading';
import Texts from './Texts';

const Progress = ({ step, steps, height }) => {
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      donation: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);

  return (
    <>
      <Texts />
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;

          setWidth(newWidth);
        }}
        style={{
          height,
          backgroundColor: 'black',
          borderRadius: height,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height,
            width: '100%',
            borderRadius: height,
            backgroundColor: 'lightgray',

            left: 0,
            top: 0,
            transform: [
              {
                translateX: animatedValue,
              },
            ],
          }}
        />
        {/* <Text
          style={{
            fontSize: 15,
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'black',
            opacity: 0.8,
            position: 'absolute',
          }}
        >
          Loading...
        </Text> */}
      </View>
    </>
  );
};

export default function App() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 4) % (100 + 4));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [index]);
  return (
    <View style={styles.container}>
      <ProgressLoading />
      <StatusBar hidden />
      <Progress step={index} steps={100} height={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: (20, 60),
  },
});
