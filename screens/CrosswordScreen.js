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
import CWCell from "../components/CWCell";
import CWRow from "../components/CWRow";
import CWTable from "../components/CWTable";
import CWGameWrapper from "../components/CWGameWrapper";
import axios from "axios";

// Murad: 172.17.23.241
// Mike: 172.17.21.173

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

    //bind these functions so child components can call them in OG context
    this.handleChange = this.handleChange.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.changeHelper = this.changeHelper.bind(this);
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

  //whenever the client changes the value of a crossword square, copy the guesses obj
  //update the value of the appropo letter, update state
  handleChange = idx => letter => {
    const allGuesses = JSON.parse(JSON.stringify(this.state.guesses));
    allGuesses[idx].guess = letter;
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

  handlePress(cell) {
    console.log("handling press");
    this.setState({ currentCell: cell });
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
    //unclear... perhaps this should be inside a functional component?
    const { navigation } = this.props;
    let gameId = navigation.getParam("gameInstance");
    return (
      <CWGameWrapper
        gameId={gameId}
        guesses={this.state.guesses}
        handleChange={this.handleChange}
        handlePress={this.handlePress}
        acrossClue={this.state.currentCell.across}
        downClue={this.state.currentCell.down}
      />
    );
  }
}
const styles = StyleSheet.create({});
