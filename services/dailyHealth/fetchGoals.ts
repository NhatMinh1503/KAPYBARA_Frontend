import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export async function fetchGoals(userId: string): Promise<{ waterGoal: number; stepsGoal: number; calorieGoal: number }> {
  try {
    const response = await fetch(`http://localhost:3000/goals/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch goals');
    const data = await response.json();

    const waterGoal = parseInt(data.waterGoal);
    const stepsGoal = parseInt(data.steps);
    const calorieGoal = parseInt(data.goalCalories);

    if (isNaN(waterGoal) || isNaN(stepsGoal) || isNaN(calorieGoal)) {
      throw new Error('Invalid goals data');
    }

    await AsyncStorage.setItem('@remainingWater', waterGoal.toString());
    await AsyncStorage.setItem('@remainingSteps', stepsGoal.toString());
    await AsyncStorage.setItem('@goalCalories', calorieGoal.toString());

    return { waterGoal, stepsGoal, calorieGoal };
  } catch (error) {
    console.error(error);
    Alert.alert('エラー', '目標を取得できませんでした。');
    throw error;
  }
}
