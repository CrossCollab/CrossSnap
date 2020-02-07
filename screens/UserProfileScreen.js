import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";

class UserProfileScreen extends React.Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }

  // async componentDidMount() {
  //   const userId = await AsyncStorage.getItem("userId");
  //   console.log("userId", userId);
  // }

  static navigationOptions = {
    header: null
  };

  async handleLogout() {
    // await AsyncStorage.setItem("isLoggedIn", );
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeContainer}>
          Welcome testing testing, {this.props.user.firstName}
        </Text>
        <TouchableOpacity style={styles.userButton} onPress={this.handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userButton}
          onPress={() => this.props.navigation.navigate("UserActiveCrosswords")}
        >
          <Text style={styles.buttonText}>My active crosswords button</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 102)"
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%"
  },
  userButton: {
    backgroundColor: "#00CED1",
    padding: 10,
    width: "45%"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "white"
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: "white"
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10
  }
});

const mapState = state => {
  return { user: state.user };
};

export default connect(mapState)(UserProfileScreen);
