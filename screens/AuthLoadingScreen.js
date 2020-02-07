import { AsyncStorage, ActivityIndicator, StatusBar, View } from "react-native";
import React from "react";
import { fetchUser } from "../store/user";
import { connect } from "react-redux";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._loadData();
  }
  _loadData = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    const userId = await AsyncStorage.getItem("userId");
    console.log("userId", userId);
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
