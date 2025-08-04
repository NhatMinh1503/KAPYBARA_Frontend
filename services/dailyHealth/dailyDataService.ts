import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to send daily health data to the server
export const sendDailyData = async (calories: number, water: number, steps: number) => {
  try {
    await fetch('http://localhost:3000/daily-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  calories, waterIntake: water, steps }),
    });
  } catch (err) {
    console.error('Sending data failed:', err);
  }
};

// Function to reset data daily
export const resetDailyData = async (calories: number, water: number, steps: number) => {
  try {
    await sendDailyData(calories, water, steps);

    await AsyncStorage.setItem('@waterIntake', '0');
    await AsyncStorage.setItem('@stepsIntake', '0');
    await AsyncStorage.setItem('@calories', '0');

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    for (const type of mealTypes) {
        await AsyncStorage.removeItem(`@selectedMealData_${type}`);
    }
  } catch (err) {
    console.error('Failed to reset data:', err);
  }
};

// Helper function getLogDate bisa kamu export juga dari sini atau file lain
export const getLogDate = (): string => {
  const now = new Date();
  if (now.getHours() < 3) now.setDate(now.getDate() - 1);
  return now.toISOString().split('T')[0];
};
