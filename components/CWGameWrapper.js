import React from "react";
import { View, Text } from "react-native";
import CWCell from "./CWCell";
import CWRow from "./CWRow";
import CWTable from "./CWTable";

export default function CWGameWrapper(props) {
  let numOfRows = Math.sqrt(props.guesses.length);
  let rows = [];
  for (let i = 0; i < numOfRows; i++) {
    rows.push([]);
  }
  for (let i = 0; i < props.guesses.length; i++) {
    let currentRow = Math.floor(i / numOfRows);
    let currentGuess = props.guesses[i];
    rows[currentRow].push(currentGuess);
  }

  //can add in react functional component lifecycle hooks to update
  //can adjust to pull in gameInstance data here versus in the componentDidMount section...
  //still need info on selected cell and on the neighbor cells
  return (
    <View style={{ height: "100%", width: "100%" }}>
      <CWTable
        rows={rows}
        numOfRows={numOfRows}
        handleChange={props.handleChange}
        handlePress={props.handlePress}
        acrossClue={props.acrossClue}
        downClue={props.downClue}
        currentCell={props.currentCell}
        currentView={props.currentView}
      />
      <Text>current across clue: {props.acrossClue}</Text>
      <Text>current down clue: {props.downClue}</Text>
    </View>
  );
}
