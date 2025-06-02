import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserRegisterProvider } from './contexts/UserRegisterContext';

// Import các màn hình
import IndexLogin from './screens/IndexLogin';
import VitualPetLogin from './screens/VirtualPetLogin';
import RegisterScreen from './screens/RegisterScreen';
import ChoosePetScreen from './screens/ChoosePetScreen';
import HomeScreen from './screens/HomeScreen';

// Định nghĩa kiểu param list cho stack navigator
export type RootStackParamList = {
  IndexLogin: undefined;
  VitualPetLogin: undefined;
  RegisterScreen: undefined;
  ChoosePetScreen: undefined;
  HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserRegisterProvider>
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
            name="ChoosePetScreen"
            component={ChoosePetScreen}
            options={{ title: 'ペット選択' }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'ホーム画面' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
     </UserRegisterProvider>
  );
}