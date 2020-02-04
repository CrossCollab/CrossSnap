import * as WebBrowser from "expo-web-browser";
import React from "react";
import SERVER_URL from "../serverUrl";
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
import axios from "axios";

// import logo from "../assets/images/logo.png"; //need the png

import { MonoText } from "../components/StyledText";
import io from "socket.io-client";

export default class CrosswordTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      guesses: [],
      isReady: false,
      currentCell: {},
      gameId: 0
    };
  }
  async componentDidMount() {
    //a user should always be coming here with some gameInstance ID via nav props
    const { navigation } = this.props;
    let gameId = navigation.getParam("gameInstance");

    try {
      //get the gameInstance model instance from the backend
      const { data } = await axios.get(
        `${SERVER_URL}/api/gameInstance/${gameId}`
      );

      //set the state of the local CWordTable component
      //pulling the answers/guesses/gameId in from the instance
      this.setState({
        answers: data.answers,
        guesses: data.guesses,
        isReady: true,
        gameId
      });

      //set up a client-side socket
      this.socket = io(`${SERVER_URL}`);

      function onConnect() {
        //this.emit rather than this.socket.emit because the socket is already the this object
        //as it's being called inside this.socket.on
        this.emit("join", gameId);
      }

      //once the socket receives the connect message from the server-side, ask to join the
      //room with the id matching the gameId
      this.socket.on("connect", onConnect);

      //NEED TO ADD SOMETHING PULLING IN THE CURRENT ROOM STATE FOR A NEW PLAYER ADDITION?

      //when the client receives a message from server socket of change puzzle,
      //update the state of the guesses array
      this.socket.on("change puzzle", msg => {
        this.setState({ guesses: msg.guesses });
      });
    } catch (err) {
      console.err(err);
    }
  }

  //whenever the client changes the value of a crossword square
  handleChange = idx => letter => {
    //copy the guesses object on state (crude approach, but works)
    const allGuesses = JSON.parse(JSON.stringify(this.state.guesses));
    //update the value of the guess with the new letter
    allGuesses[idx].guess = letter;
    //set the state as the new guesses Obj, call changeHelper function
    this.setState({ guesses: allGuesses }, this.changeHelper);
  };

  //this function sends a message to the socket with the current state and roomId
  changeHelper() {
    let socketMsg = {
      state: this.state,
      room: this.state.gameId
    };
    this.socket.emit("change puzzle", socketMsg);
  }

  //need to remove the socket listeners, turn them 'off' in here
  componentWillUnmount() {}

  render() {
    if (this.state && !this.state.isReady) {
      return <Text>Loading...</Text>;
    } else if (!this.state) {
      return <Text>No state</Text>;
    }

    //the num of rows is the square root of the total # of guesses (all our xwords are squares)
    //pushes each guess from this.state into a row array
    let numOfRows = Math.sqrt(this.state.guesses.length);
    let rows = [];
    for (let i = 0; i < numOfRows; i++) {
      rows.push([]);
    }
    for (let i = 0; i < this.state.guesses.length; i++) {
      let currentRow = Math.floor(i / numOfRows);
      let currentGuess = this.state.guesses[i];
      rows[currentRow].push(currentGuess);
    }

    //later we should probabaly create subComponents for XWord Table, Row, and Cell...
    return (
      //   <CrosswordTable rows={rows} guesses={this.state.guesses} answers={this.state.answers}
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
        {rows.map((row, index) => {
          return (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderColor: "black",
                borderWidth: 2,
                height: `${100 / numOfRows}%`
              }}
              key={index}
            >
              {row.map((cell, idx) => {
                if (cell.answer === ".") {
                  return (
                    <TextInput
                      maxLength={0}
                      style={{
                        backgroundColor: "black",
                        height: "100%",
                        width: `${100 / numOfRows}%`,
                        borderColor: "black",
                        borderWidth: 1,
                        justifyContent: "center"
                      }}
                      textAlign={"center"}
                      key={cell.index}
                    />
                  );
                }

                return (
                  <TouchableOpacity
                    key={cell.index}
                    onPress={() => {
                      this.setState({ currentCell: cell });
                      console.log("hello");
                      console.log("cell down", cell);
                    }}
                    style={{
                      backgroundColor: "gray",
                      height: "100%",
                      width: `${100 / numOfRows}%`,
                      borderColor: "black",
                      borderWidth: 1,
                      justifyContent: "center"
                    }}
                  >
                    {cell.number ? (
                      <Text style={{ flex: 1, fontSize: 6, zIndex: 10 }}>
                        {cell.number}
                      </Text>
                    ) : (
                      <Text></Text>
                    )}
                    <TextInput
                      maxLength={1}
                      style={{ backgroundColor: "white" }}
                      // style={{
                      //   backgroundColor: "white",
                      //   height: "100%",
                      //   width: `${100 / numOfRows}%`,
                      //   borderColor: "black",
                      //   borderWidth: 1,
                      //   justifyContent: "center"
                      // }}
                      textAlign={"center"}
                      key={cell.index}
                      onChangeText={this.handleChange(cell.index)}
                    >
                      {cell.guess}
                    </TextInput>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
        <Text>current across clue: {this.state.currentCell.across}</Text>
        <Text>current down clue: {this.state.currentCell.down}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  // view: {
  //   flexDirection: "row",
  //   height: "25%"
  // },
  textinput: {
    backgroundColor: "white",
    height: "100%",
    // width: `${100 / numOfRows}%`,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center"
  },
  blackSquare: {
    backgroundColor: "black",
    height: "100%",
    // width: `${100 / numOfRows}%`,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center"
  }
});
