import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";

export default function CWGameInfo(props) {
  return (
    <View style={{ height: "5%" }}>
      {props.currentPlayers && props.currentPlayers.length ? (
        <Text style={{ backgroundColor: "lightblue" }}>
          {props.currentPlayers ? props.currentPlayers.length : "unknown"} here
        </Text>
      ) : (
        <Text style={{ backgroundColor: "lightblue" }} />
      )}
    </View>
  );
}
