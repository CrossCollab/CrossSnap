import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Animated
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // console.log("keyboard visible");
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // console.log("keyboard hidden");
        setKeyboardVisible(false);
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
        height: "8%",
        zIndex: 999,
        paddingBottom: isKeyboardVisible === true ? 380 : "0%"
      }}
    >
      <Text
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignSelf: "center",
          alignItems: "center",
          paddingTop: "2%",
          paddingBottom: isKeyboardVisible === true ? 380 : "0%"
        }}
      >
        {currentClue}
      </Text>
    </View>
  );
}
