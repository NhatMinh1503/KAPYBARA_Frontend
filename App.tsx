import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import IndexLogin from './screens/IndexLogin';
import VitualPetLogin from './screens/VirtualPetLogin';
import RegisterScreen from './screens/RegisterScreen';
import NextRegisterScreen from './screens/NextRegisterScreen';
import ChoosePetScreen from './screens/ChoosePetScreen';


// Định nghĩa kiểu param list cho stack navigator
export type RootStackParamList = {
  IndexLogin: undefined;
  VitualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen:undefined;
  ChoosePetScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IndexLogin">
        <Stack.Screen
          name="IndexLogin"
          component={IndexLogin}
          options={{ title: 'ようこそ' }}
        />
        <Stack.Screen
          name="VitualPetLogin"
          component={VitualPetLogin}
          options={{ title: 'ログイン' }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: 'ユーザー登録' }}
        />
        <Stack.Screen
          name="NextRegisterScreen"
          component={NextRegisterScreen}
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