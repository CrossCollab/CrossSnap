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
import axios from "axios";

const SERVER_URL = "http://" + "172.17.22.96:8080";
// import * as Sharing from "expo-sharing";

// import logo from "../assets/images/logo.png"; //need the png

import { MonoText } from "../components/StyledText";
import io from "socket.io-client";
export default class CrosswordTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      guesses: [],
      isReady: false
    };
  }
  async componentDidMount() {
    const { navigation } = this.props;
    let gameId = navigation.getParam("gameInstance");
    try {
      //if the user is joining a game w/ a game ID
      if (gameId) {
        console.log("in component did mount w/ game id from nav");
        const { data } = await axios.get(
          `${SERVER_URL}/api/gameInstance/${gameId}`
        );
        console.log("got data from gameInstance");
        this.setState({
          answers: data.answers,
          guesses: data.guesses,
          isReady: true
        });
        this.socket = io(`${SERVER_URL}`);

        function onConnect() {
          console.log("connected");
          //this.emit rather than this.socket.emit because the socket is already the this object
          //as it's being called inside this.socket.on
          this.emit("join", gameId);
        }

        this.socket.on("connect", onConnect);

        this.socket.on("change puzzle", state => {
          const { guesses } = state;
          this.setState({ guesses });
        });
      }
      this._isMounted = true;
      const { data } = await axios.get(`${SERVER_URL}/api/gameInstance/`);
      this.setState({
        answers: data.answers,
        guesses: data.guesses,
        isReady: true
      });
      this.socket = io(SERVER_URL);
      this.socket.on("change puzzle", state => {
        const { guesses } = state;
        this.setState({ guesses });
      });
    } catch (err) {
      console.log(err);
    }
  }
  handleChange = idx => letter => {
    const allGuesses = JSON.parse(JSON.stringify(this.state.guesses));
    allGuesses[idx].guess = letter;
    this.setState({ guesses: allGuesses }, this.changeHelper);
  };
  changeHelper() {
    this.socket.emit("change puzzle", this.state);
  }

  render() {
    if (this.state && !this.state.isReady) {
      return <Text>Loading...</Text>;
    } else if (!this.state) {
      return <Text>No state</Text>;
    }

    let numOfRows = Math.sqrt(this.state.guesses.length);
    let rows = [];
    for (let i = 0; i < numOfRows; i++) {
      rows.push([]);
    }
    for (let i = 0; i < this.state.guesses.length; i++) {
      let currentRow = Math.floor(i / numOfRows);
      let currentAnswer = this.state.guesses[i];
      rows[currentRow].push(currentAnswer);
    }

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
                  <TextInput
                    maxLength={1}
                    style={{
                      backgroundColor: "white",
                      height: "100%",
                      width: `${100 / numOfRows}%`,
                      borderColor: "black",
                      borderWidth: 1,
                      justifyContent: "center"
                    }}
                    textAlign={"center"}
                    key={cell.index}
                    onChangeText={this.handleChange(cell.index)}
                  >
                    {cell.guess}
                  </TextInput>
                );
              })}
            </View>
          );
        })}
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
