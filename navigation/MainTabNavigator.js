import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CrosswordScreen from "../screens/CrosswordScreen";
import SingleCrosswordScreen from "../screens/SingleCrosswordScreen";
import AuthForm from "../screens/Auth-Form";
// import createRootNavigator from "react-navigation";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

// Need to add if(userLoggedIn &&) and render user profile page if yes
const HomeStack = createStackNavigator(
  {
    Home: {
      screen: AuthForm,
      navigationOptions: {
        header: null
      }
    }
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};

HomeStack.path = "";

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: "Links",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

LinksStack.path = "";

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

SettingsStack.path = "";

const CrosswordStack = createStackNavigator(
  {
    Crossword: CrosswordScreen
  },
  config
);

CrosswordStack.navigationOptions = {
  //changed name to crossword for parallelism with others (if Mike/Murad have used this for navigation we can revert)
  tabBarLabel: "Crossword",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

CrosswordStack.path = "";

const SingleCrosswordStack = createStackNavigator(
  {
    SingleCrosswordScreen
  },
  config
);
SingleCrosswordStack.navigationOptions = {
  tabBarLabel: "SingleCrossword",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
  CrosswordStack,
  SingleCrosswordScreen
});

tabNavigator.path = "";

export default tabNavigator;
