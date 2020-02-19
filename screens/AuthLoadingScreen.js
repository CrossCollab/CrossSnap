import { AsyncStorage, ActivityIndicator, StatusBar, View } from "react-native";
import React from "react";
import { fetchUser } from "../store/user";
import { connect } from "react-redux";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._loadData();
  }
  /**
   * loadData
   * When user first navigates to the app, get AsyncData from them, if it exists.
   * Make a database call with userId and set user information in redux store so it can be used throughout app
   * isLoggedIn and userId are both set in AsyncStorage when users are first signed up or
   * logged in. The AsyncStorage is deleted when users signout.
   */

  _loadData = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      this.props.fetchUser(userId);
    }
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

const mapDispatch = dispatch => {
  return {
    fetchUser: userId => dispatch(fetchUser(userId))
  };
};
export default connect(null, mapDispatch)(AuthLoadingScreen);
