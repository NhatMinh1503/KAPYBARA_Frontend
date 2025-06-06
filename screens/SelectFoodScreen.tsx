import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Type definitions
type RootStackParamList = {
  IndexLogin: undefined;
  VitualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen:undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: undefined;
  UserProfileScreen: undefined;
  SelectFoodScreen: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SelectFoodScreen'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface FoodItem {
  id: string;
  name: string;
  isEnabled: boolean;
}

const CustomToggle: React.FC<{ isEnabled: boolean; onToggle: () => void }> = ({ isEnabled, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.toggleContainer}>
      <View style={[styles.circle, isEnabled ? styles.circleEnabled : styles.circleDisabled]} />
    </TouchableOpacity>
  );
};

const SelectFoodScreen: React.FC<Props> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { id: '1', name: '唐揚げ', isEnabled: true },
    { id: '2', name: 'きれいな唐揚げ', isEnabled: true },
    { id: '3', name: '魚の唐揚げ', isEnabled: false },
    { id: '4', name: '鶏もも肉唐揚げ（イオン）', isEnabled: false },
    { id: '5', name: '鶏もも肉唐揚げ（セブンイレブン）', isEnabled: false },
    { id: '6', name: '若鶏もも肉唐揚げ（テーレイ）', isEnabled: false },
    { id: '7', name: 'など、など', isEnabled: false },
  ]);

  const toggleSwitch = (id: string) => {
    setFoodItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  };

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>朝食</Text>
          <Ionicons name="chevron-down" size={16} color="#666" style={styles.chevronIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>食品</Text>
        <TouchableOpacity style={styles.headerButton} 
        onPress={() => navigation.navigate('ProgressTrackerScreen')}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="唐揚げ"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Food Items List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Text style={styles.itemText}>{item.name}</Text>
            <CustomToggle 
              isEnabled={item.isEnabled}
              onToggle={() => toggleSwitch(item.id)}
            />
          </View>
        ))}
      </ScrollView>

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
                      onPress={() => navigation.navigate('ProgressTrackerScreen')}
                    >
                      <Ionicons name="stats-chart-outline" size={24} color="#666" />
                    </TouchableOpacity>
                 
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('HomeScreen')}
                    >
                      <Ionicons name="home" size={24} color="#8B7CF6" />
                    </TouchableOpacity>
                 
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('DailyHealthScreen')}
                    >
                      <Ionicons name="create-outline" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('UserProfileScreen')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    minWidth: 60,
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  chevronIcon: {
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 2,
  },
  listContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    fontWeight: '400',
  },
  toggleContainer: {
    padding: 5,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  circleEnabled: {
    backgroundColor: '#34c759',
  },
  circleDisabled: {
    backgroundColor: '#D1D5DB',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    padding: 8,
  },
});

export default SelectFoodScreen;