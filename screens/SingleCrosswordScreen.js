import React from "react";
import { Text, View, TouchableHighlight, Alert } from "react-native";
import axios from "axios";
import { connect } from "react-redux";
import { setCrossword } from "../store/crossword";

class SingleCrossword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      difficulty: "",
      size: "",
      grid: [],
      date: "",
      theme: ""
    };
  }
  componentDidMount() {
    try {
      this.props.setCrossword(1);
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
    const {
      description,
      difficulty,
      size,
      grid,
      date,
      theme
    } = this.props.crossword;
    return (
      <View>
        <Text>Description: {description}</Text>
        <Text>Difficulty: {difficulty}</Text>
        <Text>Size: {size}</Text>
        <Text>Date: {date}</Text>
        <Text>Theme: {theme}</Text>
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
const mapState = state => {
  return {
    crossword: state.crossword
  };
};
const mapDispatch = dispatch => {
  return {
    setCrossword: id => dispatch(setCrossword(id))
  };
};

export default connect(mapState, mapDispatch)(SingleCrossword);
