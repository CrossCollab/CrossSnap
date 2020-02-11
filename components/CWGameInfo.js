import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";

export default function CWGameInfo(props) {
  console.log("current players", props.currentPlayers);
  return (
    <View style={{ height: "15%" }}>
      <View style={{ height: "60%" }}>
        {props.currentPlayers && props.currentPlayers.length ? (
          <Text style={{ backgroundColor: "lightblue" }}>
            {props.currentPlayers ? props.currentPlayers.length : "unknown"}{" "}
            here
          </Text>
        ) : (
          <Text style={{ backgroundColor: "lightblue" }} />
        )}
      </View>
      {props.currentPlayers.map(player => (
        <View style={{ height: "40%", backgroundColor: "green" }}>
          <Text>${player} Playing!</Text>
        </View>
      ))}
    </View>
  );
}
