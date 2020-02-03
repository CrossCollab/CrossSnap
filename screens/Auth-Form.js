import * as React from "react";
import AuthHomeScreen from "./AuthHomeScreen";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native";

// const SERVER_URL = "http://" + "172.17.23.241:8080";

class AuthForm extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Login to CrossSnap</Text>
        <TextInput style={styles.input} placeholder="Username" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => this.props.navigation.navigate("HomeScreen")}
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

const RootStack = createStackNavigator(
  {
    Home: AuthForm,
    HomeScreen: { screen: AuthHomeScreen }
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
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
