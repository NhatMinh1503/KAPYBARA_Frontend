import React, { useState,  useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
 
 
// ---------- Type Definitions ----------
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
 
type RootStackParamList = {
  IndexLogin: undefined;
  VirtualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen: undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: {
    mealType?: MealType;
    mealData?: MealData;
  };
  UserProfileScreen: undefined;
  SelectFoodScreen: {
    mealType: MealType;
    onSave: (data: MealData) => void;
  };
};
 
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DailyHealthScreen'>;
type DailyHealthRouteProp = RouteProp<RootStackParamList, 'DailyHealthScreen'>;
 
interface Props {
  navigation: HomeScreenNavigationProp;
  route: DailyHealthRouteProp;
}
 
interface FoodItem {
  name: string;
  calories: number;
}
 
interface MealData {
  fat: number;
  carbs: number;
  protein: number;
  percentage: number;
  totalCalories: number;
  foods: FoodItem[];
}
 
// ---------- Utility Functions ----------
const getLogDate = (): string => {
  const now = new Date();
  if (now.getHours() < 3) now.setDate(now.getDate() - 1);
  return now.toISOString().split('T')[0];
};
 
const defaultMealData = (): MealData => ({
  fat: 0,
  carbs: 0,
  protein: 0,
  percentage: 0,
  totalCalories: 0,
  foods: [],
});
 
// ---------- Main Component ----------
const DailyHealthScreen: React.FC<Props> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
 
  const [waterIntake, setWaterIntake] = useState('');
  const [remainingWater, setRemainingWater] = useState(0);
  const [remainingSteps, setRemainingSteps] = useState(0);
  const [steps, setSteps] = useState('');
  const [meals, setMeals] = useState<Record<MealType, MealData>>({
    breakfast: defaultMealData(),
    lunch: defaultMealData(),
    dinner: defaultMealData(),
    snack: defaultMealData(),
  });
 
  const fetchGoals = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return Alert.alert('エラー', 'ユーザーIDが見つかりません。ログインしてください。');
 
      const response = await fetch(`http://localhost:3000/goals/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch water goal');
 
      const data = await response.json();
 
      const goal = parseInt(data.waterGoal);
      if (isNaN(goal)) throw new Error('Invalid water goal');
 
      const steps = parseInt(data.steps);
      if (isNaN(steps)) throw new Error('Invalid steps goal');
 
      setRemainingWater(goal);
      setRemainingSteps(steps);
      await AsyncStorage.setItem('@remainingWater', goal.toString());
      await AsyncStorage.setItem('@remainingSteps', steps.toString());
    } catch (error) {
      console.error(error);
      Alert.alert('エラー', '水分摂取量の目標を取得できませんでした。');
    }
  }, []);
 
  const handleWaterIntake = useCallback(async () => {
    const intake = parseInt(waterIntake);
    if (isNaN(intake) || intake < 0) {
      return Alert.alert('無効な水分摂取量', '正しい数値を入力してください。');
    }
 
    const currentIntake = parseInt(await AsyncStorage.getItem('@waterIntake') ?? '0');
    const newIntake = currentIntake + intake;
 
    await AsyncStorage.setItem('@waterIntake', newIntake.toString());
    setWaterIntake('');
 
    const remaining = parseInt(await AsyncStorage.getItem('@remainingWater') ?? '0');
    const newRemaining = remaining - intake;
    setRemainingWater(newRemaining);
    await AsyncStorage.setItem('@remainingWater', newRemaining.toString());
  }, [waterIntake]);
 
  const handleStepsIntake = useCallback(async () => {
    const intake = parseInt(steps);
    if (isNaN(intake) || intake < 0) {
      return Alert.alert('無効な歩数', '正しい数値を入力してください。');
    }
 
    const currentIntake = parseInt(await AsyncStorage.getItem('@stepsIntake') ?? '0');
    const newIntake = currentIntake + intake;
 
    await AsyncStorage.setItem('@stepsIntake', newIntake.toString());
    setSteps('');
 
    const remaining = parseInt(await AsyncStorage.getItem('@remainingSteps') ?? '0');
    const newRemaining = remaining - intake;
    setRemainingSteps(newRemaining);
 
    await AsyncStorage.setItem('@remainingSteps', newRemaining.toString());
  }, [steps]);
 
  const handleMealSave = useCallback((mealType: MealType, newData: MealData) => {
    setMeals(prev => {
      const existing = prev[mealType];
      const updatedFoods = [...existing.foods, ...newData.foods];
 
      const fat = existing.fat + newData.fat;
      const carbs = existing.carbs + newData.carbs;
      const protein = existing.protein + newData.protein;
      const totalCalories = existing.totalCalories + newData.totalCalories;
      const percentage = Math.round(((fat + carbs + protein) / 100) * 100);
 
      return {
        ...prev,
        [mealType]: { fat, carbs, protein, totalCalories, percentage, foods: updatedFoods },
      };
    });
  }, []);
 
  const handleAddMeal = (mealType: MealType) => {
    navigation.navigate('SelectFoodScreen', {
      mealType,
      onSave: data => handleMealSave(mealType, data),
    });
  };
 
  const calculateTotalNutrition = () => {
    const total = Object.values(meals).reduce((acc, meal) => {
      acc.fat += meal.fat;
      acc.carbs += meal.carbs;
      acc.protein += meal.protein;
      acc.totalCalories += meal.totalCalories;
      return acc;
    }, { fat: 0, carbs: 0, protein: 0, totalCalories: 0 });
 
    const percentage = Math.round(((total.fat + total.carbs + total.protein) / 100) * 100);
    return { ...total, percentage };
  };

  const saveTotalCalories = async () => {
    const total = calculateTotalNutrition();
    try{
      await AsyncStorage.setItem('@calories', await total.totalCalories.toString());
    }catch(err){
      console.error('Error to save calories to Storage', err);
    }
  }
 
  const saveMealsToStorage = async () => {
    try {
      saveTotalCalories();
      const key = `@meals:${getLogDate()}`;
      await AsyncStorage.setItem(key, JSON.stringify(meals));
    } catch (err) {
      console.error('Failed to save meals:', err);
    }
  };
 
  const loadMealsFromStorage = async () => {
    try {
      const key = `@meals:${getLogDate()}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) setMeals(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load meals:', err);
    }
  };
 
  const sendDataToBackend = async (totalCalories: number, water: number, steps: number) => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const log_date = getLogDate();
      await fetch('http://localhost:3000/daily-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, log_date, calories: totalCalories, waterIntake: water, steps: steps }),
      });
    } catch (err) {
      console.error('Sending data failed:', err);
    }
  };
 
  const resetStoredData = async () => {
    try {
      // const total = calculateTotalNutrition();
      const calories = parseInt(await AsyncStorage.getItem('@calories') ?? '0');
      const water = parseInt(await AsyncStorage.getItem('@waterIntake') ?? '0');
      const steps = parseInt(await AsyncStorage.getItem('@stepsIntake') ?? '0');
 
      await sendDataToBackend(calories, water, steps);
 
      const key = `@meals:${getLogDate()}`;
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem('@waterIntake', '0');
      await AsyncStorage.setItem('@stepsIntake', '0');
      await AsyncStorage.setItem('@calories', '0');
 
      setMeals({
        breakfast: defaultMealData(),
        lunch: defaultMealData(),
        dinner: defaultMealData(),
        snack: defaultMealData(),
      });
 
      Alert.alert('データがリセットされました');
    } catch (err) {
      console.error('Failed to reset data:', err);
    }
  };
 
  const resetIfNewDay = useCallback(async () => {
    const today = getLogDate();
    const lastReset = await AsyncStorage.getItem('lastResetDate');

    console.log('Today:', today);
    console.log('Last Reset:', lastReset);
 
    if (!lastReset || lastReset !== today) {
      await fetchGoals();
      await resetStoredData();
      await AsyncStorage.setItem('lastResetDate', today);
    }
  }, []);
 
  // ---------- Effects ----------
  useEffect(() => {
    resetIfNewDay();
    loadMealsFromStorage();
  }, []);
 
  useEffect(() => {
    saveMealsToStorage();
  }, [meals]);
 
  useEffect(() => {
    if (isFocused && route.params?.mealType && route.params?.mealData) {
      handleMealSave(route.params.mealType, route.params.mealData);
      navigation.setParams({ mealType: undefined, mealData: undefined });
    }
  }, [isFocused, route.params]);
 
  useFocusEffect(
    useCallback(() => {
      const loadRemainingWater = async () => {
        const value = await AsyncStorage.getItem('@remainingWater');
        if(value != null){
          setRemainingWater(parseInt(value));
        }
      };
 
      loadRemainingWater();
    }, [])
  );
 
    useFocusEffect(
    useCallback(() => {
      const loadRemainingSteps = async () => {
        const value = await AsyncStorage.getItem('@remainingSteps');
        if(value != null){
          setRemainingSteps(parseInt(value));
        }
      };
 
      loadRemainingSteps();
    }, [])
  );
 
  const total = calculateTotalNutrition();
 
  const renderMealSection = (mealKey: keyof typeof meals, mealData: MealData) => {
  const mealNameMap = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食',
    snack: '間食',
  };
  const mealName = mealNameMap[mealKey];
   
    return (
      <View key={mealKey}>
          <View>          
            {/* Meal name with underline */}
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
       
          <View style={styles.mealRowEmpty}>
            <Text style={styles.mealName}>{mealName}</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddMeal(mealKey)}
                >
                <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
          </View>
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
                onSubmitEditing={handleWaterIntake}
                placeholder=""
                keyboardType="numeric"
              />
              <Text style={styles.unit}>ml</Text>
            </View>
          </View>
          <Text style={styles.goalText}>目標まであと {remainingWater} ml必要です!</Text>
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
                onSubmitEditing={handleStepsIntake}
                placeholder=""
                keyboardType="numeric"
              />
              <Text style={styles.unit}>歩</Text>
            </View>
          </View>
          <Text style={styles.goalText}>目標まであと {remainingSteps} 歩必要です！</Text>
        </View>
 
        {/* Meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>食事</Text>
         
          {/* Nutrition Headers */}
          <View style={styles.mealHeader}>
            <Text style={styles.mealHeaderText}>脂質</Text>
            <Text style={styles.mealHeaderText}> 炭水</Text>
            <Text style={styles.mealHeaderText}>た質</Text>
            <Text style={styles.mealHeaderText}>摂取%</Text>
            <Text style={styles.mealHeaderText}>カロリー</Text>
          </View>
 
          {/* Total Nutrition Row (only once) */}
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
                        mealType: "breakfast", // Default to breakfast for editing
                        mealData: defaultMealData(), // Pass the current
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
 