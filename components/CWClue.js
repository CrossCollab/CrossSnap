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

  //The current cell, held in local state on CrosswordScreen.js holds
  //information about the across and down clues for each cell, which is passed in here as the
  //acrossClue and downClue.
  if (props.currentView === "across") {
    currentClue = props.acrossClue;
  } else {
    currentClue = props.downClue;
  }

  //uses React hooks to add local state that holds whether the keyboard is visible
  //and what the height of the clue banner should be such that it sits atop the keyboard,
  //if the keyboard is shown.
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [clueMargin, setClueMargin] = useState(0);

  //adds a listener for keyboard appearance
  //Not sure the isKeyboardVisible is needed if we are already setting clue margin height.
  //useEffect triggers after each render.
  //The return is the optional cleanup mechanism for useEffect, removing the keyboard listeners,
  //performed when the component unmounts or re-renders.
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
    //structure of this clue banner is a view wrapping 2 buttons (prev/next) and the clue text
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
