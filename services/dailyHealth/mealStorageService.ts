import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealData, MealType } from '../../types';

// Default meal data structure
export const defaultMealData = (): MealData => ({
  fat: 0,
  carbs: 0,
  protein: 0,
  percentage: 0,
  totalCalories: 0,
  foods: [],
});

// Function to load meals from AsyncStorage
export async function loadMeals(): Promise<Record<MealType, MealData>> {
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
  return loadedMeals;
}

// Function to save meals to AsyncStorage
export async function saveMeals(meals: Record<MealType, MealData>) {
  for (const [mealType, mealData] of Object.entries(meals)) {
    await AsyncStorage.setItem(`@selectedMealData_${mealType}`, JSON.stringify(mealData));
  }
}
