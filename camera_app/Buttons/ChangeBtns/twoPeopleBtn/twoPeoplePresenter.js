import React, { memo } from "react";
import ToggleButton from "react-native-toggle-element";
import { Image } from "react-native";

const ChangeTwoPeople = memo((props) => (
	<ToggleButton
		onPress={props.onPress}
		value={props.toggleValue}
		onToggle={props.onToggle}
		thumbActiveComponent={
			// <MaterialIcons name="people-outline" color="white" size={35} />
			<Image
				source={require("../../images/two_people.png")}
				style={{
					width: "100%",
					height: "100%",
					// marginTop: -10,
					resizeMode: "contain",
				}}
			/>
		}
		thumbInActiveComponent={
			// <MaterialIcons name="person-outline" color="white" size={35} />
			<Image
				source={require("../../images/one_person.png")}
				style={{
					width: "100%",
					height: "100%",
					// marginTop: -10,
					resizeMode: "contain",
				}}
			/>
		}
		thumbButton={{
			width: 100,
			height: 100,
			radius: 0,
		}}
		trackBar={{
			activeBackgroundColor: "transparent",
			inActiveBackgroundColor: "transparent",
			borderActiveColor: "white",
			borderInActiveColor: "white",
			width: 100,
			height: 100,
		}}
		trackBarStyle={{
			opacity: 0.9,
		}}
	></ToggleButton>
));

export default ChangeTwoPeople;
