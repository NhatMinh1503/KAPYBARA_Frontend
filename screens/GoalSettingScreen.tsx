import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
type RootStackParamList = {
  IndexLogin: undefined;
  VirtualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen:undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: undefined;
  UserProfileScreen: undefined;
  GoalSetting: undefined;
};

type GoalSettingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GoalSetting'
>;

interface Props {
  navigation: GoalSettingScreenNavigationProp;
}

interface GoalData {
  weight: string;
  steps: string;
  calories: string;
  water: string;
}

interface GoalConfig {
  key: keyof GoalData;
  label: string;
  unit: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string;
  min: number;
  max: number;
  defaultValue: string;
}

// Default goals constant
const defaultGoals: GoalData = {
  weight: '0',
  steps: '0',
  calories: '0',
  water: '0',
};

const GoalSettingScreen: React.FC<Props> = ({ navigation }) => {
  const [goals, setGoals] = useState<GoalData>(defaultGoals);
  const [hasChanges, setHasChanges] = useState(false);
  

  //Function to get Goals from database
  const goalsData = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('token');

    try{
      if (!user_id) return Alert.alert('エラー', 'ユーザーIDが見つかりません。ログインしてください。');
      
      const response = await fetch(`http://localhost:3000/goals/${user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if(response.ok){
          const data = await response.json();

          setGoals({
            weight: data.goalWeight,
            steps: data.steps,
            calories: data.goalCalories,
            water: data.waterGoal
          });
        }
    } catch(err){
      console.log("Failed to get goals", err);
    }
  };

  // Goal configurations
  const goalConfigs: GoalConfig[] = [
    {
      key: 'weight',
      label: '目標体重',
      unit: 'kg',
      icon: 'scale-outline',
      placeholder: '例: 60',
      min: 40,
      max: 150,
      defaultValue: defaultGoals.weight,
    },
    {
      key: 'steps',
      label: '目標歩数',
      unit: '歩',
      icon: 'walk-outline',
      placeholder: '例: 10000',
      min: 1000,
      max: 50000,
      defaultValue: defaultGoals.steps,
    },
    {
      key: 'calories',
      label: '目標摂取カロリー',
      unit: 'kcal',
      icon: 'restaurant-outline',
      placeholder: '例: 2000',
      min: 800,
      max: 5000,
      defaultValue: defaultGoals.calories,
    },
    {
      key: 'water',
      label: '目標水分摂取量',
      unit: 'ml',
      icon: 'water-outline',
      placeholder: '例: 2000',
      min: 500,
      max: 5000,
      defaultValue: defaultGoals.water,
    },
  ];

  const handleGoalChange = (key: keyof GoalData, value: string) => {
    // Filter hanya angka
    const numericValue = value.replace(/[^0-9]/g, '');
    setGoals((prev) => ({
      ...prev,
      [key]: numericValue,
    }));
    setHasChanges(true);
  };

  const validateGoal = (config: GoalConfig, value: string): boolean => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return false;
    return numValue >= config.min && numValue <= config.max;
  };

  const handleSave = async () => {
    const validationErrors: string[] = [];

    goalConfigs.forEach((config) => {
      const value = goals[config.key];
      if (!value || !validateGoal(config, value)) {
        validationErrors.push(
          `${config.label}は${config.min}〜${config.max}${config.unit}の範囲で設定してください`
        );
      }
    });

    if (validationErrors.length > 0) {
      Alert.alert('入力エラー', validationErrors.join('\n'), [{ text: 'OK' }]);
      return;
    }

    const user_id = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('token');

    try{
      const response = await fetch(`http://localhost:3000/goal_setting/${user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
          {
            goalWeight : parseInt(goals.weight),
            steps: parseInt(goals.steps),
            goalCalories: parseInt(goals.calories),
            goalWater: parseInt(goals.water)
          })
      });

      if(response.ok){
        Alert.alert('更新完了', '目標が保存されました');
        setHasChanges(false);
        navigation.goBack();
      }
    }catch(err){
      console.error('Failed to update goals', err);
      Alert.alert('エラー', '通信エラーが発生しました');
    }

    Alert.alert('保存完了', '目標が保存されました', [
      {
        text: 'OK',
        onPress: () => {
          setHasChanges(false);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert('リセット確認', 'すべての目標をデフォルト値に戻しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'リセット',
        style: 'destructive',
        onPress: () => {
          setGoals(defaultGoals);
          setHasChanges(true);
        },
      },
    ]);
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert('未保存の変更', '変更内容が保存されていません。破棄しますか？', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '破棄',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
      goalsData();
    }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />

      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
    <Ionicons name="chevron-back" size={24} color="#333" />
  </TouchableOpacity>
        <Text style={styles.headerTitle}>目標設定</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>リセット</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color="#4A90E2" />
          <Text style={styles.infoText}>
            健康目標を設定してください。これらの目標は、グラフやレポートで進捗を追跡するために使用されます。
          </Text>
        </View>

        {/* Goal Settings */}
        {goalConfigs.map((config) => {
          const currentValue = goals[config.key];
          const isValid = currentValue && validateGoal(config, currentValue);

          return (
            <View key={config.key} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleContainer}>
                  <Ionicons name={config.icon} size={24} color="#4A90E2" />
                  <Text style={styles.goalTitle}>{config.label}</Text>
                </View>
                <Text style={styles.goalUnit}>{config.unit}</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.goalInput,
                    !isValid && currentValue && styles.invalidInput,
                  ]}
                  value={currentValue}
                  onChangeText={(value) => handleGoalChange(config.key, value)}
                  placeholder={config.placeholder}
                  keyboardType="numeric"
                  maxLength={6}
                />
                <Text style={styles.inputUnit}>{config.unit}</Text>
              </View>

              <Text style={styles.goalRange}>
                推奨範囲: {config.min} - {config.max} {config.unit}
              </Text>

              {!isValid && currentValue && (
                <Text style={styles.errorText}>
                  {config.min} - {config.max} {config.unit}の範囲で入力してください
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text
            style={[
              styles.saveButtonText,
              !hasChanges && styles.saveButtonTextDisabled,
            ]}
          >
            目標を保存
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    padding: 5,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1976d2',
    lineHeight: 18,
    marginLeft: 10,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  goalUnit: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  goalInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 15,
    textAlign: 'right',
  },
  invalidInput: {
    color: '#ff6b6b',
  },
  inputUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    fontWeight: '500',
  },
  goalRange: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 5,
  },
  presetSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  presetButtonText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  saveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
});

export default GoalSettingScreen;
