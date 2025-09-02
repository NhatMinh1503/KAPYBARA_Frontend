import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ReminderScreen: React.FC = () => {
  const router = useRouter();
  const [waterReminderActive, setWaterReminderActive] = useState(false);
  const [eyeReminderActive, setEyeReminderActive] = useState(false);
  const [mealReminderActive, setMealReminderActive] = useState(false);
  const [sleepHour, setSleepHour] = useState('');

  const getCurrentRouteName = () => {
    try {
      const pathname = usePathname();
      const segments = pathname.split('/');
      return segments[segments.length - 1] || '';
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
        seconds: 120, // Example: 2 minutes for testing
        repeats: true,
      },
    });
    return true;
  };

  // New function for meal reminder
  const setupReminderMeal = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('通知の許可が必要です！');
      return;
    }

    if (Platform.OS === 'ios') {
      console.log('iOS notification permission granted!');
    }

    //Remainder for breakfast
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '朝食の時間',
        body: '朝ごはんをしましょう！',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 7,
        minute: 0,
        repeats: true,
      },
    });

    //Remainder for lunch
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '昼食の時間',
        body: 'お昼ごはんをしましょう！',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 13,
        minute: 0,
        repeats: true,
      },
    });

    //Remainder for dinner
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '夜食の時間',
        body: '夜ごはんをしましょう！',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 19,
        minute: 0,
        repeats: true,
      },
    });
    return true;
  };

  const setupRemainderSleep = async () =>{
    const user_id = await AsyncStorage.getItem('user_id');
    const { status } = await Notifications.requestPermissionsAsync();
    if(status !== 'granted'){
      alert('通知の許可が必要です！');
      return;
    }

    if(Platform.OS === 'ios'){
      console.log('iOS notification permission granted!');
    }
    
    try{
      const response = await fetch(`http://192.168.1.12:3000/goals/${user_id}`);
      if(response.ok){
        const data = await response.json();
        const sleep = data.sleepTime;
        const wakeup = data.wakeupTime;

        if(!sleep || !wakeup){
          alert('就寝時間と起床時間を設定してください。');
          return;
        }

        const [sleephourStr, sleepminuteStr] = sleep.split(':');
        const sleephour = parseInt(sleephourStr, 10);
        const sleepminute = parseInt(sleepminuteStr, 10);

        const [wakehourStr, wakeminuteStr] = wakeup.split(':');
        const wakehour = parseInt(wakehourStr, 10);
        const wakeminute = parseInt(wakeminuteStr, 10);


        await Notifications.scheduleNotificationAsync({
          content: {
            title: '就寝時間リマインド',
            body: '眠いよ～ 寝ましょう！',
            data: { purpose : 'sleep'}
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: sleephour,
            minute: sleepminute,
            repeats: true,
          },
        });

        await Notifications.scheduleNotificationAsync({
           content: {
            title: '起床時間リマインド',
            body: '朝だよ！起きて！',
            data: { purpose : 'wake up'}
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: wakehour,
            minute: wakeminute,
            repeats: true,
          },
        })
        return true;
      }
    }catch(err){
      console.error('Error to fetch data', err);
    }
  };

  const sendSleepData = async () => {
    const sleepTime = await AsyncStorage.getItem('sleepTime');
    const wakeupTime = await AsyncStorage.getItem('wakeupTime');
    const user_id = await AsyncStorage.getItem('user_id');

    if(sleepTime && wakeupTime && user_id){
      try{
        const sleepHours = `${sleepTime} - ${wakeupTime}`;
        setSleepHour(sleepHours);

        const response = await fetch(`http://192.168.1.12:3000/sleep_data/${user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sleep: sleepHours,
          }),
        });

        if(response.ok){
          console.log('Sleep and wakeup times updated successfully');
        }
      }catch(err){
        console.error('Error updating sleep and wakeup times', err);
      }
    }
  }

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(async response => {
      const data = response.notification.request.content.data;
      const clickTime = new Date().toISOString();
      if(data.purpose === 'sleep'){
        try{
          await AsyncStorage.setItem('sleepTime', clickTime);
        }catch(err){
          console.error("Unable to save sleep time to Async Storage", err);
        }
      }

      if(data.purpose === 'wake up'){
        try{
          await AsyncStorage.setItem('wakeupTime', clickTime);
        }catch(err){
          console.error("Unable to save wake up time to Async Storage", err);
        }
      }
    })

    return () => subscription.remove();
  }, [])

  useEffect(() => {
    sendSleepData();
  }, [sleepHour]);

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>通知</Text>
      </View>

      
      <View style={styles.content}>
                
        <View style={styles.reminderBox}>
          <Text style={styles.reminderText}>食事リマインド</Text>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              mealReminderActive ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={async () => {
              if (!mealReminderActive) {
                const success = await setupReminderMeal();
                if (success) {
                  setMealReminderActive(true);
                }
              } else {
                await Notifications.cancelAllScheduledNotificationsAsync();
                setMealReminderActive(false);
              }
            }}
          >
            <View
              style={[
                styles.toggleCircle,
                mealReminderActive ? styles.circleActive : styles.circleInactive,
              ]}
            />
          </TouchableOpacity>
        </View>
       
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

        
        <View style={styles.reminderBox}>
          <Text style={styles.reminderText}>起床就寝時間リマインド</Text> 
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              eyeReminderActive ? styles.toggleActive : styles.toggleInactive,
            ]}

            onPress={async () => {
              if(!eyeReminderActive){
                 const success = await setupRemainderSleep();
                if(success){
                  setEyeReminderActive(true);
                }
              }else{
                await Notifications.cancelAllScheduledNotificationsAsync();
                setEyeReminderActive(false);
              }
            }}
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

     
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navItem,
            getCurrentRouteName() === 'ReminderScreen' && styles.activeNavItem
          ]}
          onPress={() => router.push('/ReminderScreen')}
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
          onPress={() => router.push('/ProgressTrackerScreen')}
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
          onPress={() => router.push('/HomeScreen')}
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
          onPress={() => router.push('/DailyHealthScreen')}
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
          onPress={() => router.push('/UserProfileScreen')}
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