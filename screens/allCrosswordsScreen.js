import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import { fetchCrosswords } from "../store/allCrosswords";
import { TouchableOpacity } from "react-native-gesture-handler";

export class allCrosswordsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handlePress = this.handlePress.bind(this);
  }

  renderItem({ item, index }) {
    return (
      <TouchableOpacity>
        <View
          style={{
            borderRadius: 10,
            flex: 1,
            margin: 5,
            minWidth: 120,
            maxWidth: 120,
            height: 120,
            maxHeight: 120,
            backgroundColor: "rgb(169, 169, 169)"
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              margin: 1
            }}
          >
            <Text style={styles.itemText}>
              {"\n"}
              ID: {item.id}
            </Text>
            <Text style={styles.itemText}>
              {"\n"}
              Crossword Name: {item.name}
            </Text>
            <Text style={styles.itemText}>
              {"\n"}
              {item.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    try {
      this.props.fetchCrosswords();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.handlePress}>
          <Text>**Hi, Click here to test TouchableOpacity**</Text>
          <Text>
            ***Don't forget a filter box here to allow users to view crosswords
            based on selected criteria***
          </Text>
        </TouchableOpacity>
        <FlatList
          onEndReachedThreshold={0}
          // onEndReached={({ distanceFromEnd }) => {
          //   console.debug("on end reached ", distanceFromEnd);
          // }}
          contentContainerStyle={styles.list}
          data={this.props.crosswords}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  itemText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

allCrosswordsScreen.navigationOptions = {
  title: "All Crosswords"
};

// Remove yellow warning box
console.disableYellowBox = true;

const mapState = state => {
  return {
    crosswords: state.crosswords
  };
};

const mapDispatch = dispatch => {
  return {
    fetchCrosswords: () => dispatch(fetchCrosswords())
  };
};

export default connect(mapState, mapDispatch)(allCrosswordsScreen);
