import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

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

type Props = NativeStackScreenProps<RootStackParamList, 'ReminderScreen'>;

const ReminderScreen: React.FC<Props> = ({ navigation }) => {
  const [waterReminderActive, setWaterReminderActive] = useState(false);
  const [eyeReminderActive, setEyeReminderActive] = useState(false);

   const getCurrentRouteName = () => {
    try {
      const state = navigation.getState();
      return state.routes[state.index]?.name || '';
    } catch (error) {
      console.error('Error getting current route name:', error);
      return '';
    }
  };

  const setupRemainderWater = async () =>{
    const { status } = await Notifications.requestPermissionsAsync();
    if(status !== 'granted'){
      alert('通知の許可が必要です！');
      return;
    }

    if(Platform.OS === 'ios'){
      console.log('iOS notification permission granted!');
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '水分補給',
        body: 'お水を飲みましょう！',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 120,
        repeats: true,
      },
    });
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>通知</Text>
      </View>

      {/* Reminders */}
      <View style={styles.content}>
        {/* 水分補給リマインド */}
        <View style={styles.reminderBox}>
          <Text style={styles.reminderText}>水分補給リマインド</Text>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              waterReminderActive ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={async () => {
              if(!waterReminderActive){
                 const success = await setupRemainderWater();
                if(success){
                  setWaterReminderActive(true);
                }
              }else{
                await Notifications.cancelAllScheduledNotificationsAsync();
                setWaterReminderActive(false);
              }
            }}
          >
            <View
              style={[
                styles.toggleCircle,
                waterReminderActive ? styles.circleActive : styles.circleInactive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* 目の疲れリマインド */}
        <View style={styles.reminderBox}>
          <Text style={styles.reminderText}>就寝時間リマインド</Text>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              eyeReminderActive ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={() => setEyeReminderActive(prev => !prev)}
          >
            <View
              style={[
                styles.toggleCircle,
                eyeReminderActive ? styles.circleActive : styles.circleInactive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
  backgroundColor: '#f8f4ff',
},

  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // Same width as back button to center the title
  },
  reminderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reminderText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  toggleSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleActive: {
    backgroundColor: '#34C759',
  },
  toggleInactive: {
    backgroundColor: '#E9E9EA',
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  circleActive: {
    right: 2,
  },
  circleInactive: {
    left: 2,
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
});

export default ReminderScreen;
