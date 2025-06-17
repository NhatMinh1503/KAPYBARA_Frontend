import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
// Type definitions
type RootStackParamList = {
  IndexLogin: undefined;
  VirtualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen:undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: undefined;
  UserProfileScreen: undefined;
};
 
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;
 
interface Props {
  navigation: HomeScreenNavigationProp;
}
 
 
interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  message: string | null;
  loading: boolean;
  error: string | null;
}
 
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: null,
    humidity: null,
    message: null,
    loading: true,
    error: null,
  });
  // Function to fetch data from API
    const fetchWeatherData = async () => {
      try{
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token not found');
 
          const response = await fetch('http://localhost:3000/fetch_weather', {
            method: 'GET',  
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
 
          if (!response.ok) {
            throw new Error('Failed to fetch weather data');
          }
 
          const result = await response.json();
          setWeatherData({
            temperature: result.data.temperature,
            humidity: result.data.humidity,
            message: result.message,
            loading: false,
            error: '',
          });
      } catch (err: any) {
        setWeatherData({
          temperature: null,
          humidity: null,
          message: '',
          loading: true,
          error: err.message || 'An error occurred',
        });
      }
    };
 
    useEffect(() => {
        // Fetch weather data on component mount
        fetchWeatherData();
 
        // Set an interval to refresh the data periodically
        const interval = setInterval(() => {
          fetchWeatherData();
        }, 900000); // Refresh every 15 minutes
  }, []);
 
       // Function to render temperature
      const renderTemperature = (temp: number | null, loading: boolean): React.ReactNode => {
        if (loading) {
          return <ActivityIndicator size="small" color="#666" />;
        }
        if (temp !== null) {
          return <Text>{temp}°C</Text>;
        }
        return <Text>--°C</Text>;
      };
 
      // Function to render humidity
      const renderHumidity = (humid: number | null, loading: boolean): React.ReactNode => {
        if (loading) {
          return <ActivityIndicator size="small" color="#666" />;
        }
        if (humid !== null) {
          return <Text>{humid}%</Text>;
        }
        return <Text>--°C</Text>;
      };

      const getCurrentRouteName = () => {
    try {
      const state = navigation.getState();
      return state.routes[state.index]?.name || '';
    } catch (error) {
      console.error('Error getting current route name:', error);
      return '';
    }
  }; 
 
  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 80 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />
     
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.locationTitle}>現在地</Text>
      </View>
 
      {/* Weather Info */}
      <View style={styles.weatherContainer}>
        <View style={styles.temperatureRow}>
          <View style={styles.tempItem}>
            <Text style={styles.tempLabel}>気温</Text>
            <Text style={styles.tempValue}>
              {renderTemperature(weatherData.temperature, weatherData.loading)}
            </Text>
          </View>
          <View style={styles.tempItem}>
            <Text style={styles.tempLabel}>湿度</Text>
            <Text style={styles.tempValue}>
              {renderHumidity(weatherData.humidity, weatherData.loading)}
            </Text>
          </View>
        </View>
       
        {/* Error message jika ada error */}
        {weatherData.error && (
          <TouchableOpacity
            style={styles.errorContainer}
            onPress={fetchWeatherData} // Retry on press
          >
            <Text style={styles.errorText}>
              Error: {weatherData.error}
            </Text>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        )}
      </View>
 
      {/* Character Illustration */}
      <View style={styles.illustrationContainer}>
        {/* Tempat untuk gambar kelinci dengan payung */}
        <View style={styles.characterPlaceholder}>
          {/* Ganti dengan Image component untuk gambar kamu */}
          {/* <Image
            source={require('./assets/rabbit-umbrella.png')}
            style={styles.characterImage}
            resizeMode="contain"
          /> */}
          <Text style={styles.placeholderText}>
            Tempat untuk gambar{'\n'}kelinci dengan payung
          </Text>
        </View>
      </View>
 
      {/* Message Button */}
      <TouchableOpacity
        style={styles.messageButton}
        // onPress={() => navigation.navigate('')}
      >
        <Text style={styles.messageText}>{weatherData.message}</Text>
      </TouchableOpacity>
 
       {/* Bottom Navigation - FIXED: All buttons with proper color logic */}
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'ReminderScreen' && styles.activeNavItem
                ]}
                onPress={() => navigation.navigate('ReminderScreen')}
              >
                <Ionicons 
                  name="time-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'ReminderScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'ProgressTrackerScreen' && styles.activeNavItem
                ]}
                onPress={() => navigation.navigate('ProgressTrackerScreen')}
              >
                <Ionicons 
                  name="stats-chart-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'ProgressTrackerScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'HomeScreen' && styles.activeNavItem
                ]}
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Ionicons 
                  name="home" 
                  size={24} 
                  color={getCurrentRouteName() === 'HomeScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'DailyHealthScreen' && styles.activeNavItem
                ]}
                onPress={() => navigation.navigate('DailyHealthScreen')}
              >
                <Ionicons 
                  name="create-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'DailyHealthScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={[
                  styles.navItem,
                  getCurrentRouteName() === 'UserProfileScreen' && styles.activeNavItem
                ]}
                onPress={() => navigation.navigate('UserProfileScreen')}
              >
                <Ionicons 
                  name="person-outline" 
                  size={24} 
                  color={getCurrentRouteName() === 'UserProfileScreen' ? "#8B7CF6" : "#666"} 
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  weatherContainer: {
    paddingHorizontal: 40,
  },
  temperatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  tempItem: {
    alignItems: 'center',
  },
  tempLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tempValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  characterPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#e8e0ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d0c0ff',
    borderStyle: 'dashed',
  },
  characterImage: {
    width: 180,
    height: 180,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  messageButton: {
    marginHorizontal: 40,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 8,
  },
  activeNavItem: {
    opacity: 1,
  },
  navIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 18,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  retryText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '500',
  },
});
 
export default HomeScreen;
 