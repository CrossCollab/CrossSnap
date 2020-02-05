import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HeaderOptions(props) {
  return (
    <View style={{ height: "10%" }}>
      <TouchableOpacity onPress={props.checkBoard}>
        <Text>Check Game</Text>
      </TouchableOpacity>
    </View>
  );
}
