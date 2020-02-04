import React from "react";

import { Provider } from "react-redux";
import AppNavigator from "./navigation/AppNavigator";
import store from "./store/index";
import "react-native-gesture-handler";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
