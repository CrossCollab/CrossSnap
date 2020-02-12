import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  Button,
  StyleSheet,
  Dimensions
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CWClue(props) {
  let currentClue;
  if (props.currentView === "across") {
    currentClue = props.acrossClue;
  } else {
    currentClue = props.downClue;
  }
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [clueMargin, setClueMargin] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      event => {
        setKeyboardVisible(true);
        // console.log(event.endCoordinates.height);
        setClueMargin(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setClueMargin(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#c1ebb2",
        height: "auto",
        width: "100%",
        zIndex: 999,
        marginBottom: isKeyboardVisible === true ? clueMargin : "0%",
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <Button
        onPress={() => props.findPreviousClue()}
        title="<"
        style={{ position: "relative", flex: 1 }}
      ></Button>
      <Text
        style={{
          // justifyContent: "center",
          // alignContent: "center",
          // alignSelf: "center",
          // alignItems: "center",
          // paddingTop: "2%",
          // paddingBottom: isKeyboardVisible === true ? 380 : "0%",
          textAlign: "center",
          height: "auto",
          width: "85%",
          flex: 1
        }}
      >
        {currentClue}
      </Text>
      <Button
        onPress={() => props.findNextClue()}
        title=">"
        style={{ position: "relative", flex: 1 }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16
  }
});
