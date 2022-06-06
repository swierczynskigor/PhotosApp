import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import S1 from "./components/S1"
import S2 from "./components/S2"
import ViewImage from './components/ViewImage';
import CameraView from './components/CameraView';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home Page"
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#723FF2', height: 10,
            },
            headerTitleStyle: {
              fontWeight: 'bold', color: '#fff'
            },
          }}
          component={S1} />
        <Stack.Screen
          name="Gallery"
          options={{
            headerStyle: {
              backgroundColor: '#723FF2', height: 10,
            },
            headerTitleStyle: {
              fontWeight: 'bold', color: '#fff'
            },
          }}
          component={S2} />
        <Stack.Screen
          name="Image"
          options={{
            headerStyle: {
              backgroundColor: '#723FF2', height: 10,
            },
            headerTitleStyle: {
              fontWeight: 'bold', color: '#fff'
            },
          }}
          component={ViewImage} />
        <Stack.Screen
          name="Camera"
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#723FF2', height: 10,
            },
            headerTitleStyle: {
              fontWeight: 'bold', color: '#fff'
            },
          }}
          component={CameraView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
