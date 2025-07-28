import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation';
import { store } from './store';
import { navigationRef } from './navigation/navigationService';
import { seedRestaurants } from './utils/firestoreSeed';
// seedRestaurants();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
