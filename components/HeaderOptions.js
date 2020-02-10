import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";

export default function HeaderOptions(props) {
  const [view, setView] = useState("View Down");

  const toggleView = () => {
    if (view === "View Across") {
      setView("View Down");
    } else {
      setView("View Across");
    }
    props.swapView();
  };

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
      <TouchableOpacity style={styles.touchable} onPress={() => toggleView()}>
        <Text>{view}</Text>
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
