import React from "react";
import { View } from "react-native";
import CWCell from "./CWCell";

export default function CWRow(props) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        height: `${100 / props.rowCount}%`
      }}
      key={props.index + 500}
    >
      {props.row.map((cell, index) => {
        return (
          <CWCell
            cell={cell}
            handleChange={props.handleChange}
            handlePress={props.handlePress}
            rowCount={props.rowCount}
            currentCell={props.currentCell}
            downClue={props.downClue}
            acrossClue={props.acrossClue}
            currentView={props.currentView}
            refs={props.refs}
            key={index + 999}
          />
        );
      })}
    </View>
  );
}
