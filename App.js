import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileSetup from './ProfileSetup';
import Dashboard from './Dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Setup">
        <Stack.Screen name="Setup" component={ProfileSetup} options={{ title: 'Create Profile' }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Your Vibe' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}