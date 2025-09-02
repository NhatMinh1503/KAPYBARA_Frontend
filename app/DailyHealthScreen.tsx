import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { initHealthKit, getStepCount } from '../healthkitService.js'; 

 
// Import tipe dari file types.ts yang terpusat
import { MealData, MealType } from '../types';

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
// Menggunakan DailyHealthScreenProps yang sudah benar
const DailyHealthScreen = () => {
  const isFocused = useIsFocused();
  const params = useLocalSearchParams();
  const router = useRouter();
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
  const [ goalCalories, setGoalCalories] = useState(0);

  const mealType = typeof params.mealType === 'string' ? params.mealType : undefined;
  const mealData = params.mealData ? JSON.parse(params.mealData as string) : undefined;
 
  const fetchGoals = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return Alert.alert('エラー', 'ユーザーIDが見つかりません。ログインしてください。');
 
      const response = await fetch(`http://192.168.1.12:3000/goals/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch water goal');
 
      const data = await response.json();
 
      const goal = parseInt(data.waterGoal);
      if (isNaN(goal)) throw new Error('Invalid water goal');
 
      const steps = parseInt(data.steps);
      if (isNaN(steps)) throw new Error('Invalid steps goal');
 
      const goalCall = parseInt(data.goalCalories);
      if (isNaN(goalCall)) throw new Error('Invalid goalCalories goal');
 
      setRemainingWater(goal);
      setRemainingSteps(steps);
      setGoalCalories(goalCall);
      await AsyncStorage.setItem('@remainingWater', goal.toString());
      await AsyncStorage.setItem('@remainingSteps', steps.toString());
      await AsyncStorage.setItem('@goalCalories', goalCall.toString());
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
    Alert.alert('通知', '水分摂取量を登録しました', [{ text: 'OK' }]);
 
  }, [waterIntake]);
 
  // if HealthKit doesn't work properly, use this function to handle steps intake manually
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
 
    Alert.alert('通知', '歩数を登録しました', [{ text: 'OK' }]);
 
  }, [steps]);
 
  const handleMealSave = useCallback((mealType: MealType, newData: MealData) => {
    setMeals(prev => {
      const existing = prev[mealType];
 
      const updatedFoods = [
        ...existing.foods,
        ...newData.foods.map(food => ({ ...food, id: Date.now().toString() + Math.random().toString(), quantity: 1 }))
      ];
 
      const newFat = updatedFoods.reduce((sum, food) => sum + food.fat * food.quantity, 0);
      const newCarbs = updatedFoods.reduce((sum, food) => sum + food.carbs * food.quantity, 0);
      const newProtein = updatedFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0);
      const newTotalCalories = updatedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0);
      const newPercentage =  Math.round((newTotalCalories / goalCalories) * 100);
 
       const newMeals = {
          ...prev,
          [mealType]: {
            fat: newFat,
            carbs: newCarbs,
            protein: newProtein,
            totalCalories: newTotalCalories,
            percentage: newPercentage,
            foods: updatedFoods
          }
        };
 
        const allTotalCalories = Object.values(newMeals).reduce(
          (sum, meal) => sum + meal.totalCalories,
          0
        );
 
        (async () => {
          try {
            await AsyncStorage.setItem('@calories', allTotalCalories.toString());
          } catch (err) {
            console.error('Failed to save calories to Async Storage', err);
          }
        })();
 
        return newMeals;
      });
  }, []);
 
  const updateFoodQuantity = useCallback((mealType: MealType, foodId: string, delta: number) => {
    setMeals(prevMeals => {
      const updatedMeals = { ...prevMeals };
      const mealToUpdate = { ...updatedMeals[mealType] };
      const updatedFoods = mealToUpdate.foods.map(food => {
        if (food.id === foodId) {
          const newQuantity = Math.max(1, food.quantity + delta);
          return { ...food, quantity: newQuantity };
        }
        return food;
      });
 
      const newFat = updatedFoods.reduce((sum, food) => sum + food.fat * food.quantity, 0);
      const newCarbs = updatedFoods.reduce((sum, food) => sum + food.carbs * food.quantity, 0);
      const newProtein = updatedFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0);
      const newTotalCalories = updatedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0);
      const newPercentage = Math.round((newTotalCalories / goalCalories) * 100);
 
      updatedMeals[mealType] = {
        fat: newFat,
        carbs: newCarbs,
        protein: newProtein,
        totalCalories: newTotalCalories,
        percentage: newPercentage,
        foods: updatedFoods,
      };
      return updatedMeals;
    });
  }, []);
 
  const removeFoodItem = useCallback((mealType: MealType, foodId: string) => {
    setMeals(prevMeals => {
      const updatedMeals = { ...prevMeals };
      const mealToUpdate = { ...updatedMeals[mealType] };
      const updatedFoods = mealToUpdate.foods.filter(food => food.id !== foodId);
 
      const newFat = updatedFoods.reduce((sum, food) => sum + food.fat * food.quantity, 0);
      const newCarbs = updatedFoods.reduce((sum, food) => sum + food.carbs * food.quantity, 0);
      const newProtein = updatedFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0);
      const newTotalCalories = updatedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0);
      const newPercentage = updatedFoods.length > 0 ? Math.round((newTotalCalories / goalCalories) * 100) : 0;
 
      updatedMeals[mealType] = {
        fat: newFat,
        carbs: newCarbs,
        protein: newProtein,
        totalCalories: newTotalCalories,
        percentage: newPercentage,
        foods: updatedFoods,
      };
      return updatedMeals;
    });
  }, []);
 
 
  const handleAddMeal = (mealType: MealType) => {
    router.push({
    pathname: '/SelectFoodScreen',
    params: { mealType }, // kirim hanya string
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
 
    const percentage = Math.round((total.totalCalories / goalCalories) * 100);
    return { ...total, percentage };
  };
 
  const saveMealsToStorage = async () => {
    try {
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
      await fetch('http://192.168.1.12:3000/daily-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, log_date, calories: totalCalories, waterIntake: water, steps: steps }),
      });
    } catch (err) {
      console.error('Sending data failed:', err);
    }
  };
 
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
  const resetStoredData = async () => {
    try {
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
    if (mealType && mealData) {
      handleMealSave(mealType as MealType, mealData as MealData);
      router.replace('/DailyHealthScreen'); 
    }
  }, [mealType, mealData]);
  
  useFocusEffect(
    useCallback(() => {
      const loadRemainingWater = async () => {
        const value = await AsyncStorage.getItem('@remainingWater');
        if (value != null) {
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
        if (value != null) {
          setRemainingSteps(parseInt(value));
        }
      };
 
      loadRemainingSteps();
    }, [])
  );
 
  useEffect(() => {
    const goalCall = async () => {
      const value = parseInt(await AsyncStorage.getItem('@goalCalories') || '0', 10);
      setGoalCalories(value);
    };
    goalCall();
  }, []);

  //useEffect to call the step from HealthKit
  // useEffect(() => {
  //   const fetchSteps = async () => {
  //     try {
  //       await initHealthKit();
  //       const stepCount = await getStepCount();
  //       setSteps(stepCount.toString());
  //     } catch (error) {
  //       console.error('Failed to fetch steps from HealthKit:', error);
  //     }
  //   };
 
  //   fetchSteps();
  // }, []);

   useFocusEffect(
    useCallback(() => {
      const loadMeals = async () => {
        try {
          const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
          const loadedMeals: Record<MealType, MealData> = {
            breakfast: defaultMealData(),
            lunch: defaultMealData(),
            dinner: defaultMealData(),
            snack: defaultMealData(),
          };

          for (const type of mealTypes) {
            const stored = await AsyncStorage.getItem(`@selectedMealData_${type}`);
            if (stored) {
              loadedMeals[type] = JSON.parse(stored);
            }
          }
          setMeals(loadedMeals);
        } catch (error) {
          console.error('Failed to load meals:', error);
        }
      };
      loadMeals();
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
      <View key={mealKey} style={styles.mealSectionCard}> 
       
        <View style={styles.mealHeaderRow}>
          <Text style={styles.mealNameTitle}>{mealName}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddMeal(mealKey)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
 
        
        {mealData.foods.map((food) => (
          <View key={food.id} style={styles.foodItemRegularRow}> 
            
            <View style={styles.foodDetails}>
              <Text style={styles.foodName}>{String(food.name)}</Text>
              <Text style={styles.foodCalories}>
                {Math.round(food.calories * food.quantity)} kcal
              </Text>
            </View>
 
            
            <View style={styles.foodActions}>
              <TouchableOpacity
                onPress={() => updateFoodQuantity(mealKey, food.id, -1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.foodQuantity}>{food.quantity}</Text>
              <TouchableOpacity
                onPress={() => updateFoodQuantity(mealKey, food.id, 1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeFoodItem(mealKey, food.id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6347" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };
 
  return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
     
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
              returnKeyType="done" // Tambahkan ini
              blurOnSubmit={true}  // Agar keyboard bisa hilang setelah enter
            />
            <Text style={styles.unit}>ml</Text>
          </View>
        </View>
        <Text style={styles.goalText}>目標まであと {remainingWater} ml必要です!</Text>
      </View>

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
              returnKeyType="done" // Tambahkan ini
              blurOnSubmit={true}  // Agar keyboard bisa hilang setelah enter
            />
            <Text style={styles.unit}>歩</Text>
          </View>
        </View>
        <Text style={styles.goalText}>目標まであと {remainingSteps} 歩必要です！</Text>
      </View>

 
       
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>食事</Text>
 
         
          <View style={styles.mealHeader}>
            <Text style={styles.mealHeaderText}>脂質</Text>
            <Text style={styles.mealHeaderText}>炭水</Text>
            <Text style={styles.mealHeaderText}>た質</Text>
            <Text style={styles.mealHeaderText}>摂取%</Text>
            <Text style={styles.mealHeaderText}>カロリー</Text>
          </View>
 
         
          <View style={styles.nutritionValuesRow}>
            <Text style={styles.nutritionValue}>{total.fat}g</Text>
            <Text style={styles.nutritionValue}>{Math.round(total.carbs)}g</Text>
            <Text style={styles.nutritionValue}>{total.protein}g</Text>
            <Text style={styles.nutritionValue}>{total.percentage}%</Text>
            <Text style={styles.calorieValue}>{total.totalCalories} kcal</Text>
          </View>
 
        
          <View style={styles.mealsContainer}>
            {(Object.keys(meals) as MealType[]).map((key) =>
              renderMealSection(key, meals[key])
            )}
          </View>
        </View>
 
        
        <View style={styles.bottomPadding} />
      </ScrollView>
 
      
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
  // Gaya untuk item makanan individual di dalam daftar (tidak membulat)
  foodItemRegularRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1, // Tambahkan garis pemisah
    borderBottomColor: '#f0f0f0', // Warna garis pemisah
    backgroundColor: '#fff', // Latar belakang putih
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    color: '#333333',
  },
  foodCalories: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#555555',
  },
  foodQuantity: {
    fontSize: 16,
    color: '#333333',
    marginHorizontal: 8,
  },
  removeButton: {
    marginLeft: 15,
    padding: 5,
  },
  mealSectionCard: {
    backgroundColor: '#FFFFFF', // Latar belakang putih
    borderRadius: 12, // Sudut membulat untuk kartu meal
    marginVertical: 8, // Spasi vertikal antar kartu meal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  mealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8', // Latar belakang sedikit abu-abu untuk header meal
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mealNameTitle: {
    fontSize: 16,
    color: 'black',
  },
 
  activeNavItem: {
    opacity: 1,
  },
  container: {
    paddingTop: 10,
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
  mealName: { // Ini adalah gaya lama untuk meal name di foodItemRow, mungkin perlu disesuaikan atau dihapus
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8B7CF6', // Warna ungu yang lebih menonjol
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  foodItemName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  foodItemCalories: {
    fontSize: 12,
    color: '#666',
    minWidth: 60,
    textAlign: 'right',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  foodItemQuantity: {
    fontSize: 14,
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
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
 
 