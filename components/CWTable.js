import React from "react";
import { View, Text, ScrollView } from "react-native";
import CWCell from "./CWCell";
import CWRow from "./CWRow";

export default function CWTable(props) {
  console.log(
    "player color filter",
    props.playerColors.filter(player => player.userId === 0).length
  );
  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
        alignContent: "flex-start",
        // justifyContent: "flex-start",
        height: "100%"
        // borderWidth: 3,
        // borderColor: "grey"

        // marginTop: "1%"
        // paddingTop: "2%",
        // paddingLeft: "2%",
        // paddingRight: "2%"
      }}
      // keyboardShouldPersistTaps="always"
      maximumZoomScale="2.5"
      minimumZoomScale="1"
      zoomScale={props.zoomFactor}
      // onScroll={e => props.reZoom(e.nativeEvent.zoomScale)}
      // scrollEventThrottle="100"
      // zoomScale="2"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      // scrollEnabled={false}
    >
      {props.rows.map((row, index) => {
        return (
          <CWRow
            handleCellChange={props.handleCellChange}
            playerColors={props.playerColors}
            activeCells={props.activeCells}
            row={row}
            index={index}
            handleChange={props.handleChange}
            handlePress={props.handlePress}
            rowCount={props.numOfRows}
            currentCell={props.currentCell}
            downClue={props.downClue}
            acrossClue={props.acrossClue}
            currentView={props.currentView}
            refs={props.refs}
            key={index}
            traverse={props.traverse}
            direction={props.direction}
            columnLength={props.columnLength}
          />
        );
      })}
    </ScrollView>
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
