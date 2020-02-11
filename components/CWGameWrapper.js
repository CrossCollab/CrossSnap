import React from "react";
import { View, Text } from "react-native";
import CWCell from "./CWCell";
import CWRow from "./CWRow";
import CWTable from "./CWTable";
import { TouchableOpacity } from "react-native-gesture-handler";
import CWClue from "./CWClue";
import HeaderOptions from "./HeaderOptions";
import CWGameInfo from "./CWGameInfo";

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
      <View style={{ height: "8%" }}></View>
      <HeaderOptions
        checkBoard={props.checkBoard}
        currentPlayers={props.currentPlayers}
        swapView={props.swapView}
        refs={props.refs}
        reZoom={props.reZoom}
        zoomFactor={props.zoomFactor}
      />
      <CWTable
        zoomFactor={props.zoomFactor}
        reZoom={props.reZoom}
        handleCellChange={props.handleCellChange}
        activeCells={props.activeCells}
        rows={rows}
        numOfRows={numOfRows}
        handleChange={props.handleChange}
        handlePress={props.handlePress}
        acrossClue={props.acrossClue}
        downClue={props.downClue}
        currentCell={props.currentCell}
        currentView={props.currentView}
        key={9999}
        refs={props.refs}
        traverse={props.traverse}
        direction={props.direction}
        columnLength={props.columnLength}
      />
      <View style={{ height: "2%" }} />
      <CWGameInfo currentPlayers={props.currentPlayers} />
      <CWClue
        currentView={props.currentView}
        acrossClue={props.acrossClue}
        downClue={props.downClue}
        swapView={props.swapView}
        refs={props.refs}
        currentCell={props.currentCell}
        findNextClue={props.findNextClue}
        findPreviousClue={props.findPreviousClue}
      />
    </View>
  );
}
