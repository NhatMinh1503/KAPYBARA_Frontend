// types.ts

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  name: string;
  calories: number;
  quantity?: number;
  fat?: number;
  carbs?: number;
  protein?: number;
  caloriesPerUnit?: number;
  fatPerUnit?: number;
  carbsPerUnit?: number;
  proteinPerUnit?: number;
}


export interface MealData {
  fat: number;
  carbs: number;
  protein: number;
  percentage: number;
  totalCalories: number;
  foods: FoodItem[];
}

export interface FoodItemDetailed {
  id: string;
  name: string;
  totalCalories: number;
  protein: number;
  fat: number;
  carbs: number;
  isEnabled: boolean;
}

export type RootStackParamList = {
  IndexLogin: undefined;
  VirtualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen: undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: {
  mealType?: MealType;
  mealData?: MealData;
} | undefined;
  UserProfileScreen: undefined;
  GoalSettingScreen: undefined;
  SelectFoodScreen: {
    mealType: MealType;
    onSave: (data: MealData) => void;
  };
};