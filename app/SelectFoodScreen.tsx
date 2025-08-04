import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchFoodItems } from '../services/meal/fetchFoodItems';
import { saveMealData } from '../services/meal/saveMealData';
import { FoodItemDetailed, MealType } from '../types';

const CustomToggle: React.FC<{ isEnabled: boolean; onToggle: () => void }> = ({ isEnabled, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.toggleContainer}>
      <View style={[styles.circle, isEnabled ? styles.circleEnabled : styles.circleDisabled]} />
    </TouchableOpacity>
  );
};

const SelectFoodScreen: React.FC = () => {
  const router = useRouter();
    type Params = {
      mealType?: string;
      onSave?: string; // atau fungsi, tergantung isi asli dari onSave
    };

    const { mealType, onSave } = useLocalSearchParams<Params>();

    const mealsType = mealType ?? '';


  const [searchText, setSearchText] = useState('');
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItemDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFoodData = async () => {
    try {
      setIsLoading(true);
      const items = await fetchFoodItems(searchText);
      setFoodItems(items);
    } catch (error) {
      console.error('Fetch failed!', error);
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (searchText.trim() !== '') {
        fetchFoodData();
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };

  }, [searchText]);

  const toggleSwitch = (id: string) => {
    setFoodItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  };

  const saveSelectedFoods = async () => {
  const selected = foodItems.filter(item => item.isEnabled);

    try {
      await saveMealData(mealsType as MealType, selected);
      router.back();
    } catch (error) {
      console.error('Failed to save meal data:', error);
    }
  };


  // Safe filtering with null checks
  const filteredItems =
  searchText.trim() === '' ? foodItems : foodItems.filter(item => item?.name?.toLowerCase().includes(searchText.trim().toLowerCase()));

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

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>食品</Text>
        <TouchableOpacity style={styles.headerButton} onPress={saveSelectedFoods}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder=""
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={fetchFoodData}
          placeholderTextColor="#999"
        />
      </View>

      {/* Food Items List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text>検索中...</Text>
          </View>
        )}

        {/* Safe rendering with proper null checks */}
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <View key={item?.id || Math.random().toString()} style={styles.listItem}>
              <View style={styles.itemContent}>
                <Text style={styles.itemText}>{item?.name || 'Unknown Food'}</Text>
                <Text style={styles.itemCalories}>
                  {(item?.totalCalories || 0).toFixed(0)} kcal
                </Text>
              </View>
              <CustomToggle
                isEnabled={!!item?.isEnabled}
                onToggle={() => toggleSwitch(item?.id)}
              />
            </View>
          ))
        ) : (
          !isLoading && searchText.trim() !== '' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>検索結果が見つかりません</Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Bottom Navigation - FIXED: All buttons with proper color logic */}
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
  activeNavItem: {
    opacity: 1,
  },
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
    backgroundColor: 'transparent',
  },

  backButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34C759',
    backgroundColor: '#34C759',
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
    color: 'white',
    fontWeight: 'bold',
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    fontWeight: '400',
  },
  // ADDED MISSING itemCalories STYLE
  itemCalories: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    marginLeft: 8,
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