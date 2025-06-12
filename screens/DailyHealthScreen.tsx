import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import types from your types file
import { RootStackParamList, MealType, MealData, FoodItem } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DailyHealthScreen'>;
type DailyHealthRouteProp = RouteProp<RootStackParamList, 'DailyHealthScreen'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: DailyHealthRouteProp;
}

interface WaterIntake {
  amount: number;
  goal: number;
}

interface StepsData {
  steps: number;
  goal: number;
}

const DailyHealthScreen: React.FC<Props> = ({ navigation, route }) => {
  const [waterIntake, setWaterIntake] = useState('');
  const [steps, setSteps] = useState('');
  const isFocused = useIsFocused();

  // Default meal data factory function
  const defaultMealData = (): MealData => ({
    fat: 0,
    carbs: 0,
    protein: 0,
    percentage: 0,
    totalCalories: 0,
    foods: [],
  });

  const [meals, setMeals] = useState<Record<MealType, MealData>>({
    breakfast: defaultMealData(),
    lunch: defaultMealData(),
    dinner: defaultMealData(),
    snack: defaultMealData(),
  });

  useEffect(() => {
    if (isFocused && route.params?.mealType && route.params?.mealData) {
      const { mealType, mealData } = route.params;
      handleMealSave(mealType, mealData);

      // Clear the params after handling
      navigation.setParams({
        mealType: undefined,
        mealData: undefined,
      });
    }
  }, [isFocused, route.params, navigation]);

  const handleAddMeal = (mealType: keyof typeof meals) => {
    navigation.navigate('SelectFoodScreen', {
      mealType,
      onSave: (data: MealData) => handleMealSave(mealType, data),
    });
  };

  const handleMealSave = (mealType: keyof typeof meals, newdata: MealData) => {
    setMeals((prevMeals) => {
      const existingFoods = prevMeals[mealType].foods;
      const updatedFoods = [...existingFoods, ...newdata.foods];

      const updateFat = prevMeals[mealType].fat + newdata.fat;
      const updateCarbs = prevMeals[mealType].carbs + newdata.carbs;
      const updateProtein = prevMeals[mealType].protein + newdata.protein;
      const updateTotalCalories = prevMeals[mealType].totalCalories + newdata.totalCalories;

      const updatePercentage = Math.round(
        ((updateFat + updateCarbs + updateProtein) / 100) * 100
      );

      return {
        ...prevMeals,
        [mealType]: {
          fat: updateFat,
          carbs: updateCarbs,
          protein: updateProtein,
          percentage: updatePercentage,
          totalCalories: updateTotalCalories,
          foods: updatedFoods,
        },
      };
    });
  };

  const calculateTotalNutrition = () => {
    const total = Object.values(meals).reduce(
      (acc, meal) => {
        acc.fat += meal.fat;
        acc.carbs += meal.carbs;
        acc.protein += meal.protein;
        acc.totalCalories += meal.totalCalories;
        return acc;
      },
      { fat: 0, carbs: 0, protein: 0, totalCalories: 0 }
    );

    const percentage = Math.round(
      ((total.fat + total.carbs + total.protein) / 100) * 100
    );

    return { ...total, percentage };
  };

  const total = calculateTotalNutrition();

  const getStorageData = () => {
    const logicalDate = getLogDate();
    return `@meals:${logicalDate}`;
  };

  // Function to load meals from AsyncStorage
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedData = getStorageData();
        const storedMeals = await AsyncStorage.getItem(storedData);
        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error('Failed to load meals from storage:', error);
      }
    };
    loadMeals();
  }, []);

  // Function to save meals to AsyncStorage
  useEffect(() => {
    const saveMeals = async () => {
      try {
        const storedData = getStorageData();
        await AsyncStorage.setItem(storedData, JSON.stringify(meals));
      } catch (error) {
        console.error('Failed to save meals to storage:', error);
      }
    };
    saveMeals();
  }, [meals]);

  // Function to reset stored data (daily)
  const resetStoredData = async () => {
    await sendCaloriesToBackend(total.totalCalories);
    try {
      const storedData = getStorageData();
      await AsyncStorage.removeItem(storedData);
      setMeals({
        breakfast: defaultMealData(),
        lunch: defaultMealData(),
        dinner: defaultMealData(),
        snack: defaultMealData(),
      });
      Alert.alert('データがリセットされました');
    } catch (error) {
      console.error('Failed to reset stored data:', error);
    }
  };

  // Function to send calories to backend
  const sendCaloriesToBackend = async (totalCalories: number) => {
    const storedUserId = await AsyncStorage.getItem('user_id');
    const log_date = getLogDate();
    try {
      const response = await fetch('http://localhost:3000/daily-calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calories: totalCalories, user_id: storedUserId, log_date }),
      });
      if (!response.ok) {
        throw new Error('Failed to send calories to backend');
      }
    } catch (error) {
      console.error('Error sending calories to backend:', error);
    }
  };

  // Function to set time to send data to backend
  function getLogDate() {
    const now = new Date();
    const hour = now.getHours();

    const logicalDate = new Date(now);
    if (hour < 3) {
      logicalDate.setDate(now.getDate() - 1); // 前日のデータを送信
    }

    return logicalDate.toISOString().split('T')[0]; // YYYY-MM-DD形式で返す
  }

  // Function to reset all data in new day
  const resetIfNewDay = async () => {
    try {
      const today = getLogDate();
      const lastResetDate = await AsyncStorage.getItem('lastResetDate');
      if (lastResetDate !== today) {
        await resetStoredData();
        await AsyncStorage.setItem('lastResetDate', today);
      }
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  };

  useEffect(() => {
    resetIfNewDay();
  }, []);

  const renderMealSection = (mealKey: keyof typeof meals, mealData: MealData) => {
    const mealNameMap = {
      breakfast: '朝食',
      lunch: '昼食',
      dinner: '夕食',
      snack: '間食',
    };
    const mealName = mealNameMap[mealKey];

    const hasFoods = mealData.foods.length > 0;

    return (
      <View key={mealKey}>
        {hasFoods ? (
          <View>
            {/* Meal name with underline when has data */}
            <View style={styles.mealRowWithData}>
              <Text style={styles.mealName}>{mealName}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddMeal(mealKey)}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Food items */}
            {mealData.foods.map((food, index) => (
              <View key={index} style={styles.foodItemRow}>
                <Text style={styles.foodItemName}>{food.name}</Text>
                <Text style={styles.foodItemCalories}>{food.calories}</Text>
              </View>
            ))}
          </View>
        ) : (
          /* Empty meal row */
          <View style={styles.mealRowEmpty}>
            <Text style={styles.mealName}>{mealName}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddMeal(mealKey)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Water Intake Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>水分摂取</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={waterIntake}
                onChangeText={setWaterIntake}
                placeholder=""
                keyboardType="numeric"
              />
              <Text style={styles.unit}>ml</Text>
            </View>
          </View>
          <Text style={styles.goalText}>目標まであと 2 ml必要です！</Text>
        </View>

        {/* Steps Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>歩数</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={steps}
                onChangeText={setSteps}
                placeholder=""
                keyboardType="numeric"
              />
              <Text style={styles.unit}>歩</Text>
            </View>
          </View>
          <Text style={styles.goalText}>目標まであと 7歩必要です！</Text>
        </View>

        {/* Meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>食事</Text>

          {/* Nutrition Headers */}
          <View style={styles.mealHeader}>
            <Text style={styles.mealHeaderText}>脂質</Text>
            <Text style={styles.mealHeaderText}>炭水</Text>
            <Text style={styles.mealHeaderText}>たん質</Text>
            <Text style={styles.mealHeaderText}>摂取%</Text>
            <Text style={styles.mealHeaderText}>カロリー</Text>
          </View>

          {/* Total Nutrition Row */}
          <View style={styles.nutritionValuesRow}>
            <Text style={styles.nutritionValue}>{total.fat}g</Text>
            <Text style={styles.nutritionValue}>{total.carbs}g</Text>
            <Text style={styles.nutritionValue}>{total.protein}g</Text>
            <Text style={styles.nutritionValue}>{total.percentage}%</Text>
            <Text style={styles.calorieValue}>{total.totalCalories} kcal</Text>
          </View>

          {/* Meals List */}
          <View style={styles.mealsContainer}>
            {(Object.keys(meals) as MealType[]).map((key) =>
              renderMealSection(key, meals[key])
            )}
          </View>
        </View>

        {/* Add some bottom padding for the fixed navigation */}
        <View style={styles.bottomPadding} />
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
          onPress={() => navigation.navigate('DailyHealthScreen', {
            mealType: 'breakfast',
            mealData: JSON.parse(JSON.stringify(meals.breakfast)),
          })}
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    textAlign: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  unit: {
    fontSize: 14,
    color: '#666',
  },
  goalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
  },
  mealHeaderText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  mealsContainer: {
    backgroundColor: '#fff',
  },
  nutritionValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  nutritionValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  calorieValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  mealRowWithData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mealRowEmpty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  mealName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodItemName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  foodItemCalories: {
    fontSize: 12,
    color: '#666',
    minWidth: 30,
    textAlign: 'right',
  },
  reportButton: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reportButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  bottomPadding: {
    height: 100,
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
});

export default DailyHealthScreen;