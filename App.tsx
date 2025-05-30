import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import RegisterScreen from './screens/RegisterScreen';
import ChoosePetScreen from './screens/ChoosePetScreen'; 

// Định nghĩa kiểu param list cho stack navigator
export type RootStackParamList = {
  RegisterScreen: undefined;
  ChoosePetScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RegisterScreen">
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: 'ユーザー登録' }}
        />
        <Stack.Screen
          name="ChoosePetScreen"
          component={ChoosePetScreen}
          options={{ title: 'ペット選択' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}