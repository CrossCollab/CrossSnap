import React from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  Flatlist,
  TextInput,
  Dimensions,
  ScrollView
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fetchUserActiveCrosswords } from "../store/userActiveCrosswords";
import { connect } from "react-redux";
import { fetchUser } from "../store/user";
import { joinGame } from "../store/userActiveCrosswords";

class UserProfileScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      gameInstanceId: "",
      isReady: false
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        this.props.fetchUser(userId);
      }
      await this.props.fetchUserActiveCrosswords(userId);
      this.setState({
        isReady: true
      });
    } catch (err) {
      console.log(err);
    }
  }

  async handlePress() {
    try {
      const message = {
        userId: this.props.user.id,
        gameInstanceId: this.state.gameInstanceId
      };

      this.props.joinGame(message);
      console.log("attempting to join game: ", this.state.gameInstanceId);

      this.props.navigation.navigate("Crossword", {
        gameInstance: this.state.gameInstanceId
      });
    } catch (err) {
      console.log(err);
    }
  }

  async handleLogout() {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  }

  render() {
    let dimensions = Dimensions.get("window");
    let gameHeight = Math.round((dimensions.width * 9) / 16);
    let gameWidth = dimensions.width;

    if (this.state.isReady) {
      return (
        <View style={styles.container}>
          <View style={{ height: "10%" }}></View>

          <Text style={styles.headerText}>
            Welcome, {this.props.user.firstName}
          </Text>
          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={this.handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <View style={{ height: "12%" }}></View>

          {/* START A NEW GAME */}
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            Start A New Game:
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("allCrosswordsScreen")
            }
          >
            <View style={{ backgroundColor: "" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "black",
                  backgroundColor: "#c1ebb2",
                  padding: 10,
                  borderRadius: 8,
                  width: "100%"
                }}
              >
                View All Crosswords
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ height: "12%" }}></View>

          {/* JOIN A FRIEND */}
          <View>
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              Join A Friend's Game:
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Friend's Game ID"
            onChangeText={id => this.setState({ gameInstanceId: id })}
            value={this.state.gameInstanceId}
          />
          <View style={{ backgroundColor: "" }}>
            <TouchableOpacity onPress={this.handlePress}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "black",
                  backgroundColor: "#c1ebb2",
                  padding: 10,
                  borderRadius: 8,
                  width: "100%"
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: "12%" }}></View>

          {/* VIEW ACTIVE CROSSWORDS */}
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            My Active Crosswords:
          </Text>
          <View style={{ height: "0%" }}></View>

          <View>
            <ScrollView horizontal={true}>
              {this.props && this.props.userActiveCrosswords.length ? (
                this.props.userActiveCrosswords.map((crossword, index) => {
                  // console.log("crossword id = ", crossword.id);
                  return (
                    <View
                      key={index}
                      style={{
                        margin: 5,
                        backgroundColor: "#c1ebb2",
                        height: gameHeight * 0.6,
                        width: gameWidth / 3,
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        margin: 3,
                        borderRadius: 10
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("Crossword", {
                            gameInstance: crossword.id
                          })
                        }
                      >
                        <Text
                          style={{
                            color: "black",
                            alignSelf: "center",
                            fontWeight: "bold",
                            fontSize: 17
                          }}
                        >
                          {crossword.crossword.name}
                        </Text>
                        <Text
                          style={{ color: "black", alignSelf: "flex-start" }}
                        >
                          {"\n"}
                          Size: {crossword.crossword.size}
                        </Text>
                        <Text
                          style={{ color: "black", alignSelf: "flex-start" }}
                        >
                          {"\n"}
                          Difficulty: {crossword.crossword.difficulty}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <Text>'No Active Crosswords'</Text>
              )}
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return <Text>LOADING</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "gray",
    paddingBottom: "20%"
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 35,
    color: "white",
    fontStyle: "italic"
  },
  headerButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  logoutButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold"
  },
  logoutButton: {
    width: "40%",
    padding: 5
  },
  input: {
    width: "40%",
    backgroundColor: "#fff",
    padding: 5,
    marginBottom: 10,
    borderRadius: 10
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
      dispatch(fetchUserActiveCrosswords(userid)),
    fetchUser: userId => dispatch(fetchUser(userId)),
    joinGame: info => dispatch(joinGame(info))
  };
};

export default connect(mapState, mapDispatch)(UserProfileScreen);
