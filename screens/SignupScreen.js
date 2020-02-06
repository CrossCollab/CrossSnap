import React from "react";
import UserProfileScreen from "./UserProfileScreen";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { createUser } from "../store/user";

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "sample",
      lastName: "shample",
      password: "212",
      email: "sampleSHAMPLE@gmail.com"
    };

    this.submitNewUser = this.submitNewUser.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  async submitNewUser() {
    await this.props.createUser(this.state);
    if (this.props.user.id) {
      AsyncStorage.setItem("userId", this.props.user.id);
      this.props.navigation.navigate("Main");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Sign up to join the CrossSnap community!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={firstName => this.setState({ firstName })}
          value={this.state.firstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={lastName => this.setState({ lastName })}
          value={this.state.lastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.userButton}
            onPress={this.submitNewUser}
          >
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "center",
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
    fontSize: 20,
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
  return {
    user: state.user,
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    createUser: user => dispatch(createUser(user))
  };
};

export default connect(mapState, mapDispatch)(SignupScreen);
