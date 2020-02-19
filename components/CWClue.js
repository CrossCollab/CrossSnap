import React, { useState, useEffect } from "react";
import { Text, View, Keyboard, Button, StyleSheet } from "react-native";

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
