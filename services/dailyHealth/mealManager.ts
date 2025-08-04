import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealData, MealType } from '../../types';

// Function to add meal data and update the meal storage
export const addMealData = async (
  currentMeals: Record<MealType, MealData>,
  mealType: MealType,
  newData: MealData,
  goalCalories: number
): Promise<Record<MealType, MealData>> => {
  const existing = currentMeals[mealType];

  const updatedFoods = [
    ...existing.foods,
    ...newData.foods.map(food => ({
      ...food,
      id: Date.now().toString() + Math.random().toString(),
      quantity: 1
    }))
  ];

  const updatedMeal = calculateMeal(updatedFoods, goalCalories);

  const newMeals = {
    ...currentMeals,
    [mealType]: updatedMeal
  };

  const totalCalories = Object.values(newMeals).reduce((sum, m) => sum + m.totalCalories, 0);
  await AsyncStorage.setItem('@calories', totalCalories.toString());

  return newMeals;
};

// Function to update food quantity in a meal and recalculate the meal data
export const updateFoodQuantityInMeal = (
  currentMeals: Record<MealType, MealData>,
  mealType: MealType,
  foodId: string,
  delta: number,
  goalCalories: number
): Record<MealType, MealData> => {
  const meal = currentMeals[mealType];
  const updatedFoods = meal.foods.map(food => {
    if (food.id === foodId) {
      const newQuantity = Math.max(1, food.quantity + delta);
      return { ...food, quantity: newQuantity };
    }
    return food;
  });

  const updatedMeal = calculateMeal(updatedFoods, goalCalories);
  return { ...currentMeals, [mealType]: updatedMeal };
};

// Function to remove food from a meal and recalculate the meal data
export const removeFoodFromMeal = (
  currentMeals: Record<MealType, MealData>,
  mealType: MealType,
  foodId: string,
  goalCalories: number
): Record<MealType, MealData> => {
  const meal = currentMeals[mealType];
  const updatedFoods = meal.foods.filter(food => food.id !== foodId);

  const updatedMeal = calculateMeal(updatedFoods, goalCalories);
  return { ...currentMeals, [mealType]: updatedMeal };
};

// Helper function to calculate meal nutrition based on foods and goal calories
export const calculateMeal = (foods: MealData['foods'], goalCalories: number): MealData => {
  const fat = foods.reduce((sum, f) => sum + f.fat * f.quantity, 0);
  const carbs = foods.reduce((sum, f) => sum + f.carbs * f.quantity, 0);
  const protein = foods.reduce((sum, f) => sum + f.protein * f.quantity, 0);
  const totalCalories = foods.reduce((sum, f) => sum + f.calories * f.quantity, 0);
  const percentage = goalCalories ? Math.round((totalCalories / goalCalories) * 100) : 0;

  return {
    fat,
    carbs,
    protein,
    totalCalories,
    percentage,
    foods,
  };
};
