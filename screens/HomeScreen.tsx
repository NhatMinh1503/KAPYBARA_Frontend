import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Type definitions
type RootStackParamList = {
  HomeScreen: undefined;
  VirtualPetLogin: undefined;
  ReminderScreen: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface WeatherData {
  outsideTemp: number | null;
  roomTemp: number | null;
  loading: boolean;
  error: string | null;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    outsideTemp: null,
    roomTemp: null,
    loading: true,
    error: null,
  });

  // Function to fetch data from API
  const fetchWeatherData = async (): Promise<void> => {
    try {
      setWeatherData(prev => ({ ...prev, loading: true, error: null }));

      const cityName = 'Tokyo'; // Change to your location
      const apiKey = 'https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ja'; // Replace with your API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ja`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      console.log('Fetched weather data:', data);

      setWeatherData({
        outsideTemp: data.main?.temp ?? null,
        roomTemp: null, // OpenWeatherMap does not have room temperature data
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error fetching weather data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setWeatherData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchWeatherData();
    
    // Optional: Set interval to update data periodically
    const interval = setInterval(fetchWeatherData, 300000); // Update every 5 minutes
    
    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  // Function to render temperature
  const renderTemperature = (temp: number | null, loading: boolean): React.ReactNode => {
    if (loading) {
      return <ActivityIndicator size="small" color="#666" />;
    }
    if (temp !== null) {
      return `${temp}°C`;
    }
    return '--°C';
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 80 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.locationTitle}>Current Location</Text>
      </View>

      {/* Weather Info */}
      <View style={styles.weatherContainer}>
        <View style={styles.temperatureRow}>
          <View style={styles.tempItem}>
            <Text style={styles.tempLabel}>Outside Temperature</Text>
            <Text style={styles.tempValue}>
              {renderTemperature(weatherData.outsideTemp, weatherData.loading)}
            </Text>
          </View>
          <View style={styles.tempItem}>
            <Text style={styles.tempLabel}>Room Temperature</Text>
            <Text style={styles.tempValue}>
              {renderTemperature(weatherData.roomTemp, weatherData.loading)}
            </Text>
          </View>
        </View>
        
        {/* Error message if there's an error */}
        {weatherData.error && (
          <TouchableOpacity 
            style={styles.errorContainer}
            onPress={fetchWeatherData}
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
        {/* Placeholder for rabbit with umbrella image */}
        <View style={styles.characterPlaceholder}>
          {/* Replace with Image component for your image */}
          {/* <Image 
            source={require('./assets/rabbit-umbrella.png')} 
            style={styles.characterImage}
            resizeMode="contain"
          /> */}
          <Text style={styles.placeholderText}>
            Placeholder for{'\n'}rabbit with umbrella image
          </Text>
        </View>
      </View>

      {/* Message Button */}
      <TouchableOpacity 
        style={styles.messageButton}
        // onPress={() => navigation.navigate('')}
      >
        <Text style={styles.messageText}>message</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('ReminderScreen')}
        >
          <Ionicons name="time-outline" size={24} color="#666" />
        </TouchableOpacity>
      
        <TouchableOpacity 
          style={styles.navItem}
          // onPress={() => navigation.navigate('Fourth')}
        >
          <Ionicons name="stats-chart-outline" size={24} color="#666" />
        </TouchableOpacity>
      
        <TouchableOpacity 
          style={styles.navItem}
          // onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#007AFF" />
        </TouchableOpacity>
      
        <TouchableOpacity 
          style={styles.navItem}
          // onPress={() => navigation.navigate('Third')}
        >
          <Ionicons name="create-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          // onPress={() => navigation.navigate('')} 
        >
          <Ionicons name="person-outline" size={24} color="#666" />
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
