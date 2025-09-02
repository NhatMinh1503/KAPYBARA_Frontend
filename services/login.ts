import AsyncStorage from '@react-native-async-storage/async-storage';


// 
export const loginUser = async (emailName: string, password: string) => {
  const fullEmail = `${emailName}@gmail.com`;
  const finalData = {
    email: fullEmail,
    password,
  };

  try {
    const response = await fetch(`http://192.168.1.12:3000/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Login failed!';
      throw new Error(errorMessage);
    }

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user_id', data.user_id.toString());
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};
