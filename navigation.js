import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'expo';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
} from 'react-navigation';
import { Colors } from './constants';
import Home from './screens/Home/Home';


// A helper function to create tab bar icon
const createTabBarIcon = (name, focused, IconType = Icon.Ionicons) => {
  return (
    <IconType
      name={name}
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
};


/***
 * Begin stacks
 */

const HomeStack = createStackNavigator({
  Home,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (createTabBarIcon(
    Platform.OS === 'ios'
      ? `ios-information-circle${focused ? '' : '-outline'}`
      : 'md-information-circle',
    focused,
  )),
};

/***
 * End stacks
 */

const TabNavigator = createBottomTabNavigator({
  HomeStack,
  HomeStack2: HomeStack,
});

export default createAppContainer(TabNavigator);
