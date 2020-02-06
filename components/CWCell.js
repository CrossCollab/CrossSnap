import React from "react";
import { Text, TouchableOpacity, TextInput } from "react-native";

export default function CWCell(props) {
  let idx = props.index;
  let cell = props.cell;
  //if the cell is a black cell, e.g. has no answer/input area
  if (cell.answer === ".") {
    return (
      <TouchableOpacity
        key={cell.index}
        ref={props.refs[cell.index]}
        style={{
          backgroundColor: "gray",
          height: "100%",
          width: `${100 / props.rowCount}%`,
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
          // console.log("pressed");
          props.handlePress(cell);
        }}
        style={{
          backgroundColor: "#d1d9e6",
          height: "100%",
          width: `${100 / props.rowCount}%`,
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
            backgroundColor: cell.correct ? "green" : "white",
            height: "50%",
            width: "50%",
            alignSelf: "center",
            marginBottom: "35%",
            zIndex: 9999
          }}
          ref={props.refs[cell.index]}
          textAlign={"center"}
          key={cell.index}
          onKeyPress={() => {
            props.refs[cell.index + 1].current.focus();
            props.handleChange(cell.index);
          }}
        >
          {cell.guess}
        </TextInput>
      </TouchableOpacity>
    );
  }
}
