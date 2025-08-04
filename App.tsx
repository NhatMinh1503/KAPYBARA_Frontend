// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'expo-dev-client';
import { PetRegisterProvider } from './contexts/PetRegisterContext';
import { UserRegisterProvider } from './contexts/UserRegisterContext';
import { RootStackParamList } from './types';


// Import các màn hình
import ChoosePetScreen from './app/ChoosePetScreen';
import DailyHealthScreen from './app/DailyHealthScreen';
import ForgotPasswordScreen from './app/ForgotPasswordScreen';
import GoalSettingScreen from './app/GoalSettingScreen';
import HomeScreen from './app/HomeScreen';
import IndexLogin from './app/IndexLogin';
import LastRegisterScreen from './app/LastRegisterScreen';
import NextRegisterScreen from './app/NextRegisterScreen';
import ProgressTrackerScreen from './app/ProgressTrackerScreen';
import RegisterScreen from './app/RegisterScreen';
import ReminderScreen from './app/ReminderScreen';
import ResetPasswordScreen from './app/ResetPasswordScreen';
import SelectFoodScreen from './app/SelectFoodScreen';
import UserProfileScreen from './app/UserProfileScreen';
import VerifyOTPScreen from './app/VerifyOTPScreen';
import VirtualPetLogin from './app/VirtualPetLogin';

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
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VirtualPetLogin"
              component={VirtualPetLogin}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NextRegisterScreen"
              component={NextRegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChoosePetScreen"
              component={ChoosePetScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LastRegisterScreen"
              component={LastRegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ReminderScreen"
              component={ReminderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProgressTrackerScreen"
              component={ProgressTrackerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DailyHealthScreen"
              component={DailyHealthScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserProfileScreen"
              component={UserProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GoalSettingScreen"
              component={GoalSettingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SelectFoodScreen"
              component={SelectFoodScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VerifyOTPScreen"
              component={VerifyOTPScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PetRegisterProvider>
    </UserRegisterProvider>
  );
}