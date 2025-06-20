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
  SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserRegister } from '../contexts/UserRegisterContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Untuk ikon panah kembali

type RootStackParamList = {
  Register2: undefined;
  ChoosePetScreen: undefined;
  NextRegisterScreen: undefined;
  RegisterScreen: undefined; // Tambahkan ini agar bisa kembali ke RegisterScreen
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
  const [sleepTime, setSleepTime] = useState('');
  const [wakeupTime, setWakeTime] = useState('');
  const [waterIntake, setWaterIntake] = useState('');

  const healthOptions = [
    { label: '元気', image: require('../assets/rabbit.png') },
    { label: '疲れ', image: require('../assets/rabbit.png') },
    { label: '病気', image: require('../assets/rabbit.png') },
  ];

  const handleRegister = async () => {
    // Number validation
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3FF' }}>
      <View style={styles.container}>
        {/* Tombol Kembali */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>もう少しおしえてね！</Text>

        {/* Tinggi Badan & Berat Badan Saat Ini */}
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

        {/* Baris 1: Tujuan dan Target Berat Badan */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>目標</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={goal}
                onValueChange={(itemValue) => setGoal(itemValue)}
                style={styles.picker}
                dropdownIconColor="#333"
                mode="dropdown"
              >
                <Picker.Item label="▼ 選択してください" value="" color="#999" />
                <Picker.Item label="体重を落としたい" value="体重を落としたい" />
                <Picker.Item label="筋肉をつけたい" value="筋肉をつけたい" />
                <Picker.Item label="健康維持したい" value="健康維持したい" />
              </Picker>
            </View>
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

        {/* Baris 2: Target Langkah dan Asupan Air */}
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

        {/* Waktu Tidur & Waktu Bangun (Baris terpisah) */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>就寝時間</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.inputInner}
                placeholder="00:00"
                placeholderTextColor="#999"
                value={sleepTime}
                onChangeText={setSleepTime}
              />
              <Text style={styles.unitInside}>{Platform.OS === 'ios' ? 'AM' : ''}</Text>
            </View>
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>起床時間</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.inputInner}
                placeholder="00:00"
                placeholderTextColor="#999"
                value={sleepTime}
                onChangeText={setWakeTime}
              />
              <Text style={styles.unitInside}>{Platform.OS === 'ios' ? 'AM' : ''}</Text>
            </View>

          </View>
        </View>

        {/* Kondisi Kesehatan */}
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

        {/* Tombol Daftar */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, // Sesuaikan posisi untuk iOS/Android
    left: 24,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
    color: 'black',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputWithUnit: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputInner: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 32,
    marginBottom: 8,
    color: '#000',
    fontSize: 15,
  },
  unitInside: {
    position: 'absolute',
    right: 14,
    fontSize: 14,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  half: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 8,
    marginBottom: 8,
    height: Platform.OS === 'ios' ? 50 : 48,
    justifyContent: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 6 : 0,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 48,
    width: '100%',
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    marginBottom: 28,
  },
  healthItem: {
    alignItems: 'center',
    padding: 6,
  },
  selectedHealth: {
    borderColor: '#CFC6FF',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#E8E0FF',
  },
  healthLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#333',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});