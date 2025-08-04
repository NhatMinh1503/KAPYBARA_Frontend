import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserRegistrationData {
  weight: number;
  height: number;
  goal: string;
  health: string;
  steps: number;
  goalWeight: number;
  sleepTime: string | null;
  wakeupTime: string | null;
  goalWater: number;
  [key: string]: any; // Untuk field tambahan seperti name, email, dsb
}

export const registerUser = async (userData: UserRegistrationData): Promise<string> => {
  const response = await fetch(`http://10.108.1.0:3000/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('登録に失敗しました');
  }

  const data = await response.json();
  const userId = data.user_id;
  await AsyncStorage.setItem('user_id', userId);
  return userId;
};
