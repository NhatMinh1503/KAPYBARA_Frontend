import AsyncStorage from '@react-native-async-storage/async-storage';

type UpdateUserProfileInput = {
  name: string;
  email: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
};

// Function to update user's profile data
export async function updateUserProfile(data: UpdateUserProfileInput) {
  const userId = await AsyncStorage.getItem('user_id');
  const token = await AsyncStorage.getItem('token');

  if (!userId || !token) {
    throw new Error('ユーザー情報が見つかりません。ログインしてください。');
  }

  const response = await fetch(`http://localhost:3000/users/update_data/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'プロフィールの更新に失敗しました');
  }

  return true;
}
