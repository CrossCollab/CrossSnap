import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";

export default function HeaderOptions(props) {
  return (
    <View
      style={{
        height: "5%",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 3
      }}
    >
      <TouchableOpacity style={styles.touchable} onPress={props.checkBoard}>
        <Text>Check Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => props.refs[0].current.focus()}
      >
        <Text>FocusTop</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => props.swapView()}
      >
        <Text>Across/Down</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "lightgreen"
    // height: "8%"
  }
});
