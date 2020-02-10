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
      {props.currentPlayers && props.currentPlayers.length ? (
        <Text style={{ backgroundColor: "red" }}>
          {props.currentPlayers.length} here
        </Text>
      ) : (
        <Text style={{ backgroundColor: "red" }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    color: "grey",
    borderColor: "lightgrey",
    borderWidth: 1,
    backgroundColor: "#c1ebb2"
    // height: "8%"
  }
});
