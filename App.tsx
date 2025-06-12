import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserRegisterProvider } from './contexts/UserRegisterContext';
import { PetRegisterProvider } from './contexts/PetRegisterContext';
import { RootStackParamList } from './types';
 
// Import các màn hình
import IndexLogin from './screens/IndexLogin';
import VitualPetLogin from './screens/VirtualPetLogin';
import RegisterScreen from './screens/RegisterScreen';
import NextRegisterScreen from './screens/NextRegisterScreen';
import ChoosePetScreen from './screens/ChoosePetScreen';
import LastRegisterScreen from './screens/LastRegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ReminderScreen from './screens/ReminderScreen';
import ProgressTrackerScreen from './screens/ProgressTrackerScreen';
import DailyHealthScreen from './screens/DailyHealthScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import GoalSettingScreen from './screens/GoalSettingScreen';
import SelectFoodScreen from './screens/SelectFoodScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
 
export default function App() {
  return (
    <UserRegisterProvider>
      <PetRegisterProvider>
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
            <Stack.Screen
              name="LastRegisterScreen"
              component={LastRegisterScreen}
              options={{ title: 'ユーザー登録' }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ title: 'ホーム画面' }}
            />
            <Stack.Screen
              name="ReminderScreen"
              component={ReminderScreen}
              options={{ title: 'リマインダー' }}
            />
            <Stack.Screen
              name="ProgressTrackerScreen"
              component={ProgressTrackerScreen}
              options={{ title: '進捗トラッカー' }}
            />
            <Stack.Screen
              name="DailyHealthScreen"
              component={DailyHealthScreen}
              options={{ title: '健康管理' }}
            />
            <Stack.Screen
              name="UserProfileScreen"
              component={UserProfileScreen}
              options={{ title: 'ユーザープロフィール' }}
            />
            <Stack.Screen
              name="GoalSettingScreen"
              component={GoalSettingScreen}
              options={{ title: '目標設定画面' }}
            />
            <Stack.Screen
              name="SelectFoodScreen"
              component={SelectFoodScreen}
              options={{ title: '食品選択画面' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PetRegisterProvider>
    </UserRegisterProvider>
  );
}