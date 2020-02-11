import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";

export default function CWGameInfo(props) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      event => {
        setKeyboardVisible(true);
        console.log(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (!isKeyboardVisible) {
    return (
      <View
        style={{
          height: "15%",
          // top: "70%",
          width: "100%",
          position: "relative"
        }}
      >
        <View style={{ height: "60%" }}>
          {props.currentPlayers && props.currentPlayers.length ? (
            <Text style={{ backgroundColor: "lightblue" }}>
              Active Players:{" "}
              {props.currentPlayers ? props.currentPlayers.length : "unknown"}{" "}
            </Text>
          ) : (
            <Text style={{ backgroundColor: "lightblue" }} />
          )}
        </View>
        <View style={{ height: "30%" }}>
          {props.currentPlayers.map((player, index) => (
            <View key={index}>
              <Text>{player}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  } else return <View style={{ height: "0%" }}></View>;
}
