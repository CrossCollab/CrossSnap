import * as React from "react";
import HomeScreen from "./HomeScreen";
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

// const SERVER_URL = "http://" + "172.17.23.241:8080";

const userInfo = { username: "admin", password: "123" };

export class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  _login = async () => {
    if (
      userInfo.username === this.state.username &&
      userInfo.password === this.state.password
    ) {
      await AsyncStorage.setItem("isLoggedIn", "1");
      this.props.navigation.navigate("HomeScreen");
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
    // console.log("STATE", this.state);
    console.log("PROPS", this.props);
    console.log("Navigation", this.props.navigation.navigate);

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
            // onPress={() => this.props.navigation.navigate("HomeScreen")}
            onPress={this._login}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => this.props.navigation.navigate("HomeScreen")}
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

const RootStack = createStackNavigator(
  {
    Home: {
      screen: AuthForm
    },
    HomeScreen: {
      screen: HomeScreen
    }
  }
  // {
  //   initialRouteName: "Home"
  // }
);

// AUTH STACK BELOW:
const AuthStack = createStackNavigator({ Home: HomeScreen });

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

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

// export default createAppContainer(
//   createSwitchNavigator(
//     {
//       AuthLoading: AuthLoadingScreen,
//       App: RootStack,
//       Auth: AuthStack
//     },
//     {
//       initialRouteName: "AuthLoading"
//     }
//   )
// );
