import * as React from "react";
import UserProfile from "./UserProfile";
import CrosswordScreen from "./CrosswordScreen";
import Signup from "./Signup";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  ActivityIndicator,
  StatusBar
} from "react-native";

const userInfo = { username: "admin", password: "123" };

export class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };

    this._login = this._login.bind(this);
    this._loadData = this._loadData.bind(this);
  }

  _login = async () => {
    if (
      userInfo.username === this.state.username &&
      userInfo.password === this.state.password
    ) {
      await AsyncStorage.setItem("isLoggedIn", "1");
      this.props.navigation.navigate("UserProfile");
    } else {
      alert("Username or password incorrect");
    }
  };

  _loadData = async () => {
    const isLoggedIn = await AsyncStorage.getItem(isLoggedIn);
    this.props.navigation.navigate(isLoggedIn !== "1" ? "Auth" : "App");
  };

  static navigationOptions = {
    header: null
  };

  render() {
    console.log("PROPS", this.props);

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Login to CrossSnap</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
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
          <TouchableOpacity
            style={styles.userButton}
            // onPress={() => this.props.navigation.navigate("UserProfile")}
            onPress={this._login}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => this.props.navigation.navigate("Signup")}
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

// ROOTSTACK: navigation
const RootStack = createStackNavigator({
  Home: {
    screen: AuthForm
  },
  // Home page is login form; redirect post-login to authenticated home screen will be automatic for returning users
  Signup: {
    screen: Signup
  },
  UserProfile: {
    screen: UserProfile
  }
});

// AUTHSTACK: redirect to login screen upon hitting wrong credentials
const AuthStack = createStackNavigator({ Home: AuthForm });

// AUTH LOADING SCREEN: set to initial route name because we will fetch our authentication state from persistent storage inside of that screen component
export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._loadData();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

// SWITCH NAVIGATOR: https://reactnavigation.org/docs/en/auth-flow.html
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: RootStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
