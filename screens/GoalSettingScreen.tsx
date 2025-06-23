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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

// Type definitions
type RootStackParamList = {
  IndexLogin: undefined;
  VirtualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen: undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: undefined;
  UserProfileScreen: undefined;
  GoalSettingScreen: undefined;
};

type GoalSettingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GoalSettingScreen'
>;

interface Props {
  navigation: GoalSettingScreenNavigationProp;
}

interface GoalData {
  weight: string;
  steps: string;
  calories: string;
  water: string;
  bedtime?: string;
  wakeup?: string;
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

const defaultGoals: GoalData = {
  weight: '60',
  steps: '10000',
  calories: '2000',
  water: '2000',
  bedtime: '23:00',
  wakeup: '07:00',
};

const GoalSettingScreen: React.FC<Props> = ({ navigation }) => {
  const [goals, setGoals] = useState<GoalData>(defaultGoals);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPicker, setShowPicker] = useState<{ type: 'bedtime' | 'wakeup' | null }>({ type: null });

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

  const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setShowPicker({ type: null });
      return;
    }
    const hours = selectedDate.getHours().toString().padStart(2, '0');
    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    if (showPicker.type === 'bedtime') {
      setGoals((prev) => ({ ...prev, bedtime: formattedTime }));
    } else if (showPicker.type === 'wakeup') {
      setGoals((prev) => ({ ...prev, wakeup: formattedTime }));
    }
    setHasChanges(true);
    setShowPicker({ type: null });
  };

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

  const handleSave = () => {
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

    console.log('Saving goals:', goals);

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
                  style={[styles.goalInput, !isValid && currentValue && styles.invalidInput]}
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

        {/* Bedtime Picker */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleContainer}>
              <Ionicons name="moon-outline" size={24} color="#4A90E2" />
              <Text style={styles.goalTitle}>就寝時間</Text>
            </View>
            <Text style={styles.goalUnit}>HH:mm</Text>
          </View>

          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={goals.bedtime}
              onChange={(e) => {
                setGoals((prev) => ({ ...prev, bedtime: e.target.value }));
                setHasChanges(true);
              }}
              style={styles.webTimeInput} // Apply web-specific style
            />
          ) : (
            <TouchableOpacity
              style={styles.inputContainer} // Apply existing input container style
              onPress={() => setShowPicker({ type: 'bedtime' })}
            >
              <Text style={styles.goalInput}>{goals.bedtime}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Wakeup Picker */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleContainer}>
              <Ionicons name="sunny-outline" size={24} color="#4A90E2" />
              <Text style={styles.goalTitle}>起床時間</Text>
            </View>
            <Text style={styles.goalUnit}>HH:mm</Text>
          </View>

          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={goals.wakeup}
              onChange={(e) => {
                setGoals((prev) => ({ ...prev, wakeup: e.target.value }));
                setHasChanges(true);
              }}
              style={styles.webTimeInput} // Apply web-specific style
            />
          ) : (
            <TouchableOpacity
              style={styles.inputContainer} // Apply existing input container style
              onPress={() => setShowPicker({ type: 'wakeup' })}
            >
              <Text style={styles.goalInput}>{goals.wakeup}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text
            style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}
          >
            目標を保存
          </Text>
        </TouchableOpacity>
      </View>

      {/* DateTimePicker untuk iOS dan Android */}
      {showPicker.type && Platform.OS !== 'web' && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={
            new Date(
              2024,
              0,
              1,
              parseInt(goals[showPicker.type || 'bedtime']?.split(':')[0] || '0'),
              parseInt(goals[showPicker.type || 'bedtime']?.split(':')[1] || '0')
            )
          }
          onChange={handleTimeChange}
        />
      )}
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
  // New style for web time input to match native TextInput
  webTimeInput: {
    width: '100%',
    fontSize: 18,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 0, // Remove default border
    backgroundColor: '#f8f8f8',
    color: '#333',
    textAlign: 'right',
    // Add box shadow for consistency with native
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

export default GoalSettingScreen;