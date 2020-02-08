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
  TextInput,
  Keyboard
} from "react-native";
import CWCell from "../components/CWCell";
import CWRow from "../components/CWRow";
import CWTable from "../components/CWTable";
import CWGameWrapper from "../components/CWGameWrapper";
import axios from "axios";
import { MonoText } from "../components/StyledText";
import io from "socket.io-client";
import Confetti from "../components/Confetti";

export default class CrosswordTable extends React.Component {
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
      columnLength: 0,
      direction: "forward",
      gridNums: []
    };

    //bind these functions so child components can call them in OG context
    this.handleChange = this.handleChange.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.changeHelper = this.changeHelper.bind(this);
    this.checkBoard = this.checkBoard.bind(this);
    this.traverse = this.traverse.bind(this);
    this.swapView = this.swapView.bind(this);
    this.findNextClue = this.findNextClue.bind(this);
    this.findPreviousClue = this.findPreviousClue.bind(this);
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
        columnLength: Math.sqrt(data.answers.length),
        gridNums: data.numbers
      });
      //set up a client-side socket
      this.socket = io(`${SERVER_URL}`);

      function onConnect() {
        console.log("joined socket");
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
        // console.log("updating state from socket");
        this.setState({ guesses: msg });
      });
    } catch (err) {
      // console.err(err);
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
    //if backspace is pressed
    if (letter.nativeEvent.key === "Backspace") {
      this.setState({ direction: "backwards" });

      //if the cell is not empty, just delete the value
      if (this.state.guesses[idx].guess !== "") {
        const allGuesses = JSON.parse(JSON.stringify(this.state.guesses));
        allGuesses[idx].guess = "";
        this.setState({ guesses: allGuesses }, this.changeHelper);
      } else {
        //if the cell was empty just move back
        this.traverse(idx, letter);
      }
    } else {
      this.setState({ direction: "forward" });
      this.traverse(idx, letter);
      const allGuesses = JSON.parse(JSON.stringify(this.state.guesses));
      allGuesses[idx].guess = letter.nativeEvent.key;
      this.setState({ guesses: allGuesses }, this.changeHelper);
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
  changeHelper() {
    let socketMsg = {
      guesses: this.state.guesses,
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

  findNextClue() {
    //find the index
    if (this.state.currentView === "across") {
      let nextIndex = this.state.guesses.findIndex(
        guess =>
          guess.index > this.state.currentCell.index &&
          guess.across !== this.state.currentCell.across
      );
      console.log("next index", nextIndex);
      if (nextIndex !== -1) {
        this.state.refs[nextIndex].current.focus();
      } else {
        this.state.refs[0].current.focus();
      }
    } else {
      //get the clue number of the current cell
      //if it is 0, traverse upwards until you hit a grid number
      //if it is not zero you have it
      //once you have your current clue's down clue number (complicated)
      //find the location of the next clue number in the this.state.gridNums array
      //set the focus on that index
      let startingDownClue = this.state.currentCell.down;
      let indexOfDownClueStart;
      for (let i = 0; i < this.state.answers.length; i++) {
        if (this.state.guesses[i].down == startingDownClue) {
          indexOfDownClueStart = i;
          break;
        }
      }
      let startingDownClueNum = this.state.gridNums[indexOfDownClueStart];
      console.log("clue num = ", startingDownClueNum);
      let j = 1;
      while (j < this.state.answers.length) {
        let indexOfNextDownClue = this.state.gridNums.findIndex(
          clueNum => clueNum === startingDownClueNum + j
        );

        this.state.refs[indexOfNextDownClue].current.focus();
        break;
      }
    }
  }

  findPreviousClue() {
    if (this.state.currentView === "across") {
      for (let i = this.state.currentCell.index - 1; i >= 0; i--) {
        //looping through all the cells, starting with the previous, going backwards
        let thisGuess = this.state.guesses[i];
        //if it's a blank cell skip it
        if (thisGuess.answer === ".") {
          continue;
        }
        //if the current cell's across clue is different from the one we started from, you've found the last letter of a new across clue
        if (thisGuess.across !== this.state.currentCell.across) {
          //found the current previous cell
          let newAcrossClue = thisGuess.across;
          //find the first instance of that across clue in the guesses array
          for (let k = 0; k < this.state.guesses.length; k++) {
            if (this.state.guesses[k].across === newAcrossClue) {
              this.state.refs[k].current.focus();
              break;
            }
          }
          break;
        } else {
          this.state.refs[this.state.answers.length - 1].current.focus();
        }
      }
    } else {
      console.log("current view is down");
    }
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
    if (this.state.confetti) {
      return <Confetti />;
    } else {
      return (
        <CWGameWrapper
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
          findNextClue={this.findNextClue}
          findPreviousClue={this.findPreviousClue}
        />
      );
    }
  }
}
const styles = StyleSheet.create({});
