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

const SERVER_URL = "http://" + "172.17.21.173:8080";

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
    let newGameInstance = {
      crosswordId: this.state.crosswordId,
      status: "incomplete",
      answers: data.crosswordObjectString.grid
    };

    //create new gameInstance in DB
    const response = await axios.post(
      `${SERVER_URL}/api/gameInstance/`,
      newGameInstance
    );
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
      answers: data.crosswordObjectString.grid
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
              gameInstance: 3,
              userId: 4
            })
          }
        ></Button>
      </View>
    );
  }
}
LinksScreen.navigationOptions = {
  title: "Links"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
