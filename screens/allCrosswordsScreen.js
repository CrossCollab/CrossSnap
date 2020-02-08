import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Picker } from "react-native";
import { connect } from "react-redux";
import { fetchCrosswords } from "../store/allCrosswords";
import { TouchableOpacity } from "react-native-gesture-handler";

export class allCrosswordsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "",
      difficulty: ""
    };
    this.handleChangeDifficulty = this.handleChangeDifficulty.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
  }

  handleChangeSize(size) {
    if (size !== 0) {
      this.setState({
        size: size
      });
    }
  }

  handleChangeDifficulty(difficulty) {
    if (difficulty !== 0) {
      this.setState({
        difficulty: difficulty
      });
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
            backgroundColor: "rgb(51, 153, 255)"
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flex: 1,
              margin: 1
            }}
          >
            <Text style={styles.itemText}>Name: {item.name}</Text>
            <Text style={styles.itemText}>Date: {item.date}</Text>
            <Text style={styles.itemText}>Difficulty: {item.difficulty}</Text>
            <Text style={styles.itemText}>Size: {item.size}</Text>
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
    let filteredData = this.props.crosswords;

    if (this.state.size !== "all" && this.state.size !== "") {
      filteredData = this.props.crosswords.filter(
        elem => elem.size === this.state.size
      );
    }

    if (this.state.difficulty !== "all" && this.state.difficulty !== "") {
      filteredData = filteredData.filter(
        elem => elem.difficulty === this.state.difficulty
      );
    }

    return (
      <View>
        <Picker
          selectedValue={this.state.size}
          onValueChange={this.handleChangeSize}
          itemStyle={{ color: "white" }}
        >
          <Picker.Item label="Size" value="0" color="grey" />
          <Picker.Item label={"all"} value={"all"} color={"black"} />
          <Picker.Item label={"small"} value={"small"} color={"green"} />
          <Picker.Item label={"medium"} value={"medium"} color={"blue"} />
          <Picker.Item label={"big"} value={"big"} color={"red"} />
        </Picker>

        <Picker
          selectedValue={this.state.difficulty}
          onValueChange={this.handleChangeDifficulty}
          itemStyle={{ color: "white" }}
        >
          <Picker.Item label="Difficulty" value="0" color="grey" />
          <Picker.Item label={"all"} value={"all"} color={"black"} />
          <Picker.Item label={"easy"} value={"easy"} color={"green"} />
          <Picker.Item label={"medium"} value={"medium"} color={"blue"} />
          <Picker.Item label={"hard"} value={"hard"} color={"red"} />
        </Picker>
        <FlatList
          onEndReachedThreshold={0}
          contentContainerStyle={styles.list}
          data={filteredData}
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
    fontWeight: "bold"
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
