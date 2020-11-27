import React, { useState } from "react";
import {
	Text,
	View,
	Modal,
	TouchableHighlight,
	StyleSheet,
	Dimensions,
	Alert,
	Image,
} from "react-native";
import styled from "styled-components";

const TipContainer = styled.View`
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	margin-top: -10%;
	margin-bottom: 3%;
`;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const Popup = () => {
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<View style={styles.LeftView}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>
							{`1. 정면을 바라보고 눈을 바르게 뜨세요.
2. 아래 버튼으로 성별을 바꿀 수 있어요.
`}
						</Text>
						<TipContainer>
							<Image
								source={require("../Buttons/ChangeBtns/Gender/woman.png")}
								style={{
									width: 40,
									height: 40,
									// marginTop: -10,
									// resizeMode: 'contain',
								}}
							/>
							<Image
								source={require("../Buttons/ChangeBtns/Gender/man.png")}
								style={{
									width: 40,
									height: 40,
									// marginTop: -10,
									// resizeMode: 'contain',
								}}
							/>
						</TipContainer>

						<TouchableHighlight
							style={{
								...styles.openButton,
								backgroundColor: "#f7eeb0",
							}}
							onPress={() => {
								setModalVisible(false);
							}}
						>
							<Text style={styles.textStyle}>닫기</Text>
						</TouchableHighlight>
					</View>
				</View>
			</Modal>
			<TouchableHighlight
				style={
					styles.openButton //, setTimeout(() => 'display:none', 2000))
				}
				onPress={() => {
					setModalVisible(true);
				}}
			>
				<Text style={styles.textStyle}>Tip!</Text>
			</TouchableHighlight>
		</View>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	LeftView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		top: deviceHeight / 10,
		right: deviceWidth / 2.5,

		// marginTop: -650,
		// marginLeft: -310,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: "#b9d3ed",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	closeButton: {},
	textStyle: {
		color: "black",
		fontWeight: "bold",
		textAlign: "justify",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		lineHeight: 25,
	},
});

export default Popup;
