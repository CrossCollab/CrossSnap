import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Picker, Button } from "react-native";
import { connect } from "react-redux";
import { fetchCrosswords } from "../store/allCrosswords";
import { TouchableOpacity } from "react-native-gesture-handler";
import SERVER_URL from "../serverUrl";
import axios from "axios";

export class allCrosswordsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "",
      difficulty: "",
      crosswordId: "",
      gameInstanceId: ""
    };

    this.handleChangeDifficulty = this.handleChangeDifficulty.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
    this.createAndJoin = this.createAndJoin.bind(this);
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

  // Creates a new game inside the database
  async createAndJoin(value) {
    //fetch the crossword object from the database
    const { data } = await axios.get(`${SERVER_URL}/api/crossword/${value}`);
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
      crosswordId: value,
      status: "incomplete",
      answers: data.crosswordObjectString.grid,
      numbers: data.crosswordObjectString.gridnums,
      across: data.crosswordObjectString.clues.across,
      down: data.crosswordObjectString.clues.down,
      guesses: guessArray,
      user: this.props.user.id
    };
    //create new gameInstance in DB
    const response = await axios.post(`${SERVER_URL}/api/gameInstance/`, {
      newGameInstance,
      userId: this.props.user.id
    });

    const crosswordInstance = response.data;
    // return createGame.id;
    //route to crossword Screen with component passed in

    this.props.navigation.navigate("Crossword", {
      gameInstance: crosswordInstance.id
    });
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.createAndJoin(item.id)}>
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
            <Text style={styles.itemText}>ID: {item.id}</Text>
            <Text style={styles.itemText}>Date: {item.date}</Text>
            <Text style={styles.itemText}>Difficulty: {item.difficulty}</Text>
            <Text style={styles.itemText}>Size: {item.size}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
  title: "All Available Crosswords",
  headerStyle: {
    backgroundColor: "rgb(0, 0, 102)"
  },
  headerTitleStyle: {
    color: "white"
  }
};

// Remove yellow warning box
console.disableYellowBox = true;

const mapState = state => {
  return {
    crosswords: state.crosswords,
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    fetchCrosswords: () => dispatch(fetchCrosswords())
  };
};

export default connect(mapState, mapDispatch)(allCrosswordsScreen);
