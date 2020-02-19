/**
 * CWCell is a functional react component that returns a single cell of the CW game board
 * it uses the cell info from a single entry of the guesses array, as well as information
 * about the gameboard such as current view, player colors, active cells, current cell, and row/column count.
 * Additionally, it can call several functions such as:
 * handleChange (on text input), and handlePress (on view)
 */

import React from "react";
import { Text, TextInput, View } from "react-native";

export default function CWCell(props) {
  let cell = props.cell;
  let playerColors = props.playerColors;
  let activeCells = props.activeCells;

  //The structure of information being pulled in looks like this:
  // cell = {answer, guess, index, userId}
  // playerColors = [{color, firstName, userId}, ...]
  // activeCells = {'userId', index}

  //cellColor represent's the cell's text color, set to the userId who entered the guess' color
  let cellColor;

  if (cell.index === 10) {
    console.log("cell = ", cell);
    console.log("playerColors = ", playerColors);
    console.log("activeCells = ", activeCells);
  }

  //if there isn't an array of playerColors (e.g. hasn't yet been pulled in), render
  //the cell's text in black. Or, if the userId of the cell (default to 0) is not in the
  //array of playerColors, then display the cell's text in black (should be empty)
  if (
    !playerColors ||
    playerColors.filter(player => player.userId === cell.userId).length === 0
  ) {
    cellColor = "black";
  } else {
    cellColor = playerColors.filter(player => player.userId === cell.userId)[0]
      .color;
  }

  //setting up player active cell status and color
  let cellBackgroundColor;
  let hasBackground = false;

  //generates just an array of the active cell indices, e.g. [14, 88, 213]
  let activeCellIndexes = Object.values(activeCells);
  let activeUserId;

  //set the activeUserId for this cell by seeing if for each key in the activeCells,
  //if the value (index) matches the index of this particular cell.
  for (const userId in activeCells) {
    if (activeCells[userId] === cell.index) {
      activeUserId = userId;
    }
  }

  //if this cell's index is included in the array of active cell indices, then
  //figure out the color of the player active in this cell, by matching the activeUserId
  //from the active cells array, to the userID in the playerColors array
  if (activeCellIndexes.includes(cell.index)) {
    let indexOfPlayer = playerColors.findIndex(
      element => element.userId == activeUserId
    );
    let playerColor;
    if (indexOfPlayer < 0) {
      playerColor = "green";
    } else {
      playerColor = playerColors[indexOfPlayer].color;
    }
    cellBackgroundColor = playerColor;
    hasBackground = true;
  }

  //if the cell is a black cell, e.g. has no answer/input area
  if (cell.answer === ".") {
    return (
      //hide the caret, make it gray
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
        //if this black cell gets focused on, just pass the focus on appropriately
        //depends on view (across/down) and direction of movement (previous/next)
        //direction is set when a key is pressed. If delete, set to backwards, else fwd.
        //this is set in CrosswordScreen
        onFocus={event => {
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
              if (
                cell.index + props.columnLength >=
                Math.pow(props.columnLength, 2)
              ) {
                props.refs[
                  1 +
                    cell.index +
                    props.columnLength -
                    Math.pow(props.columnLength, 2)
                ].current.focus();
              } else {
                props.refs[cell.index + props.columnLength].current.focus();
              }
            } else {
              if (cell.index - props.columnLength < 0) {
                props.refs[
                  Math.pow(props.columnLength, 2) -
                    (1 + props.columnLength - cell.index)
                ].current.focus();
              } else {
                props.refs[cell.index - props.columnLength].current.focus();
              }
            }
          }
        }}
      ></TextInput>
    );
    //else if the cell has some stored answer value (ISNT BLACK CELL)
  } else {
    return (
      <View
        key={cell.index}
        onPress={() => {
          //focus on the text input when the touchable opacity is pressed
          props.refs[cell.index].current.focus();
        }}
        //For the wrapping view's background color
        //if this is the current cell the user if focused on, make it yellow
        //else if this is a cell with the same across or down clue, then color
        //it light blue to show the active word on the board
        style={{
          backgroundColor:
            cell.index === props.currentCell.index
              ? "#e0c422"
              : cell.across === props.acrossClue &&
                props.currentView === "across"
              ? "#c1ebb2"
              : cell.down === props.downClue && props.currentView === "down"
              ? "#c1ebb2"
              : "white",
          height: "100%",
          width: `${100 / props.rowCount}%`,
          borderColor: "gray",
          borderWidth: 1,
          justifyContent: "center"
        }}
      >
        {/*if the cell has a clue number to display in it... */}
        {cell.number ? (
          <Text
            style={{
              flex: 1,
              fontSize: 5,
              zIndex: 99999,
              position: "absolute",
              left: "0%",
              top: "0%",
              // backgroundColor: "white",
              fontWeight: "bold"
              // borderColor: "grey",
              // borderWidth: 1
            }}
          >
            {cell.number}
          </Text>
        ) : (
          <Text
            style={{
              flex: 1,
              fontSize: 5,
              zIndex: 999,
              position: "absolute",
              left: "2%"
            }}
          ></Text>
        )}
        <TextInput
          autoCapitalize="characters"
          maxLength={1}
          //if, earlier, we determined that a user was active in this cell,
          //give this cell the light background color of that user
          //else if the game board has been checked and the cell was found correct
          //give the cell the green correct background, else white background
          style={{
            backgroundColor: hasBackground
              ? `light${cellBackgroundColor}`
              : cell.correct
              ? "#c2e0ad"
              : "white",
            height: "60%",
            width: "60%",
            alignSelf: "center",
            marginBottom: "35%",
            zIndex: 9999,
            top: "12%",
            fontSize: 8,
            //text appears in as the color of the user who entered the guess, or black (which should only be for empties..)
            color: cellColor ? cellColor : "black",
            fontWeight: "bold"
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
      </View>
    );
  }
}
