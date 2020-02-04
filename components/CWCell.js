import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";

export default function CWCell(props) {
  let idx = props.index;
  let cell = props.cell;
  console.log("cell:", cell.index);
  //if the cell is a black cell, e.g. has no answer/input area
  if (cell.answer === ".") {
    return (
      <TouchableOpacity
        key={cell.index}
        style={{
          backgroundColor: "gray",
          height: "5%",
          width: cell.width,
          justifyContent: "center"
        }}
      ></TouchableOpacity>
    );
    //else if the cell has some stored answer value
  } else {
    return (
      <TouchableOpacity
        key={cell.index}
        onPress={() => {
          props.handlePress(cell.index);
        }}
        style={{
          backgroundColor: "#d1d9e6",
          height: "5%",
          width: cell.width,
          borderColor: "gray",
          borderWidth: 1,
          justifyContent: "center"
        }}
      >
        {/*if the cell has a clue number to display in it... */}
        {cell.number ? (
          <Text style={{ flex: 1, fontSize: 6, zIndex: 999 }}>
            {cell.number}
          </Text>
        ) : (
          <Text style={{ flex: 1, fontSize: 6, zIndex: 999 }}></Text>
        )}
        <TextInput
          maxLength={1}
          style={{
            backgroundColor: "white",
            height: "50%",
            width: "50%",
            alignSelf: "center",
            marginBottom: "35%",
            zIndex: 9999
          }}
          textAlign={"center"}
          key={cell.index}
          onChangeText={props.handleChange(cell.index)}
        >
          {cell.guess}
        </TextInput>
      </TouchableOpacity>
    );
  }
}
