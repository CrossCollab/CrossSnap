import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import TabBarIcon from "../components/TabBarIcon";
import UserProfileScreen from "../screens/UserProfileScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CrosswordScreen from "../screens/CrosswordScreen";
import allCrosswordsScreen from "../screens/allCrosswordsScreen";
// import createRootNavigator from "react-navigation";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

// Need to add if(userLoggedIn &&) and render user profile page if yes
const HomeStack = createStackNavigator(
  {
    Home: {
      screen: UserProfileScreen,
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

const allCrosswordsStack = createStackNavigator(
  {
    allCrosswordsScreen
  },
  config
);
allCrosswordsStack.navigationOptions = {
  tabBarLabel: "All Crosswords",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
    />
  )
};
// <ion-icon name="grid"></ion-icon>

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
  CrosswordStack,
  allCrosswordsStack
});

tabNavigator.path = "";

export default tabNavigator;
