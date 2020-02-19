import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import TabBarIcon from "../components/TabBarIcon";
import UserProfileScreen from "../screens/UserProfileScreen";
import CrosswordScreen from "../screens/CrosswordScreen";
import allCrosswordsScreen from "../screens/allCrosswordsScreen";
import UserActiveCrosswordsScreen from "../screens/UserActiveCrosswordsScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

////////////////////////////
////////home screen/////////
////////////////////////////
const HomeStack = createStackNavigator(
  {
    Home: {
      screen: UserProfileScreen,
      navigationOptions: {
        header: null
      }
    },
    UserActiveCrosswords: {
      screen: UserActiveCrosswordsScreen,
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

/////////////////////////////
///single crossword screen///
/////////////////////////////

const CrosswordStack = createStackNavigator(
  {
    Crossword: {
      screen: CrosswordScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  config
);

CrosswordStack.navigationOptions = {
  tabBarLabel: "Crossword",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

CrosswordStack.path = "";

////////////////////////////
///all crosswords screen////
////////////////////////////
const allCrosswordsStack = createStackNavigator(
  {
    allCrosswordsScreen: allCrosswordsScreen
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

allCrosswordsStack.path = "";

////////////////////////////
//////bottom navigator//////
////////////////////////////
const tabNavigator = createBottomTabNavigator({
  HomeStack,
  CrosswordStack,
  allCrosswordsStack
});

tabNavigator.path = "";

export default tabNavigator;
