import React from "react";
import { Text, TouchableOpacity, TextInput } from "react-native";

export default function CWCell(props) {
  let idx = props.index;
  let cell = props.cell;

  //if the cell is a black cell, e.g. has no answer/input area
  if (cell.answer === ".") {
    return (
      <TextInput
        caretHidden={true}
        key={cell.index}
        ref={props.refs[cell.index]}
        maxLength={0}
        style={{
          backgroundColor: "gray",
          height: "100%",
          width: `${100 / props.rowCount}%`,
          justifyContent: "center"
        }}
        onFocus={event => {
          console.log("blank cell event: paused");
          console.log("props.columnLength", props.columnLength);
          console.log("props.currentView", props.currentView);
          console.log("props.direction", props.direction);
          if (props.currentView === "across") {
            if (props.direction === "forward") {
              if (cell.index + 1 >= Math.pow(props.columnLength, 2)) {
                props.refs[0].current.focus();
              } else {
                props.refs[cell.index + 1].current.focus();
              }
            } else {
              if (cell.index - 1 < 0) {
                props.refs[Math.pow(props.columnLength, 2)].current.focus();
              }
              props.refs[cell.index + -1].current.focus();
            }
          } else {
            //view is down
            if (props.direction === "forward") {
              console.log("jumping column grey");
              props.refs[cell.index + props.columnLength].current.focus();
            } else {
              props.refs[cell.index - props.columnLength].current.focus();
            }
          }
        }}
      ></TextInput>
    );
    //else if the cell has some stored answer value
  } else {
    return (
      <TouchableOpacity
        key={cell.index}
        onPress={() => {
          props.refs[cell.index].current.focus();
          //focus on the text input when the touchable opacity is pressed
        }}
        style={{
          backgroundColor:
            cell.index === props.currentCell.index
              ? "#e0c422"
              : cell.across === props.acrossClue &&
                props.currentView === "across"
              ? "#c1ebb2"
              : cell.down === props.downClue && props.currentView === "down"
              ? "#c1ebb2"
              : "#d1d9e6",
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
            width: "80%",
            alignSelf: "center",
            marginBottom: "35%",
            zIndex: 9999
          }}
          ref={props.refs[cell.index]}
          textAlign={"center"}
          key={cell.index}
          onKeyPress={props.handleChange(cell.index)}
          onFocus={() => {
            props.handlePress(cell);
          }}
        >
          {cell.guess}
        </TextInput>
      </TouchableOpacity>
    );
  }
}
