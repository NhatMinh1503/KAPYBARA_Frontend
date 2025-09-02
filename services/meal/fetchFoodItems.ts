import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItemDetailed } from '../../types';

// Function to fetch food items from database based on search text
export async function fetchFoodItems(searchText: string): Promise<FoodItemDetailed[]> {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`http://localhost:3000/food_data?name=${searchText.trim()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data.map((food: any) => ({
    id: food.food_id?.toString() || Math.random().toString(),
    name: (food.fname || 'Unknown Food').trim(),
    totalCalories: food.calories,
    protein: food.protein,
    fat: food.fat,
    carbs: food.carbohidrates,
    isEnabled: false,
  }));
}
