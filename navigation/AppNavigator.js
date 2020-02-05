import { createAppContainer, createSwitchNavigator } from "react-navigation";
import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";
import { createStackNavigator } from "react-navigation-stack";
import { AsyncStorage, ActivityIndicator, StatusBar, View } from "react-native";
import React from "react";
import SignupScreen from "../screens/SignupScreen";

export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._loadData();
  }
  _loadData = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    console.log("(1=LoggedIn; 2=LoggedOut)   |  Value:", isLoggedIn);
    this.props.navigation.navigate(isLoggedIn !== "1" ? "Auth" : "Main");
  };
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const LoginStack = createStackNavigator({ Login: LoginScreen });
const SignUpStack = createStackNavigator({ SignUp: SignupScreen });
export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      AuthLoading: AuthLoadingScreen,
      Main: MainTabNavigator,
      Auth: LoginStack,
      SignUp: SignUpStack
    },
    { initialRouteName: "AuthLoading" }
  )
);
