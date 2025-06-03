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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserRegister } from '../contexts/UserRegisterContext';

type RootStackParamList = {
  Register2: undefined;
  ChoosePetScreen: undefined;
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
  const [goal, setGoal] = useState('null');
  const [health, setHealth] = useState('元気');
  const [steps, setSteps] = useState('');
  const [goalWeight, setGoalWeight] = useState('');

   const healthOptions = [
    { label: '元気', image: require('../assets/rabbit.png') },
    { label: '疲れ', image: require('../assets/rabbit.png') },
    { label: '病気', image: require('../assets/rabbit.png') },
  ];
  
  const handleRegister = async () => {
    const fullData = {
      ...userData,
      weight: parseInt(weight) || 0,
      height: parseInt(height) || 0,
      goal,
      health,
      steps: steps === '' ? 0 : parseInt(steps),
      goalWeight: goalWeight === '' ? 0 : parseInt(goalWeight),
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      Alert.alert('登録完了', 'ユーザー情報が正常に登録されました。');
      navigation.navigate('ChoosePetScreen');
  } catch (error) {
      console.error('Error during registration:', error); 
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>もう少しおしえてね！</Text>

      {/* 身長・体重 */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>身長</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={styles.inputInner}
              placeholder=""
              placeholderTextColor="#000"
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
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.unitInside}>kg</Text>
          </View>
        </View>
      </View>

      {/* 目標 */}
      <Text style={styles.label}>目標</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={goal}
          onValueChange={(itemValue) => setGoal(itemValue)}
          style={styles.picker}
          dropdownIconColor="#000"
          mode="dropdown"
        >
          <Picker.Item label="▼ 選択してください" value="" color="#999" />
          <Picker.Item label="体重を落としたい" value="体重を落としたい" />
          <Picker.Item label="筋肉をつけたい" value="筋肉をつけたい" />
          <Picker.Item label="健康維持したい" value="健康維持したい" />
        </Picker>
      </View>

      {/* 目標歩数・kg数 */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>目標歩数</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={styles.inputInner}
              placeholder=""
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={steps}
              onChangeText={setSteps}
            />
            <Text style={styles.unitInside}>cm</Text>
          </View>
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>目標体重</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={styles.inputInner}
              placeholder=""
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={goalWeight}
              onChangeText={setGoalWeight}
            />
            <Text style={styles.unitInside}>kg</Text>
          </View>
        </View>
      </View>

      {/* 健康状態 */}
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

      {/* 登録ボタン */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!goal) {
            alert('目標を選択してください');
            return;
          }
          handleRegister();
        }}
      >
        <Text style={styles.buttonText}>登録</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  half: {
    flex: 0.48,
  },
  inputWithUnit: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputInner: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 32,
    paddingVertical: 8,
    marginBottom: 8,
    color: '#000',
  },
  unitInside: {
    position: 'absolute',
    right: 10,
    fontSize: 14,
    color: '#000',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 35,
    height: Platform.OS === 'ios' ? 50 : 48,
    justifyContent: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 6 : 0,
    overflow: 'hidden',
  },
  picker: {
    marginBottom:35,
    height: Platform.OS === 'ios' ? 180 : 48,
    width: '100%',
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
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
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#CFC6FF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
