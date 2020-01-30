import * as WebBrowser from "expo-web-browser";
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

// import * as Sharing from "expo-sharing";

// import logo from "../assets/images/logo.png"; //need the png

import { MonoText } from "../components/StyledText";
let answers = [
  "d",
  "X",
  "g",
  ".",
  "t",
  "d",
  "o",
  "g",
  ".",
  "t",
  "d",
  "o",
  "g",
  ".",
  "t",
  "d",
  "o",
  "g",
  ".",
  "t",
  "d",
  "o",
  "Z",
  ".",
  "t",
  "o",
  "g",
  ".",
  "t",
  "d",
  "o",
  "Z",
  ".",
  "t",
  "z",
  "y"
];
// let row1 = ["d", "o", "g", ".", "t"];
// [[],[],[],[],[]]
let numOfRows = Math.sqrt(answers.length);
export default function CrosswordScreen() {
  //transform the array of answers into rows for component purposes
  let numOfRows = Math.sqrt(answers.length);
  let rows = [];
  for (let i = 0; i < numOfRows; i++) {
    rows.push([]);
  }
  for (let i = 0; i < answers.length; i++) {
    let currentRow = Math.floor(i / numOfRows);
    let currentAnswer = answers[i];
    console.log("i", i);
    console.log("current row", currentRow);
    rows[currentRow].push(currentAnswer);
  }
  // console.log("rows", rows);

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        alignContent: "flex-start",
        justifyContent: "flex-start"
      }}
    >
      {rows.map((row, index) => {
        console.log("row", row, "index:", index);
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              borderColor: "blue",
              borderWidth: 2,
              height: `${100 / numOfRows}%`
            }}
            key={index}
          >
            {row.map((cell, idx) => {
              console.log("cell", cell, "index:", (idx + 1) * (index + 1));
              if (cell === ".") {
                return (
                  <TextInput
                    maxLength={0}
                    style={(styles.textinput, styles.blackSquare)}
                    textAlign={"center"}
                    key={Math.random() * 1000}
                  />
                );
              }

              return (
                <TextInput
                  placeholder={cell}
                  maxLength={1}
                  style={styles.textinput}
                  textAlign={"center"}
                  key={Math.random() * 10000}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // view: {
  //   flexDirection: "row",
  //   height: "25%"
  // },
  textinput: {
    backgroundColor: "white",
    height: "100%",
    width: `${100 / numOfRows}%`,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center"
  },
  blackSquare: {
    backgroundColor: "black",
    height: "100%",
    width: `${100 / numOfRows}%`,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center"
  }
});
