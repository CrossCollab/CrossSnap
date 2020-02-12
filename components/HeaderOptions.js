import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";

export default function HeaderOptions(props) {
  // const [view, setView] = useState("View down");

  const toggleView = () => {
    if (props.currentView === "across") {
      // setView(`View across`);
    } else {
      // setView(`View down`);
    }
    props.swapView();
  };

  const refocus = () => {
    props.reZoom(props.zoomFactor - 0.01);
    props.refs[0].current.focus();
    props.refs[0].current.blur();
    // props.refs[0].current.focus();
  };

  return (
    <View
      style={{
        height: "7%",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 3,
        backgroundColor: "#c1ebb2",
        alignContent: "center",
        alignItems: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 0
      }}
    >
      <TouchableOpacity style={styles.touchable} onPress={props.checkBoard}>
        <Text>Check Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchable} onPress={() => refocus()}>
        <Text>Refocus</Text>
      </TouchableOpacity>
      {/* could make the refocus a toggleable focus on focus, incorporating below */}
      {/* <TouchableOpacity
        style={styles.touchable}
        onPress={() => props.refs[0].current.blur()}
      >
        <Text>Unfocus</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.touchable} onPress={() => toggleView()}>
        <Text>View {props.currentView == "across" ? "down" : "across"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    color: "grey",
    borderColor: "lightgrey",
    borderWidth: 1,
    backgroundColor: "#c1ebb2",
    padding: 4,
    borderColor: "grey",
    borderRadius: 5,
    height: "70%",
    alignContent: "center"
  }
});
