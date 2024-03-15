import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import HomeScreen from './Screen/HomeScreen';
import MenuScreen from './Screen/MenuScreen';
import CartScreen from './Screen/CartScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown:false}} name="Menu" component={MenuScreen} />
        <Stack.Screen options={{headerShown:false}} name="Cart" component={CartScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const MainNavigator = () => {
  return (
    <Tab.Navigator tabBarPosition="bottom">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="QLBan" component={QLBanScreen} />
      <Tab.Screen name="QLMonAn" component={QLMonAnScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}

export default App;