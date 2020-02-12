import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";

export default function CWGameInfo(props) {
  let playerColorArray = Object.values(props.playerColors);
  console.log("player color array:", playerColorArray);
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
          flex: 1,
          // top: "70%",
          width: "100%",
          position: "absolute",
          top: "60%",
          backgroundColor: "#ededda"
          // borderWidth: 2,
          // borderColor: "black"
        }}
      >
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: "#ededda",
            padding: 5,
            alignItems: "center"
          }}
        >
          {props.currentPlayers && props.currentPlayers.length ? (
            <Text
              style={{
                backgroundColor: "lightgrey",
                alignContent: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "gray",
                padding: 3
              }}
            >
              Active Players:{" "}
              {props.currentPlayers ? props.currentPlayers.length : "unknown"}
            </Text>
          ) : (
            <Text style={{ backgroundColor: "lightblue" }} />
          )}
        </View>
        <View
          style={{ height: "100%", backgroundColor: "#f2f1bf", width: "100%" }}
        >
          {playerColorArray.map((element, index) => {
            return (
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  flexDirection: "row",
                  alignContent: "flex-start",
                  justifyContent: "flex-start",
                  backgroundColor: "#ededda"
                }}
                key={index}
              >
                <Text style={{ marginLeft: "5%" }}>{element.firstName}: </Text>
                <View
                  style={{
                    height: "30%",
                    backgroundColor: `${element.color}`,
                    width: "10%",
                    alignItems: "center",
                    marginTop: "1%"
                  }}
                ></View>
              </View>
            );
          })}
        </View>
      </View>
    );
  } else return <View style={{ height: "0%" }}></View>;
}
