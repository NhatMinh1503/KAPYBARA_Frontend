import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Type definitions
type RootStackParamList = {
  IndexLogin: undefined;
  VitualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen:undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: undefined;
  UserProfileScreen: undefined;
  SelectFoodScreen: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DailyHealthScreen'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface FoodItem {
  name: string;
  calories: number;
}

interface MealData {
  fat: number;
  carbs: number;
  protein: number;
  percentage: number;
  totalCalories: number;
  foods: FoodItem[];
}

const DailyHealthScreen: React.FC<Props> = ({ navigation }) => {
  const [waterIntake, setWaterIntake] = useState('');
  const [steps, setSteps] = useState('');
  
  // Sample data - akan diganti dengan data dari backend
  const [mealsData, setMealsData] = useState({
    breakfast: {
      fat: 11.27,
      carbs: 3.95,
      protein: 11.2,
      percentage: 18,
      totalCalories: 164,
      foods: [
        { name: '豚骨ラ', calories: 83 },
        { name: 'さけいか漬物ナ', calories: 81 }
      ]
    } as MealData,
    lunch: null as MealData | null,
    dinner: null as MealData | null,
    snack: null as MealData | null,
  });

  const mealNames = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夜食',
    snack: '軽食'
  };

  const addFood = (mealKey: string) => {
    // Function to handle adding food - will be connected to backend
    console.log(`Add food to ${mealKey}`);
  };

  const renderMealSection = (mealKey: keyof typeof mealsData, mealData: MealData | null) => {
    const mealName = mealNames[mealKey];
    
    return (
      <View key={mealKey}>
        {mealData ? (
          <View>
            {/* Nutrition values row */}
            <View style={styles.nutritionValuesRow}>
              <Text style={styles.nutritionValue}>{mealData.fat}</Text>
              <Text style={styles.nutritionValue}>{mealData.carbs}</Text>
              <Text style={styles.nutritionValue}>{mealData.protein}</Text>
              <Text style={styles.nutritionValue}>{mealData.percentage}%</Text>
              <Text style={styles.calorieValue}>{mealData.totalCalories}</Text>
            </View>
            
            {/* Meal name with underline */}
            <View style={styles.mealRowWithData}>
              <Text style={styles.mealName}>{mealName}</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('SelectFoodScreen')}
                >
                <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            
            {/* Food items */}
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
                onPress={() => navigation.navigate('SelectFoodScreen')}
                >
                <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Water Intake Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>水分摂取</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={waterIntake}
                onChangeText={setWaterIntake}
                placeholder=""
                keyboardType="numeric"
              />
              <Text style={styles.unit}>ml</Text>
            </View>
          </View>
          <Text style={styles.goalText}>目標まであと 2 ml必要です！</Text>
        </View>

        {/* Steps Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>歩数</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={steps}
                onChangeText={setSteps}
                placeholder=""
                keyboardType="numeric"
              />
              <Text style={styles.unit}>歩</Text>
            </View>
          </View>
          <Text style={styles.goalText}>目標まであと 7歩必要です！</Text>
        </View>

        {/* Meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>食事</Text>
          
          {/* Nutrition Headers */}
          <View style={styles.mealHeader}>
            <Text style={styles.mealHeaderText}>脂質</Text>
            <Text style={styles.mealHeaderText}>炭</Text>
            <Text style={styles.mealHeaderText}>た質</Text>
            <Text style={styles.mealHeaderText}>摂取%</Text>
            <Text style={styles.mealHeaderText}>カロリー</Text>
          </View>

          {/* Meals List */}
          <View style={styles.mealsContainer}>
            {Object.entries(mealsData).map(([key, data]) => 
              renderMealSection(key as keyof typeof mealsData, data)
            )}
          </View>
        </View>
        
        {/* Add some bottom padding for the fixed navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
                  <View style={styles.bottomNav}>
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('ReminderScreen')}
                    >
                      <Ionicons name="time-outline" size={24} color="#666" />
                    </TouchableOpacity>
                 
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('ProgressTrackerScreen')}
                    >
                      <Ionicons name="stats-chart-outline" size={24} color="#666" />
                    </TouchableOpacity>
                 
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('HomeScreen')}
                    >
                      <Ionicons name="home" size={24} color="#8B7CF6" />
                    </TouchableOpacity>
                 
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('DailyHealthScreen')}
                    >
                      <Ionicons name="create-outline" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.navItem}
                      onPress={() => navigation.navigate('UserProfileScreen')}
                    >
                      <Ionicons name="person-outline" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
       
       
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    textAlign: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  unit: {
    fontSize: 14,
    color: '#666',
  },
  goalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
  },
  mealHeaderText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  mealsContainer: {
    backgroundColor: '#fff',
  },
  nutritionValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  nutritionValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  calorieValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  mealRowWithData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mealRowEmpty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  mealName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodItemName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  foodItemCalories: {
    fontSize: 12,
    color: '#666',
    minWidth: 30,
    textAlign: 'right',
  },
  reportButton: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reportButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  bottomPadding: {
    height: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 8,
  },
});

export default DailyHealthScreen;