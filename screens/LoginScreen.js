import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import { loginUser } from "../store/user";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this._login = this._login.bind(this);
  }

  _login = async () => {
    try {
      await this.props.loginUser(this.state);
      if (this.props.user.email === this.state.email) {
        await AsyncStorage.setItem("isLoggedIn", "1");
        await AsyncStorage.setItem("userId", `${this.props.user.id}`);
        this.props.navigation.navigate("Main");
      } else {
        alert("Email or password incorrect");
      }
    } catch (err) {
      console.log(err);
    }
  };

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Login to CrossSnap</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.userButton} onPress={this._login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => this.props.navigation.navigate("SignUp")}
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
const mapDispatch = dispatch => {
  return {
    loginUser: user => dispatch(loginUser(user))
  };
};

const doesThisWork = connect(mapState, mapDispatch)(Login);
export default doesThisWork;
