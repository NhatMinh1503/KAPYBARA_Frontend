import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get user's profile data
export async function getUserProfile() {
  const userId = await AsyncStorage.getItem('user_id');
  const token = await AsyncStorage.getItem('token');

  if (!userId || !token) {
    throw new Error('ユーザー情報が見つかりません。ログインしてください。');
  }

  const response = await fetch(`http://10.108.1.0:3000/users/getUser_data/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('ユーザーデータの取得に失敗しました');
  }

  const data = await response.json();
  return data;
}
