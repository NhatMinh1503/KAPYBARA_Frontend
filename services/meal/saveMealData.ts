import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItemDetailed, MealData, MealType } from '../../types';

export async function saveMealData(mealType: MealType, selectedItems: FoodItemDetailed[]) {
  const totalCalories = selectedItems.reduce((sum, item) => sum + (item.totalCalories || 0), 0);
  const totalProtein = selectedItems.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalFat = selectedItems.reduce((sum, item) => sum + (item.fat || 0), 0);
  const totalCarbs = selectedItems.reduce((sum, item) => sum + (item.carbs || 0), 0);

  const newFoods = selectedItems.map(item => ({
    name: item.name,
    calories: item.totalCalories || 0,
    fat: item.fat || 0,
    carbs: item.carbs || 0,
    protein: item.protein || 0,
    id: item.id,
    quantity: 1,
  }));

  const oldDataStr = await AsyncStorage.getItem(`@selectedMealData_${mealType}`);
  const oldData: MealData = oldDataStr ? JSON.parse(oldDataStr) : {
    fat: 0,
    protein: 0,
    carbs: 0,
    totalCalories: 0,
    percentage: 0,
    foods: [],
  };

  const combinedFoods = [...oldData.foods, ...newFoods];

  const updatedMealData: MealData = {
    fat: combinedFoods.reduce((sum, item) => sum + (item.fat || 0), 0),
    protein: combinedFoods.reduce((sum, item) => sum + (item.protein || 0), 0),
    carbs: combinedFoods.reduce((sum, item) => sum + (item.carbs || 0), 0),
    totalCalories: combinedFoods.reduce((sum, item) => sum + (item.calories || 0), 0),
    percentage: 0,
    foods: combinedFoods,
  };

  await AsyncStorage.setItem(`@selectedMealData_${mealType}`, JSON.stringify(updatedMealData));
}
