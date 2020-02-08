import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { fetchUserActiveCrosswords } from "../store/userActiveCrosswords";

export class UserActiveCrosswordsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    try {
      await this.props.fetchUserActiveCrosswords(this.props.user.id);
    } catch (err) {
      console.log(err);
    }
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
              ID: {item.crosswordId}
            </Text>
            <Text style={styles.itemText}>
              {"\n"}
              Crossword Name: {item.crossword.name}
            </Text>
            <Text style={styles.itemText}>
              {"\n"}
              {item.crossword.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View>
        <TouchableOpacity>
          <Text>
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            **{this.props.user.firstName}'s active puzzles:**
          </Text>
        </TouchableOpacity>
        <FlatList
          onEndReachedThreshold={0}
          // onEndReached={({ distanceFromEnd }) => {
          //   console.debug("on end reached ", distanceFromEnd);
          // }}
          contentContainerStyle={styles.list}
          data={this.props.userActiveCrosswords}
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

const mapState = state => {
  return {
    user: state.user,
    userActiveCrosswords: state.userActiveCrosswords
  };
};

const mapDispatch = dispatch => {
  return {
    fetchUserActiveCrosswords: userid =>
      dispatch(fetchUserActiveCrosswords(userid))
  };
};

export default connect(mapState, mapDispatch)(UserActiveCrosswordsScreen);
