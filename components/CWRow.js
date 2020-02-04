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
      key={props.index}
    >
      {props.row.map(cell => {
        return (
          <CWCell
            cell={cell}
            handleChange={props.handleChange}
            handlePress={props.handlePress}
            rowCount={props.rowCount}
          />
        );
      })}
    </View>
  );
}
