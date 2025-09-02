import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  message: string | null;
  loading: boolean;
  error: string | null;
}

export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const response = await fetch(`http://192.168.1.12:3000/fetch_weather`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const result = await response.json();

    return {
      temperature: result.data.temperature,
      humidity: result.data.humidity,
      message: result.message,
      loading: false,
      error: null,
    };
  } catch (err: any) {
    return {
      temperature: null,
      humidity: null,
      message: null,
      loading: false,
      error: err.message || 'An error occurred',
    };
  }
};
