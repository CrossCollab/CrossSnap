import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HeaderOptions(props) {
  return (
    <View style={{ height: "8%" }}>
      <TouchableOpacity onPress={props.checkBoard}>
        <Text>Check Game</Text>
      </TouchableOpacity>
    </View>
  );
}
