import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CWCell from "./CWCell";
import CWRow from "./CWRow";

export default function CWTable(props) {
  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        alignContent: "flex-start",
        justifyContent: "flex-start",
        height: "80%",
        marginTop: "10%"
      }}
    >
      {props.rows.map((row, index) => {
        return (
          <CWRow
            row={row}
            index={index}
            handleChange={props.handleChange}
            handlePress={props.handlePress}
            rowCount={props.numOfRows}
          />
        );
      })}
      <Text>current across clue: {props.acrossClue}</Text>
      <Text>current down clue: {props.downClue}</Text>
    </View>
    // <View
    //   style={{
    //     flex: 1,
    //     flexDirection: "row",
    //     height: `${100 / props.rowCount}%`
    //   }}
    //   key={props.index}
    // >
    //   {props.row.map(cell => {
    //     return (
    //       <CWCell
    //         cell={cell}
    //         handleChange={props.handleChange}
    //         handlePress={props.handlePress}
    //         rowCount={props.rowCount}
    //       />
    //     );
    //   })}
    // </View>
  );
}
