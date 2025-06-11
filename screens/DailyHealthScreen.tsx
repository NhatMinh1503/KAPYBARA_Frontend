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
import { MealType, MealData, FoodItem, RootStackParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DailyHealthScreen'>;
type DailyHealthRouteProp = RouteProp<RootStackParamList, 'DailyHealthScreen'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: DailyHealthRouteProp;
}

const DailyHealthScreen: React.FC<Props> = ({ navigation, route }) => {
  const [waterIntake, setWaterIntake] = useState('');
  const [steps, setSteps] = useState('');
  const isFocused = useIsFocused();

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

      navigation.setParams({
        mealType: undefined,
        mealData: undefined,
      });
    }
  }, [isFocused, route.params]);

  const handleAddMeal = (mealType: MealType) => {
    navigation.navigate('SelectFoodScreen', {
      mealType,
      onSave: (data: MealData) => handleMealSave(mealType, data),
    });
  };

  const handleMealSave = (mealType: MealType, newdata: MealData) => {
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

  // Load meals from AsyncStorage
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

  const getStorageData = () => {
    const logicalDate = getLogDate();
    return `@meals:${logicalDate}`;
  };

  // Save meals to AsyncStorage on change
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

  // Reset stored data daily and send calories to backend
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

  function getLogDate() {
    const now = new Date();
    const hour = now.getHours();

    const logicalDate = new Date(now);
    if (hour < 3) {
      logicalDate.setDate(now.getDate() - 1);
    }

    return logicalDate.toISOString().split('T')[0];
  }

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

  const renderMealSection = (mealKey: MealType, mealData: MealData) => {
    const mealNameMap = {
      breakfast: '朝食',
      lunch: '昼食',
      dinner: '夕食',
      snack: '間食',
    };
    const mealName = mealNameMap[mealKey];

    return (
      <View key={mealKey}>
        {mealData.foods.length > 0 ? (
          <View>
            <View style={styles.mealRowWithData}>
              <Text style={styles.mealName}>{mealName}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddMeal(mealKey)}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            {mealData.foods.map((food, index) => (
              <View key={index} style={styles.foodItemRow}>
                <Text style={styles.foodItemName}>{food.name}</Text>
                <Text style={styles.foodItemCalories}>{food.calories}</Text>
              </View>
            ))}
          </View>
        ) : (
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
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>健康管理</Text>

        <View style={styles.inputRow}>
          <Text style={styles.label}>水分摂取量 (ml):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={waterIntake}
            onChangeText={setWaterIntake}
            placeholder="例: 2000"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>歩数:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={steps}
            onChangeText={setSteps}
            placeholder="例: 5000"
          />
        </View>

        <View style={styles.mealsContainer}>
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((mealKey) =>
            renderMealSection(mealKey, meals[mealKey])
          )}
        </View>

        <View style={styles.totalNutrition}>
          <Text style={styles.totalNutritionTitle}>合計栄養素</Text>
          <Text>脂質: {total.fat.toFixed(1)} g</Text>
          <Text>炭水化物: {total.carbs.toFixed(1)} g</Text>
          <Text>タンパク質: {total.protein.toFixed(1)} g</Text>
          <Text>合計カロリー: {total.totalCalories.toFixed(0)} kcal</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5F0E3',
  },
  scrollViewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    borderColor: '#a0a0a0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: 'white',
  },
  mealsContainer: {
    marginTop: 10,
  },
  mealRowEmpty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  mealRowWithData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 20,
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 2,
  },
  foodItemName: {
    fontSize: 16,
  },
  foodItemCalories: {
    fontSize: 16,
  },
  totalNutrition: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#b4d7c4',
    borderRadius: 15,
  },
  totalNutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default DailyHealthScreen;