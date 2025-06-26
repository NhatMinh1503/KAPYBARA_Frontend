import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserRegister } from '../contexts/UserRegisterContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Register2: undefined;
  ChoosePetScreen: undefined;
  NextRegisterScreen: undefined;
  RegisterScreen: undefined;
};

type Register2ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register2'
>;

export default function Register2() {
  const navigation = useNavigation<Register2ScreenNavigationProp>();
  const { userData, setUserData } = useUserRegister();

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [health, setHealth] = useState('元気');
  const [steps, setSteps] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [wakeupTime, setWakeTime] = useState('07:00');
  const [waterIntake, setWaterIntake] = useState('');
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);

  const healthOptions = [
    { label: '元気', image: require('../assets/genki.png') },
    { label: '疲れ', image: require('../assets/tsukare.png') },
    { label: '病気', image: require('../assets/byoki.png') },
  ];

  const goalOptions = [
    { label: '体重を落としたい', value: '体重を落としたい' },
    { label: '筋肉をつけたい', value: '筋肉をつけたい' },
    { label: '健康維持したい', value: '健康維持したい' },
  ];

  const handleRegister = async () => {
    if (isNaN(parseInt(weight))) {
      Alert.alert("入力エラー", "体重を正しく入力してください。");
      return;
    }

    if (isNaN(parseInt(height))) {
      Alert.alert("入力エラー", "身長を正しく入力してください。");
      return;
    }

    if (steps !== '' && isNaN(parseInt(steps))) {
      Alert.alert("入力エラー", "歩数を正しく入力してください。");
      return;
    }

    if (goalWeight !== '' && isNaN(parseInt(goalWeight))) {
      Alert.alert("入力エラー", "目標体重を正しく入力してください。");
      return;
    }

    if (waterIntake !== '' && isNaN(parseInt(waterIntake))) {
      Alert.alert("入力エラー", "水分摂取量を正しく入力してください。");
      return;
    }

    const fullData = {
      ...userData,
      weight: parseInt(weight) || 0,
      height: parseInt(height) || 0,
      goal,
      health,
      steps: steps === '' ? 0 : parseInt(steps),
      goalWeight: goalWeight === '' ? 0 : parseInt(goalWeight),
      sleepTime: sleepTime ? `${sleepTime}:00` : null,
      wakeupTime: wakeupTime ? `${wakeupTime}:00` : null,
      goalWater: waterIntake === '' ? 0 : parseInt(waterIntake),
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      const data = await response.json();
      await AsyncStorage.setItem('user_id', data.user_id);

      Alert.alert('登録完了', 'ユーザー情報が正常に登録されました。');
      navigation.navigate('ChoosePetScreen');
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('登録エラー', 'Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  const selectedGoalLabel = goalOptions.find(opt => opt.value === goal)?.label || '選択してください';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>もう少しおしえてね！</Text>

          <View style={styles.inputGroup}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>身長</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={styles.inputInner}
                    placeholder=""
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                  />
                  <Text style={styles.unitInside}>cm</Text>
                </View>
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>今の体重</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={styles.inputInner}
                    placeholder=""
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                  <Text style={styles.unitInside}>kg</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>目標</Text>
                <TouchableOpacity
                  style={styles.modalToggleButton}
                  onPress={() => setGoalModalVisible(true)}
                >
                  <Text style={goal ? styles.modalToggleTextSelected : styles.modalToggleText}>
                    {selectedGoalLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#333" style={styles.dropdownIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>目標体重</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={styles.inputInner}
                    placeholder=""
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={goalWeight}
                    onChangeText={setGoalWeight}
                  />
                  <Text style={styles.unitInside}>kg</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>目標歩数</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={styles.inputInner}
                    placeholder=""
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={steps}
                    onChangeText={setSteps}
                  />
                  <Text style={styles.unitInside}>歩</Text>
                </View>
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>水分摂取</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={styles.inputInner}
                    placeholder=""
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={waterIntake}
                    onChangeText={setWaterIntake}
                  />
                  <Text style={styles.unitInside}>ml</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>就寝時間</Text>
                <View style={styles.inputWithUnit}>
                  {Platform.OS === 'web' ? (
                    <input
                      type="time"
                      value={sleepTime}
                      onChange={(e) => setSleepTime(e.target.value)}
                      style={styles.webTimeInput}
                    />
                  ) : (
                    <TextInput
                      style={styles.inputInner}
                      placeholder="00:00"
                      placeholderTextColor="#999"
                      value={sleepTime}
                      onChangeText={setSleepTime}
                    />
                  )}
                </View>
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>起床時間</Text>
                <View style={styles.inputWithUnit}>
                  {Platform.OS === 'web' ? (
                    <input
                      type="time"
                      value={wakeupTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      style={styles.webTimeInput}
                    />
                  ) : (
                    <TextInput
                      style={styles.inputInner}
                      placeholder="00:00"
                      placeholderTextColor="#999"
                      value={wakeupTime}
                      onChangeText={setWakeTime}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>今の健康状態</Text>
          <View style={styles.healthRow}>
            {healthOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.healthItem,
                  health === option.label && styles.selectedHealth,
                ]}
                onPress={() => setHealth(option.label)}
              >
                <Image source={option.image} style={styles.icon} />
                <Text style={styles.healthLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!goal) {
                Alert.alert('Peringatan', 'Tujuan harus dipilih.');
                return;
              }
              handleRegister();
            }}
          >

            <Text style={styles.buttonText}>登録</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isGoalModalVisible}
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>目標を選択してください</Text>
            {goalOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => {
                  setGoal(option.value);
                  setGoalModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setGoalModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F3FF',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 40,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 24,
    zIndex: 1,
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWithUnit: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputInner: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 36,
    color: '#000',
    fontSize: 16,
    height: 50,
  },
  unitInside: {
    position: 'absolute',
    right: 14,
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  half: {
    flex: 1,
  },
  modalToggleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 10,
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  modalToggleText: {
    color: '#999',
    fontSize: 16,
  },
  modalToggleTextSelected: {
    color: '#000',
    fontSize: 16,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 35,
  },
  healthItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedHealth: {
    borderColor: '#8B7CF6',
    backgroundColor: '#EEEDFF',
  },
  healthLabel: {
    marginTop: 6,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.2,
  },
  webTimeInput: {
    width: '100%',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0CDE1',
    backgroundColor: '#fff',
    color: '#000',
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 17,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#E8E0FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B7CF6',
  },
});
