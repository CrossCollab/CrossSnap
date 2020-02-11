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
    <View
      style={{ height: "15%", position: "absolute", top: "70%", width: "100%" }}
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
}
