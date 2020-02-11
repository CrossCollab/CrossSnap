import React from "react";
import {
  ScrollView,
  StyleSheet,
  Button,
  TextInput,
  View,
  Text
} from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import axios from "axios";
import SERVER_URL from "../serverUrl";

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crosswordId: "",
      gameInstanceId: ""
    };
  }

  handleChange = value => {
    const gameLink = value;
    this.setState({ crosswordId: gameLink });
  };

  handleGIChange = value => {
    const gameInstance = value;
    this.setState({ gameInstanceId: gameInstance });
  };

  handlePress = async value => {
    //fetch the crossword object from the database
    const { data } = await axios.get(
      `${SERVER_URL}/api/crossword/${this.state.crosswordId}`
    );
    //make a new game instance object that will be used to create one in the db
    let acrossObj = {};
    data.crosswordObjectString.clues.across.forEach((clue, index) => {
      let clueNumber = clue.split(". ")[0];
      let cluePhrase = clue.split(". ")[1];
      acrossObj[clueNumber] = cluePhrase;
    });
    let downObj = {};
    data.crosswordObjectString.clues.down.forEach((clue, index) => {
      let clueNumber = clue.split(". ")[0];
      let cluePhrase = clue.split(". ")[1];
      downObj[clueNumber] = cluePhrase;
    });
    let guessArray = data.crosswordObjectString.grid.map((answer, index) => {
      if (answer === ".") {
        return (guessObj = {
          answer: answer,
          guess: ".",
          userId: 0,
          index
        });
      }
      const findAcross = index => {
        const clueNumber = data.crosswordObjectString.gridnums[index];
        if (data.crosswordObjectString.grid[index] === ".") {
          return undefined;
        } else if (clueNumber) {
          if (!acrossObj[`${clueNumber}`]) {
            const lowerNumber = index - 1;
            return findAcross(lowerNumber);
          } else {
            return acrossObj[`${clueNumber}`];
          }
        } else {
          const lowerNumber = index - 1;
          return findAcross(lowerNumber);
        }
      };
      const tableLength = Math.sqrt(data.crosswordObjectString.gridnums.length);
      const findDown = index => {
        const clueNumber = data.crosswordObjectString.gridnums[index];
        if (data.crosswordObjectString.grid[index] === ".") {
          return undefined;
        } else if (clueNumber) {
          if (!downObj[`${clueNumber}`]) {
            const lowerNumber = index - tableLength;
            return findDown(lowerNumber);
          } else {
            return downObj[`${clueNumber}`];
          }
        } else {
          const lowerNumber = index - tableLength;
          return findDown(lowerNumber);
        }
      };
      return {
        answer: answer,
        guess: "",
        userId: 0,
        index,
        number: data.crosswordObjectString.gridnums[index],
        across: findAcross(index),
        down: findDown(index),
        color: "black"
      };
    });
    //make a new game instance object that will be used to create one in the db
    let newGameInstance = {
      crosswordId: this.state.crosswordId,
      status: "incomplete",
      answers: data.crosswordObjectString.grid,
      numbers: data.crosswordObjectString.gridnums,
      across: data.crosswordObjectString.clues.across,
      down: data.crosswordObjectString.clues.down,
      guesses: guessArray
    };
    //create new gameInstance in DB
    await axios.post(`${SERVER_URL}/api/gameInstance/`, newGameInstance);
    //route to crossword Screen with component passed in
  };

  handleJoinPress = async value => {
    //fetch the crossword object from the database
    const { data } = await axios.get(
      `${SERVER_URL}/api/crossword/${this.state.crosswordId}`
    );
    //make a new game instance object that will be used to create one in the db
    let newGameInstance = {
      crosswordId: this.state.crosswordId,
      status: "incomplete",
      answers: data.crosswordObjectString.grid,
      numbers: data.crosswordObjectString.gridnums
    };

    //create new gameInstance in DB
    const response = await axios.post(
      `${SERVER_URL}/api/gameInstance/`,
      newGameInstance
    );
    //route to crossword Screen with component passed in
  };

  render() {
    return (
      // <ScrollView style={styles.container}>
      //   {/**
      //    * Go ahead and delete ExpoLinksView and replace it with your content;
      //    * we just wanted to provide you with some helpful links.
      //    */}
      //   <ExpoLinksView />
      //   <TextInput></TextInput>
      // </ScrollView>
      <View>
        <Text>Crossword ID:</Text>
        <TextInput
          onChangeText={this.handleChange}
          style={{
            width: "90%",
            height: 50,
            backgroundColor: "lightgrey",
            paddingLeft: 20,
            paddingRight: 20,
            marginLeft: 20,
            marginRight: 20
          }}
        ></TextInput>
        <Button
          title="create game"
          style={{ width: 50, height: 50, backgroundColor: "grey" }}
          onPress={this.handlePress}
        ></Button>
        <View style={{ height: 50 }}></View>
        <Text>GameInstance ID:</Text>
        <TextInput
          onChangeText={this.handleGIChange}
          style={{
            width: "90%",
            height: 50,
            backgroundColor: "lightgrey",
            paddingLeft: 20,
            paddingRight: 20,
            marginLeft: 20,
            marginRight: 20
          }}
        ></TextInput>

        <Button
          title="join game"
          style={{ width: 50, height: 50, backgroundColor: "grey" }}
          onPress={() =>
            //on pressing join sends user to the crossword screen w/ nav props

            this.props.navigation.navigate("Crossword", {
              gameInstance: this.state.gameInstanceId,
              userId: 4
            })
          }
        ></Button>
      </View>
    );
  }
}


LinksScreen.navigationOptions = {
  title: "Links",
  headerStyle: {
    backgroundColor: "rgb(0, 0, 102)"
  },
  headerTitleStyle: {
    color: "white"
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});

/////////////////////////////////
// Links is currently hard-coded
/////////////////////////////////
