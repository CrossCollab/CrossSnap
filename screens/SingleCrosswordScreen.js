import React from "react";
import { Text, View, TouchableHighlight, Alert } from "react-native";
import axios from "axios";

const SERVER_URL = "http://" + "172.17.21.173:8080";

export default class SingleCrossword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      difficulty: "",
      size: "",
      grid: []
    };
  }
  async componentDidMount() {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/crossword/1`); //change /1 to this.props once this component is hooked up
      const { description, difficulty, size } = data;
      const { grid } = data.crosswordObjectString;
      this.setState({ description, difficulty, size, grid });
    } catch (err) {
      console.log(err);
    }
  }
  handlePress() {
    Alert.alert(
      "Touch that button again and I'm going to be mad",
      "I'm actually not joking",
      [{ text: "Don't touch that button!!!!!" }]
    );
  }
  render() {
    const { description, difficulty, size, grid } = this.state;
    return (
      <View>
        <Text>Description: {description}</Text>
        <Text>Difficulty: {difficulty}</Text>
        <Text>Size: {size}</Text>
        <TouchableHighlight
          onPress={this.handlePress}
          style={{ backgroundColor: "red" }}
        >
          <Text>Play Game</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
