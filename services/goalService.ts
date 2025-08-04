import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GoalData {
  weight: string;
  steps: string;
  calories: string;
  water: string;
}

export interface GoalConfig {
  key: keyof GoalData;
  label: string;
  unit: string;
  icon: string;
  placeholder: string;
  min: number;
  max: number;
  defaultValue: string;
}

export const defaultGoals: GoalData = {
  weight: '0',
  steps: '0',
  calories: '0',
  water: '0',
};

export const fetchGoals = async (): Promise<GoalData | null> => {
  try {
    const user_id = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('token');

    if (!user_id) {
      throw new Error('ユーザーIDが見つかりません。ログインしてください。');
    }

    const response = await fetch(`http://10.108.1.0:3000/goals/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        weight: data.goalWeight?.toString() ?? '0',
        steps: data.steps?.toString() ?? '0',
        calories: data.goalCalories?.toString() ?? '0',
        water: data.waterGoal?.toString() ?? '0',
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return null;
  }
};

export const saveGoals = async (goals: GoalData): Promise<boolean> => {
  try {
    const user_id = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`http://10.108.1.0:3000/goal_setting/${user_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        goalWeight: parseInt(goals.weight),
        steps: parseInt(goals.steps),
        goalCalories: parseInt(goals.calories),
        goalWater: parseInt(goals.water),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to save goals:', error);
    return false;
  }
};
