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
      screen: UserActiveCrosswordsScreen
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
////////links screen/////////
/////////////////////////////
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

////////////////////////////
//////settings screen///////
////////////////////////////
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

allCrosswordsStack.path = "";

//////////////////////////////////////////
//user-specific active crosswords screen//
//////////////////////////////////////////
// const UserActiveCrosswordsStack = createStackNavigator(
//   {
//     UserActiveCrosswordsScreen
//   },
//   config
// );
// UserActiveCrosswordsStack.navigationOptions = {
//   tabBarLabel: "Active Crosswords",
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
//     />
//   )
// };
// UserActiveCrosswordsStack.path = "";

////////////////////////////
//////bottom navigator//////
////////////////////////////
const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
  CrosswordStack,
  allCrosswordsStack
  // UserActiveCrosswordsStack
});

tabNavigator.path = "";

export default tabNavigator;
