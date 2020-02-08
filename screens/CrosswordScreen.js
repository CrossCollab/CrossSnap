import * as WebBrowser from "expo-web-browser";
import React from "react";
import SERVER_URL from "../serverUrl";
import { connect } from "react-redux";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard
} from "react-native";
import { Toast } from "native-base";
import CWCell from "../components/CWCell";
import CWRow from "../components/CWRow";
import CWTable from "../components/CWTable";
import CWGameWrapper from "../components/CWGameWrapper";
import axios from "axios";
import { MonoText } from "../components/StyledText";
import io from "socket.io-client";
import Confetti from "../components/Confetti";

class CrosswordTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      guesses: [],
      isReady: false,
      currentCell: {},
      gameId: 0,
      currentView: "across",
      confetti: false,
      refs: [],
      userId: 0,
      columnLength: 0,
      direction: "forward",
      currentPlayers: []
    };

    //bind these functions so child components can call them in OG context
    this.handleChange = this.handleChange.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.changeHelper = this.changeHelper.bind(this);
    this.checkBoard = this.checkBoard.bind(this);
    this.traverse = this.traverse.bind(this);
    this.swapView = this.swapView.bind(this);
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
        gameId,
        userName: this.props.user.firstName,
        columnLength: Math.sqrt(data.answers.length)
      });
      const userName = this.state.userName;
      const guesses = this.state.guesses;
      //set up a client-side socket
      this.socket = io(`${SERVER_URL}`);

      function onConnect() {
        //this.emit rather than this.socket.emit because the socket is already the this object
        //as it's being called inside this.socket.on
        this.emit("join", { gameId, userName, guesses });
      }

      //once the socket receives the connect message from the server-side, ask to join the
      //room with the id matching the gameId
      this.socket.on("connect", onConnect);

      //NEED TO ADD SOMETHING PULLING IN THE CURRENT ROOM STATE FOR A NEW PLAYER ADDITION?

      //when the client receives a message from server socket of change puzzle,
      //update the state of the guesses array
      this.socket.on("new player", info => {
        const { userName, users } = info;
        Toast.show({
          text: `${userName} has entered the game!`
        });
        this.setState({ currentPlayers: users });
      });
      this.socket.on("change puzzle", msg => {
        const allGuesses = JSON.parse(JSON.stringify(this.state.guesses));
        console.log("msg.gues in socketChange", msg);
        allGuesses[msg.index].guess = msg.guess;
        allGuesses[msg.index].color = msg.color;
        this.setState({ guesses: allGuesses });
      });
    } catch (err) {
      console.err(err);
    }

    let references = Array(this.state.answers.length)
      .fill(0)
      .map(() => React.createRef());

    this.setState({ refs: references });

    //build the column traversal order
    //for example w/ a 3x3 grid it would be [0, 3, 6, 1, 4, 7, 2, 5, 8]
  }

  //whenever the client changes the value of a crossword square, copy the guesses obj
  //update the value of the appropo letter, update state
  //kind of confusing b/c this is handling both traversal and game updates, ideally should be split up
  handleChange = idx => letter => {
    this.traverse(idx, letter);
    const allGuesses = JSON.parse(JSON.stringify(this.state.guesses));
    //if backspace is pressed
    if (letter.nativeEvent.key === "Backspace") {
      this.setState({ direction: "backwards" });
      //if the cell was already empty (don't need to update game state)
      if (allGuesses[idx].guess === "") {
        // this.traverse(idx, letter);
      } else {
        allGuesses[idx].guess = "";
        allGuesses[idx].userId = this.props.user.id;
        const cell = allGuesses[idx];
        this.setState(
          { guesses: allGuesses }
          // this.changeHelper
        );
        this.changeHelper(cell);
        // this.traverse(idx, letter);
      }
    } else {
      this.setState({ direction: "forward" });
      allGuesses[idx].guess = letter.nativeEvent.key;
      allGuesses[idx].color = this.props.user.textColor;
      allGuesses[idx].userId = this.props.user.id;
      const cell = allGuesses[idx];
      this.setState(
        { guesses: allGuesses }
        // this.changeHelper
      );
      this.changeHelper(cell);
      // this.traverse(idx, letter);
    }
  };

  traverse(idx, letter) {
    //if the key is delete, move backwards, else move forwards
    if (letter.nativeEvent.key === "Backspace") {
      if (this.state.currentView === "across") {
        //in case we go off board (top left)
        if (idx - 1 === -1) {
          this.state.refs[this.state.answers.length - 1].current.focus();
        } else {
          this.state.refs[idx - 1].current.focus();
        }
      } else {
        if (idx - this.state.columnLength < 0) {
          //in case we go off top
          this.state.refs[
            this.state.answers.length - (1 + this.state.columnLength - idx)
          ].current.focus();
        } else {
          this.state.refs[idx - this.state.columnLength].current.focus();
        }
      }
    } else {
      //if it's any other letter, move forward
      if (this.state.currentView === "across") {
        if (idx + 1 >= this.state.answers.length) {
          //in case we go off board (bottom right)
          this.state.refs[0].current.focus();
        } else {
          this.state.refs[idx + 1].current.focus();
        }
      } else {
        if (idx + this.state.columnLength >= this.state.answers.length) {
          this.state.refs[
            1 + idx + this.state.columnLength - this.state.answers.length
          ].current.focus();
        } else {
          this.state.refs[idx + this.state.columnLength].current.focus();
        }
      }
    }
  }

  //this function sends a message to the socket with the current state and roomId
  changeHelper(cell) {
    let socketMsg = {
      // guesses: this.state.guesses,
      cell,
      room: this.state.gameId
    };
    this.socket.emit("change puzzle", socketMsg);
  }

  swapView() {
    if (this.state.currentView === "across") {
      this.setState({ currentView: "down" });
    } else {
      this.setState({ currentView: "across" });
    }
  }

  handlePress(cell) {
    this.setState({ currentCell: cell });
    if (cell.index === this.state.currentCell.index) {
      if (this.state.currentView === "across") {
        this.setState({ currentView: "down" });
      } else {
        this.setState({ currentView: "across" });
      }
    }
  }
  checkBoard() {
    const checkedGuesses = this.state.guesses.map(guess => {
      if (guess.guess === guess.answer) {
        return { ...guess, correct: true };
      } else {
        return guess;
      }
    });
    this.setState({ guesses: checkedGuesses }, this.checkBoardHelper);

    let isThisAllCorrect = true;
    this.state.guesses.forEach(guess => {
      if (guess.guess !== guess.answer) {
        isThisAllCorrect = false;
      }
    });
    if (isThisAllCorrect) {
      this.setState({ confetti: true });
    }
  }
  async checkBoardHelper() {
    await axios.put(`${SERVER_URL}/api/gameInstance/${this.state.gameId}`, {
      guesses: this.state.guesses
    });
  }

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
    if (this.state.confetti) {
      return <Confetti />;
    } else {
      return (
        <CWGameWrapper
          currentUsers={this.state.currentUsers}
          gameId={gameId}
          guesses={this.state.guesses}
          handleChange={this.handleChange}
          handlePress={this.handlePress}
          acrossClue={this.state.currentCell.across}
          downClue={this.state.currentCell.down}
          currentCell={this.state.currentCell}
          currentView={this.state.currentView}
          checkBoard={this.checkBoard}
          refs={this.state.refs}
          traverse={this.traverse}
          direction={this.state.direction}
          columnLength={this.state.columnLength}
          swapView={this.swapView}
        />
      );
    }
  }
}
const mapState = state => {
  return { user: state.user };
};
export default connect(mapState)(CrosswordTable);
