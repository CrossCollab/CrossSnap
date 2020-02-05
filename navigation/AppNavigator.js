import { createAppContainer, createSwitchNavigator } from "react-navigation";
import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";
import { createStackNavigator } from "react-navigation-stack";
import { AsyncStorage, ActivityIndicator, StatusBar, View } from "react-native";
import React from "react";
import SignupScreen from "../screens/SignupScreen";
import { fetchUser } from "../store/user";
import { connect } from "react-redux";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";

// export class AuthLoadingScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this._loadData();
//   }
//   _loadData = async () => {
//     const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
//     const userId = await AsyncStorage.getItem('userId')
//     if(userId){
//       this.props.fetchUser(userId)
//     }
//     this.props.navigation.navigate(isLoggedIn !== "1" ? "Auth" : "Main");
//   };
//   render() {
//     return (
//       <View>
//         <ActivityIndicator />
//         <StatusBar barStyle="default" />
//       </View>
//     );
//   }
// }

// const mapDispatch = dispatch =>{
//   return {
//     fetchUser: userId => dispatch(fetchUser(userId))
//   }
// }
// export default connect(null, mapDispatch)(AuthLoadingScreen)

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
