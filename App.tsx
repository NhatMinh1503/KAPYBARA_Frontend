// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserRegisterProvider } from './contexts/UserRegisterContext';
import { PetRegisterProvider } from './contexts/PetRegisterContext';
import { RootStackParamList } from './types'; 

// Import các màn hình
import IndexLogin from './screens/IndexLogin';
import VirtualPetLogin from './screens/VirtualPetLogin';
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
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerifyOTPScreen from './screens/VerifyOTPScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

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