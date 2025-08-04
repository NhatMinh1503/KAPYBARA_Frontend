import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to add water intake and update remaining water goal
export const addWaterIntake = async (amount: number): Promise<number> => {
  const current = parseInt(await AsyncStorage.getItem('@waterIntake') ?? '0');
  const newTotal = current + amount;
  await AsyncStorage.setItem('@waterIntake', newTotal.toString());

  const remaining = parseInt(await AsyncStorage.getItem('@remainingWater') ?? '0');
  const newRemaining = Math.max(remaining - amount, 0);
  await AsyncStorage.setItem('@remainingWater', newRemaining.toString());

  return newRemaining;
};

// Function to add steps intake and update remaining steps goal
export const addStepsIntake = async (amount: number): Promise<number> => {
  const current = parseInt(await AsyncStorage.getItem('@stepsIntake') ?? '0');
  const newTotal = current + amount;
  await AsyncStorage.setItem('@stepsIntake', newTotal.toString());

  const remaining = parseInt(await AsyncStorage.getItem('@remainingSteps') ?? '0');
  const newRemaining = Math.max(remaining - amount, 0);
  await AsyncStorage.setItem('@remainingSteps', newRemaining.toString());

  return newRemaining;
};
