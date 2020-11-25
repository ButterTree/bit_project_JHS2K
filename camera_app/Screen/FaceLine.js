/** @format */

import React from 'react';
import { View } from 'react-native';

export default () => {
	return (
		<View
			style={{
				marginTop: 80,
				width: 160,
				height: 200,
				borderRadius: 100 / 1.1,
				borderWidth: 5,
				opacity: 0.5,
				borderColor: 'white',
				backgroundColor: 'transparent',
				position: 'absolute',
			}}
		/>
	);
};
