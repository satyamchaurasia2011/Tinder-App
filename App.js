import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { LogBox } from 'react-native';
import {AuthProvider} from './hooks/useAuth';
import StackNavigator from './StackNavigator';
export default function App() {
  LogBox.ignoreAllLogs();
  return (
    <NavigationContainer>
      {/* HOC - Higher Order Component */}
      <AuthProvider>
        {/* Passes down the cool auth stuff to children... */}
         <StackNavigator/>
      </AuthProvider> 
    </NavigationContainer>
  );
}

